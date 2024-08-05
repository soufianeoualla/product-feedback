"use server";
import { signIn } from "auth";
import { sendVerificationEmail } from "email";
import { AuthError } from "next-auth";
import { loginSchema } from "schemas";
import type { z } from "zod";
import { generateVerificationToken } from "~/lib/tokens";
import { getUserbyEmail } from "~/lib/user";
import { db } from "~/server/db";

export const loginHandler = async (values: z.infer<typeof loginSchema>) => {
  const validateFields = loginSchema.safeParse(values);
  if (!validateFields.success) {
    return { error: "Invalid fields" };
  }

  const { email, password } = validateFields.data;
  const user = await getUserbyEmail(email);

  if (!user) {
    return { error: "User not found" };
  }

  if (!user.emailVerified) {
    const verificationToken = await generateVerificationToken(email);
    await sendVerificationEmail(
      verificationToken.email,
      user.name,
      verificationToken.token,
    );

    return {
      error: "Email is not verified, another confirmation email is sent!",
    };
  }
  try {
    await signIn("credentials", { email, password });
    return { url: "/" };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials!" };
        default:
          console.error(error);
          return { error: "Internal server error" };
      }
    }
  }
};
