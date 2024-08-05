import { v4 as uuid } from "uuid";
import { db } from "~/server/db";

export const getVerificationTokenByEmail = async (email: string) => {
  try {
    const verficationToken = await db.verificationToken.findFirst({
      where: { email },
    });
    return verficationToken;
  } catch (error) {
    return null;
  }
};

export const getVerificationTokenByToken = async (token: string) => {
  try {
    const verificationToken = await db.verificationToken.findUnique({
      where: { token },
    });
    return verificationToken;
  } catch (error) {
    return null;
  }
};

export const getResetTokenByEmail = async (email: string) => {
  try {
    const resetToken = await db.resetToken.findFirst({
      where: { email },
    });
    return resetToken;
  } catch (error) {
    return null;
  }
};

export const getResetTokenByToken = async (token: string) => {
  try {
    const resetToken = await db.resetToken.findFirst({
      where: { token },
    });
    return resetToken;
  } catch (error) {
    return null;
  }
};

export const generateVerificationToken = async (email: string) => {
  const token = uuid();
  const expires = new Date(new Date().getTime() + 3600 * 1000);
  const existingToken = await getVerificationTokenByEmail(email);
  if (existingToken)
    await db.verificationToken.delete({
      where: {
        id: existingToken.id,
      },
    });
  const verficationToken = await db.verificationToken.create({
    data: {
      token,
      email,
      expires_at: expires, //set one hour of validity for the token ,
    },
  });
  return verficationToken;
};

export const generateResetToken = async (email: string) => {
  const token = uuid();
  const expires = new Date(new Date().getTime() + 3600 * 1000);
  const existingToken = await getResetTokenByEmail(email);
  if (existingToken)
    await db.resetToken.delete({
      where: {
        id: existingToken.id,
      },
    });
  const resetToken = await db.resetToken.create({
    data: {
      token,
      email,
      expires_at: expires, //set one hour of validity for the token ,
    },
  });
  return resetToken;
};
