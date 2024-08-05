import { Category } from "./ui/Category";
import { Upvotes } from "./Upvotes";
import { CommentsIcon } from "./CommentsIcon";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

import type { Comment, Feedback } from "@prisma/client";

type ExtendedFeedback = Feedback & { comments: Comment[] };

type Props = {
  suggestion: ExtendedFeedback;
};

export const SuggestionItem = ({ suggestion }: Props) => {
  const { category, comments, detail, upvotes, title, id } = suggestion;
  const router = useRouter();
  const { data: session } = useSession();
  const user = session?.user;
  const isUpvoted = user?.feedbackUpvote.find(
    (upvote) => upvote.feedbackId === id,
  )
    ? true
    : false;

  return (
    <div className="relative">
      <Upvotes
        upvotes={upvotes}
        className="flex-col mobile:flex-row mobile:gap-x-2 "
        id={id}
        isUpvoted={isUpvoted ? true : false}
      />
      <div
        onClick={() => router.push(`/suggestion/${id}`)}
        className="group relative mb-5 flex w-full cursor-pointer items-center justify-between rounded-[10px] bg-white px-8 py-7 mobile:flex-col mobile:p-6"
      >
        <div className="ml-20 mobile:ml-0 mobile:mb-12">
          <h2 className="text-lg text-dark-blue group-hover:text-blue-600">
            {title}
          </h2>
          <p className="mb-3 mt-1">{detail}</p>
          <Category text={category} />
        </div>

        
        <CommentsIcon commentsLength={comments.length} />
      </div>
    </div>
  );
};
