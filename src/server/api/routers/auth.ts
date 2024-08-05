import { createTRPCRouter, publicProcedure } from "../trpc";
import {
  registerSchema,
  ResetPasswordSchema,
  sendRestLinkSchema,
} from "schemas";
import { z } from "zod";
import {
  registerHandler,
  sendResetLinkHandler,
  resetPasswordHandler,
  verifyEmailHandler,
} from "~/server/controllers/auth.controller";

const authRouter = createTRPCRouter({
  createUser: publicProcedure
    .input(registerSchema)
    .mutation(({ input }) => registerHandler({ input })),
  verifyEmail: publicProcedure
    .input(
      z.object({
        token: z.string(),
      }),
    )
    .mutation(({ input }) => verifyEmailHandler({ input })),

  sendResetLink: publicProcedure
    .input(sendRestLinkSchema)
    .mutation(({ input }) => sendResetLinkHandler({ input })),
  resetPassword: publicProcedure
    .input(ResetPasswordSchema)
    .mutation(async ({ input }) => {
      await resetPasswordHandler({ input });
    }),
});

export default authRouter;
