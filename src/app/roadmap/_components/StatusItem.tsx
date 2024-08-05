import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { CommentsIcon } from "~/components/CommentsIcon";
import { Status } from "~/components/Status";
import { Category } from "~/components/ui/Category";
import { Upvotes } from "~/components/Upvotes";
import { cn } from "~/lib/utils";
import type { BasicFeedback } from "~/store/feedback";

type Props = {
  text: "Planned" | "In-Progress" | "Live";
  feedback: BasicFeedback;
};

export const StatusItem = ({ text, feedback }: Props) => {
  const { data: session } = useSession();
  const router = useRouter();
  const isUpvoted = session?.user?.feedbackUpvote.find(
    (upvote) => upvote.feedbackId === feedback.id,
  );
  let background;
  let borderColor;
  switch (text) {
    case "Planned":
      background = "bg-orange-400";
      borderColor = "border-orange-400";
      break;
    case "In-Progress":
      background = "bg-purple-600";
      borderColor = "border-purple-600";

      break;
    case "Live":
      background = "bg-blue-600";
      borderColor = "border-blue-600";

      break;

    default:
      background = "bg-orange-400";
      borderColor = "border-orange-400";

      break;
  }

  return (
    <div className="relative">
      <Upvotes
        upvotes={feedback.upvotes}
        className="flex-col mobile:flex-row mobile:gap-x-2"
        id={feedback.id}
        isUpvoted={isUpvoted ? true : false}
      />
      <div
        onClick={() => router.push(`/suggestion/${feedback.id}`)}
        className={cn(
          "mb-4 rounded-md border-t-[6px] bg-white px-8 pb-6 shadow-sm",
          borderColor,
        )}
      >
        <Status text={text} background={background} />

        <h2 className="mt-2 text-lg text-dark-blue tablet:text-[13px]">
          {feedback.title}
        </h2>

        <p className="mb-4 mt-1">{feedback.detail}</p>
        <Category text="Feature" />

        <CommentsIcon commentsLength={feedback.comments.length} />
      </div>
    </div>
  );
};
