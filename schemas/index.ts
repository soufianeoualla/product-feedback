import { z } from "zod";

export const newFeedbackSchema = z.object({
  feedbackTitle: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  category: z.enum(["UI", "UX", "Enhancement", "Bug", "Feature"], {
    message: "Category is required",
  }),
  feedbackDetail: z.string().min(10, {
    message: "Feedback Detail must be at least 10 characters.",
  }),
});

export const editFeedbackSchema = z.object({
  feedbackTitle: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  category: z.enum(["UI", "UX", "Enhancement", "Bug", "Feature"], {
    message: "Category is required",
  }),
  status: z.enum(["Suggestion", "Planned", "InProgress", "Live"], {
    message: "Status is required",
  }),
  feedbackDetail: z.string().min(10, {
    message: "Feedback Detail must be at least 10 characters.",
  }),
  id: z.string(),
});

export const addCommentSchema = z.object({
  content: z.string().min(2, {
    message: "Comment cannot be empty",
  }),
  id: z.string(),
});

export const editCommentSchema = z.object({
  content: z.string().min(2, {
    message: "Comment cannot be empty",
  }),
  id: z.number(),
});

export const addReplySchema = z.object({
  content: z.string().min(2, {
    message: "Comment cannot be empty",
  }),
  commentId: z.number(),
  parentId: z.number(),
});
export const feedbackUpvoteSchema = z.object({
  id: z.string(),
});

export const loginSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
});

export const registerSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
  name: z.string().min(1, {
    message: "Name is required",
  }),
  username: z.string().min(1, {
    message: "Username is required",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
});

export const sendRestLinkSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
});

export const ResetPasswordSchema = z
  .object({
    token: z.string(),
    password: z.string().min(6, {
      message: "New Password must be at least 6 characters.",
    }),
    confirmPassword: z.string(),
  })
  .refine(
    (values) => {
      return values.password === values.confirmPassword;
    },
    {
      message: "Not matched !",
      path: ["confirmPassword"],
    },
  );
