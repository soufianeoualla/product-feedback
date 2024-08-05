import { useSession } from "next-auth/react";
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
    <div
      className={cn(
        "rounded-md border-t-[6px] bg-white px-8 pb-6 shadow-sm  mb-4",
        borderColor,
      )}
    >
      
        <Status text={text} background={background} />
        <h2 className="mt-2 text-lg tablet:text-[13px] text-dark-blue">{feedback.title}</h2>
        <p className="mb-4 mt-1">{feedback.detail}</p>
        <Category text="Feature" />
        <div className="mt-6 flex items-center justify-between">
          <Upvotes
            upvotes={feedback.upvotes}
            className="static inset-0 translate-y-0 flex-row gap-2"
            id={feedback.id}
            isUpvoted={isUpvoted ? true : false}
          />
          <CommentsIcon commentsLength={feedback.comments.length} />
        </div>
 
    </div>
  );
};
