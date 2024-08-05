import { db } from "~/server/db";

export const getUserbyEmail = async (email: string) => {
  try {
    return await db.user.findUnique({
      where: { email },
    });
  } catch (error) {
    return null;
  }
};
export const getUserById = async (id: string) => {
  try {
    return await db.user.findUnique({
      where: { id },
      include: {
        feedbackUpvote: true,
      },
    });
  } catch (error) {
    return null;
  }
};

export const getUserbyUsername = async (username: string) => {
  try {
    return await db.user.findUnique({
      where: { username },
    });
  } catch (error) {
    return null;
  }
};
