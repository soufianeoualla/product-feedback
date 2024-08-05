import { TRPCError } from "@trpc/server";
import bcrypt from "bcryptjs";
import { db } from "../db";
import { registerSchema, ResetPasswordSchema } from "schemas";
import {
  generateResetToken,
  generateVerificationToken,
  getResetTokenByToken,
  getVerificationTokenByToken,
} from "~/lib/tokens";
import { sendResetLinkEmail, sendVerificationEmail } from "email";
import type { sendRestLinkSchema } from "schemas";
import type { z } from "zod";
import { getUserbyEmail } from "~/lib/user";

export const registerHandler = async ({
  input,
}: {
  input: z.infer<typeof registerSchema>;
}) => {
  try {
    const validateFields = registerSchema.safeParse(input);
    if (!validateFields.success) {
      throw new TRPCError({
        code: "PARSE_ERROR",
        message: "Invalid fields",
      });
    }

    const { email, name, password, username } = validateFields.data;
    const isEmailExist = await getUserbyEmail(email);
    if (isEmailExist) {
      throw new TRPCError({
        code: "CONFLICT",
        message: "Email already exists",
      });
    }
    const isUsernameExist = await getUserbyEmail(email);
    if (isUsernameExist) {
      throw new TRPCError({
        code: "CONFLICT",
        message: "Username already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    await db.user.create({
      data: {
        username,
        email,
        name,
        password: hashedPassword,
      },
    });
    const verificationToken = await generateVerificationToken(email);
    await sendVerificationEmail(
      verificationToken.email,
      name,
      verificationToken.token,
    );
  } catch (error) {
    throw error;
  }
};

export const sendResetLinkHandler = async ({
  input,
}: {
  input: z.infer<typeof sendRestLinkSchema>;
}) => {
  const { email } = input;
  const user = await getUserbyEmail(email);
  if (!user) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "User not found",
    });
  }
  const resetToken = await generateResetToken(email);
  await sendResetLinkEmail(email, user.name, resetToken.token);
};

export const resetPasswordHandler = async ({
  input,
}: {
  input: z.infer<typeof ResetPasswordSchema>;
}) => {
  const validateFields = ResetPasswordSchema.safeParse(input);
  if (!validateFields.success) {
    throw new TRPCError({
      code: "PARSE_ERROR",
      message: "Invalid fields",
    });
  }
  const { password, token } = validateFields.data;
  const existingToken = await getResetTokenByToken(token);
  if (!existingToken) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Invalid Token",
    });
  }

  const isExpired = new Date(existingToken.expires_at) < new Date();
  if (isExpired) {
    throw new TRPCError({
      code: "PRECONDITION_FAILED",
      message: "Token has expired",
    });
  }

  const user = await getUserbyEmail(existingToken.email);

  if (!user) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "User not found",
    });
  }
  const hashedPassword = await bcrypt.hash(password, 10);

  await db.user.update({
    where: {
      id: user.id,
    },
    data: {
      password: hashedPassword,
    },
  });
};

export const verifyEmailHandler = async ({
  input,
}: {
  input: {
    token: string;
  };
}) => {
  const { token } = input;
  const existingToken = await getVerificationTokenByToken(token);
  if (!existingToken) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Invalid Token",
    });
  }

  const user = await getUserbyEmail(existingToken.email);
  if (!user) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "User not found",
    });
  }
  const isExpired = new Date(existingToken.expires_at) < new Date();
  if (isExpired) {
    throw new TRPCError({
      code: "PRECONDITION_FAILED",
      message: "Token has expired",
    });
  }
  await db.user.update({
    where: { id: user.id },
    data: {
      emailVerified: new Date(),
      email: existingToken.email,
    },
  });

  await db.verificationToken.delete({
    where: { id: existingToken.id },
  });
};
