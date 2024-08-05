"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { cn } from "~/lib/utils";
import { api } from "~/trpc/react";
import { ChevronUp } from "lucide-react";

type Props = {
  upvotes: number;
  className?: string;
  id: string;
  isUpvoted: boolean;
};

export const Upvotes = ({ upvotes, className, id, isUpvoted }: Props) => {
  const [isUserUpvoted, setIsUserUpvoted] = useState(isUpvoted);
  const [currentUpvotes, setCurrentUpvotes] = useState<number>(upvotes);
  const router = useRouter();
  const { status } = useSession();
  const { mutate: feedbackUpvoteHandler } =
    api.feedback.feedbackUpvoteHandler.useMutation({});

  const onClick = () => {
    if (status === "unauthenticated") {
      toast.error("Your are not authenticated ");
      return router.push("/auth/login");
    }

    setIsUserUpvoted(!isUserUpvoted);
    setCurrentUpvotes((prev) => (isUserUpvoted ? prev - 1 : prev + 1));
    feedbackUpvoteHandler({ id });
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        "absolute left-8 mobile:bottom-0 top-1/2 z-10 flex -translate-y-1/2 cursor-pointer items-center justify-center rounded-[10px] bg-slate-100 p-2.5 hover:bg-blue-100 disabled:opacity-50",
        className,
        isUserUpvoted && "bg-[#4661E6] text-white",
      )}
    >
      <ChevronUp
        className={cn("text-blue-600", isUserUpvoted && "text-white")}
        width={18}
      />
      <b
        className={cn(
          "text-[13px] text-dark-blue",
          isUserUpvoted && "text-white",
        )}
      >
        {currentUpvotes}
      </b>
    </button>
  );
};
