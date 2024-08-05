import {
  addCommentSchema,
  addReplySchema,
  editCommentSchema,
  editFeedbackSchema,
  newFeedbackSchema,
} from "schemas";
import { createTRPCRouter, publicProcedure } from "../trpc";
import {
  addFeedback,
  editFeedback,
  getEditedFeedback,
  getFeedback,
  getFeedbacks,
  addComment,
  addReply,
  feedbackUpvoteHandler,
  deleteFeedback,
  deleteComment,
  editComment,
} from "~/server/controllers/feedback.controller";
import { z } from "zod";

export const feedbackRouter = createTRPCRouter({
  getFeedbacks: publicProcedure.query(() => getFeedbacks()),
  getFeedback: publicProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(({ input }) => getFeedback({ input })),
  newFeedback: publicProcedure
    .input(newFeedbackSchema)
    .mutation(({ input }) => addFeedback({ input })),
  editFeedback: publicProcedure
    .input(editFeedbackSchema)
    .mutation(({ input }) => editFeedback({ input })),
  getEditedFeedback: publicProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(({ input }) => getEditedFeedback({ input })),
  deleteFeedback: publicProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(({ input }) => deleteFeedback({ input })),
  feedbackUpvoteHandler: publicProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(({ input }) => feedbackUpvoteHandler({ input })),
  addComment: publicProcedure
    .input(addCommentSchema)
    .mutation(({ input }) => addComment({ input })),
    editComment: publicProcedure
    .input(editCommentSchema)
    .mutation(({ input }) => editComment({ input })),
  addReply: publicProcedure
    .input(addReplySchema)
    .mutation(({ input }) => addReply({ input })),
  deleteComment: publicProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .mutation(({ input }) => deleteComment({ input })),
});
