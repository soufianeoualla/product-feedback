import type { Feedback, Comment, User } from "@prisma/client";
import { create } from "zustand";

type BasicComment = Comment & { replies: Comment[] };

export type BasicFeedback = Feedback & { comments: BasicComment[] };

export type ExtendedReply = Comment & { user: User };

export type ExtendedComment = Comment & { user: User } & {
  replies: ExtendedReply[];
};
export type ExtendedFeedback = Feedback & { comments: ExtendedComment[] };

interface FeedbacksState {
  feedback: ExtendedFeedback;
  feedbacks: BasicFeedback[];
  setFeedback: (feedback: ExtendedFeedback) => void;
  setFeedbacks: (feedbacks: BasicFeedback[]) => void;
  addComment: (comment: ExtendedComment) => void;
  addReply: (reply: ExtendedComment) => void;
  removeComment: (id: number) => void;
  removeReply: (id: number, parentId: number) => void;
  updateComment: (id: number, content: string) => void;
  updateReply: (id: number, content: string, parentId: number) => void;
}

export const useFeedbacksStore = create<FeedbacksState>((set) => ({
  feedback: {
    id: "",
    comments: [],
    category: "Feature",
    created_at: new Date(),
    detail: "",
    upvotes: 0,
    status: "Suggestion",
    title: " ",
    userId: "",
    updated_at: new Date(),
  },
  setFeedback: (updatedFeedback) => {
    set({ feedback: updatedFeedback });
  },
  feedbacks: [],
  setFeedbacks: (updatedFeedbacks) => {
    set({ feedbacks: updatedFeedbacks });
  },

  addComment: (comment: ExtendedComment) =>
    set((state) => ({
      feedback: {
        ...state.feedback,
        comments: [...state.feedback.comments, comment],
      },
    })),

  updateComment: (id: number, content: string) =>
    set((state) => ({
      feedback: {
        ...state.feedback,
        comments: [
          ...state.feedback.comments.map((comment) =>
            comment.id === id ? { ...comment, content } : comment,
          ),
        ],
      },
    })),
  addReply: (reply: ExtendedComment) =>
    set((state) => ({
      feedback: {
        ...state.feedback,
        comments: state.feedback.comments.map((comment) =>
          comment.id === reply.parentId
            ? { ...comment, replies: [...comment.replies, reply] }
            : comment,
        ),
      },
    })),
  updateReply: (id: number, content: string, parentId: number) =>
    set((state) => ({
      feedback: {
        ...state.feedback,
        comments: state.feedback.comments.map((comment) =>
          comment.id === parentId
            ? {
                ...comment,
                replies: [
                  ...comment.replies.map((reply) =>
                    reply.id === id ? { ...reply, content } : reply,
                  ),
                ],
              }
            : comment,
        ),
      },
    })),
  removeComment: (id: number) =>
    set((state) => ({
      feedback: {
        ...state.feedback,
        comments: [
          ...state.feedback.comments.filter((comment) => comment.id !== id),
        ],
      },
    })),
  removeReply: (id: number, parentId: number) =>
    set((state) => ({
      feedback: {
        ...state.feedback,
        comments: state.feedback.comments.map((comment) =>
          comment.id === parentId
            ? {
                ...comment,
                replies: [
                  ...comment.replies.filter((reply) => reply.id !== id),
                ],
              }
            : comment,
        ),
      },
    })),
}));
