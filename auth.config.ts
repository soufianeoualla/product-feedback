import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import type { NextAuthConfig } from "next-auth";
import { loginSchema } from "./schemas";
import bcrypt from "bcryptjs";
import { getUserbyEmail } from "~/lib/user";

export default {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_SECRET_KEY,
    }),
    Credentials({
      //@ts-expect-error authorize
      async authorize(credentials) {
        const validateFields = loginSchema.safeParse(credentials);

        if (validateFields.success) {
          const { email, password } = validateFields.data;

          const user = await getUserbyEmail(email);

          if (user?.password) {
            const isPasswordMatch = await bcrypt.compare(
              password,
              user.password,
            );

            if (isPasswordMatch) return user;
          }
        }
        return null;
      },
    }),
  ],
} satisfies NextAuthConfig;
