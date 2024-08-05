import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import authConfig from "./auth.config";
import type { Adapter } from "next-auth/adapters";
import { getUserById } from "~/lib/user";
import { db } from "~/server/db";
import type { FeedbackUpvote, Role } from "@prisma/client";

declare module "next-auth" {
  interface User {
    role: Role;
    feedbackUpvote: FeedbackUpvote[];
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  callbacks: {
    async signIn({ user, account, }) {
      if (account?.provider !== "credentials") return true;

      const existingUser = await getUserById(user.id!);
      if (!existingUser) return false;
      if (!existingUser.emailVerified) return false;

      return true;
    },

    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }

      if (!session.user) return session;
      const existingUser = await getUserById(session.user.id);
      if (!existingUser) return session;
      session.user.role = existingUser.role;
      session.user.feedbackUpvote = existingUser.feedbackUpvote;
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
  },
  events: {
    async linkAccount({ user }) {
      await db.user.update({
        where: { id: user.id },
        data: {
          emailVerified: new Date(),
        },
      });
    },
  },
  adapter: PrismaAdapter(db) as Adapter,
  session: { strategy: "jwt" },
  ...authConfig,
});
