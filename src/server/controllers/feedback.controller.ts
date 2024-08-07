import { TRPCError } from "@trpc/server";
import { auth } from "auth";
import {
  newFeedbackSchema,
  editFeedbackSchema,
  addCommentSchema,
  addReplySchema,
  feedbackUpvoteSchema,
  editCommentSchema,
} from "schemas";
import type { z } from "zod";
import { db } from "../db";

export const getFeedbacks = async () => {
  try {
    const feedbacks = await db.feedback.findMany({
      include: {
        comments: {
          include: {
            replies: true,
          },
        },
      },
      orderBy: { created_at: "desc" },
    });
    return feedbacks;
  } catch (error) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "INTERNAL_SERVER_ERROR",
    });
  }
};

export const getFeedback = async ({
  input,
}: {
  input: {
    id: string;
  };
}) => {
  const { id } = input;
  try {
    const feedback = await db.feedback.findUnique({
      where: {
        id,
      },
      include: {
        comments: {
          include: {
            user: true,
            replies: {
              include: {
                user: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });
    return feedback;
  } catch (error) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Feedback not found",
    });
  }
};

export const addFeedback = async ({
  input,
}: {
  input: z.infer<typeof newFeedbackSchema>;
}) => {
  const validateFields = newFeedbackSchema.safeParse(input);
  if (!validateFields.success) {
    throw new TRPCError({
      code: "PARSE_ERROR",
      message: "Invalid fields",
    });
  }
  const session = await auth();
  const user = session?.user;
  if (!user?.id) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Your not logged in",
    });
  }

  const { category, feedbackDetail, feedbackTitle } = validateFields.data;

  const feedback = await db.feedback.create({
    data: {
      category,
      title: feedbackTitle,
      detail: feedbackDetail,
      userId: user.id,
    },
    include: {
      comments: {
        include: {
          replies: true,
        },
      },
    },
  });
  return feedback;
};

export const editFeedback = async ({
  input,
}: {
  input: z.infer<typeof editFeedbackSchema>;
}) => {
  const validateFields = editFeedbackSchema.safeParse(input);
  if (!validateFields.success) {
    throw new TRPCError({
      code: "PARSE_ERROR",
      message: "Invalid fields",
    });
  }
  const session = await auth();
  const user = session?.user;
  if (!user) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Your not logged in",
    });
  }
  const { category, feedbackDetail, feedbackTitle, id, status } =
    validateFields.data;

  const existingFeedback = await db.feedback.findUnique({
    where: {
      id,
    },
  });
  if (!existingFeedback) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Feedback not found",
    });
  }

  const feedback = await db.feedback.update({
    where: {
      id,
    },
    data: {
      category,
      title: feedbackTitle,
      detail: feedbackDetail,
      status,
    },
    include: {
      comments: {
        include: {
          user: true,
          replies: {
            include: {
              user: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });
  return feedback;
};

export const deleteFeedback = async ({
  input,
}: {
  input: {
    id: string;
  };
}) => {
  const session = await auth();
  const user = session?.user;
  if (!user) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Your not logged in",
    });
  }
  const { id } = input;

  const feedback = await db.feedback.findUnique({
    where: {
      id,
    },
  });
  if (!feedback) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Feedback not found",
    });
  }

  await db.comment.deleteMany({
    where: {
      feedbackId: feedback.id,
    },
  });
  await db.feedbackUpvote.deleteMany({
    where: {
      feedbackId: feedback.id,
    },
  });
  await db.feedback.delete({
    where: {
      id,
    },
  });
};
export const getEditedFeedback = async ({
  input,
}: {
  input: { id: string };
}) => {
  const { id } = input;
  try {
    const feedback = await db.feedback.findUnique({
      where: {
        id,
      },
    });
    return feedback;
  } catch (error) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Feedback not found",
    });
  }
};

export const addComment = async ({
  input,
}: {
  input: z.infer<typeof addCommentSchema>;
}) => {
  const validateFields = addCommentSchema.safeParse(input);
  if (!validateFields.success) {
    throw new TRPCError({
      code: "PARSE_ERROR",
      message: "Invalid fields",
    });
  }
  const session = await auth();
  const user = session?.user;
  if (!user?.id) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Your not logged in",
    });
  }

  const { content, id } = validateFields.data;

  const feedback = await db.feedback.findUnique({
    where: { id },
  });

  if (!feedback) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Feedback not found",
    });
  }

  const comment = await db.comment.create({
    data: {
      userId: user.id,
      content,
      feedbackId: id,
    },
    include: {
      user: true,
      replies: {
        include: {
          user: true,
        },
      },
    },
  });
  return comment;
};

export const editComment = async ({
  input,
}: {
  input: z.infer<typeof editCommentSchema>;
}) => {
  const validateFields = editCommentSchema.safeParse(input);
  if (!validateFields.success) {
    throw new TRPCError({
      code: "PARSE_ERROR",
      message: "Invalid fields",
    });
  }
  const session = await auth();
  const user = session?.user;
  if (!user?.id) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Your not logged in",
    });
  }

  const { content, id } = validateFields.data;

  const comment = await db.comment.findUnique({
    where: { id },
  });

  if (!comment) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "comment not found",
    });
  }

  const editedcomment = await db.comment.update({
    where: {
      id,
    },
    data: {
      content,
    },
  });
  return editedcomment;
};

export const addReply = async ({
  input,
}: {
  input: z.infer<typeof addReplySchema>;
}) => {
  const validateFields = addReplySchema.safeParse(input);
  if (!validateFields.success) {
    throw new TRPCError({
      code: "PARSE_ERROR",
      message: "Invalid fields",
    });
  }
  const session = await auth();
  const user = session?.user;
  if (!user?.id) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Your not logged in",
    });
  }

  const { content, parentId, commentId } = validateFields.data;

  const parentComment = await db.comment.findUnique({
    where: { id: parentId },
  });

  if (!parentComment) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Comment not found",
    });
  }

  const comment = await db.comment.findUnique({
    where: { id: commentId },
    include: {
      user: true,
    },
  });

  if (!comment || !comment.user) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Comment not found",
    });
  }

  const reply = await db.comment.create({
    data: {
      reply_To: comment.user?.username,
      userId: user.id,
      content,
      parentId,
      feedbackId: comment.feedbackId,
    },
    include: {
      user: true,
      replies: {
        include: {
          user: true,
        },
      },
    },
  });
  return reply;
};

export const feedbackUpvoteHandler = async ({
  input,
}: {
  input: z.infer<typeof feedbackUpvoteSchema>;
}) => {
  const session = await auth();
  const user = session?.user;
  if (!user?.id) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Your not logged in",
    });
  }
  const validateFields = feedbackUpvoteSchema.safeParse(input);
  if (!validateFields.success) {
    throw new TRPCError({
      code: "PARSE_ERROR",
      message: "Invalid fields",
    });
  }
  const { id } = validateFields.data;

  const feedback = await db.feedback.findUnique({
    where: { id },
  });

  if (!feedback) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Feedback not found",
    });
  }

  const isAlreadyUpvoted = await db.feedbackUpvote.findFirst({
    where: {
      userId: user.id,
      feedbackId: id,
    },
  });

  if (isAlreadyUpvoted) {
    // User has already upvoted this feedback, remove the upvote
    await db.feedbackUpvote.delete({
      where: {
        userId_feedbackId: {
          userId: user.id,
          feedbackId: id,
        },
      },
    });
    await db.feedback.update({
      where: { id },
      data: {
        upvotes: {
          decrement: 1,
        },
      },
    });
  } else {
    // User has not upvoted this feedback, add the upvote
    await db.feedbackUpvote.create({
      data: {
        userId: user.id,
        feedbackId: id,
      },
    });

    // Increment the upvote count on the feedback
    await db.feedback.update({
      where: { id },
      data: {
        upvotes: {
          increment: 1,
        },
      },
    });
  }

  return feedback.upvotes;
};

export const deleteComment = async ({
  input,
}: {
  input: {
    id: number;
  };
}) => {
  const session = await auth();
  const user = session?.user;
  if (!user) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Your not logged in",
    });
  }
  const { id } = input;

  const comment = await db.comment.findUnique({
    where: {
      id,
    },
  });
  if (!comment) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Comment not found",
    });
  }

  await db.comment.deleteMany({
    where: {
      parentId: id,
    },
  });
  await db.comment.delete({
    where: {
      id,
    },
  });
};
