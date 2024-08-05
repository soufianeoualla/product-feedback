"use client";
import Image from "next/image";
import { useEffect } from "react";
import { type BasicFeedback, useFeedbacksStore } from "~/store/feedback";
import { SuggestionItem } from "~/components/SuggestionItem";
import { Button } from "~/components/ui/button";
import { useSession } from "next-auth/react";
import Link from "next/link";

export const Suggestions = ({
  feedbacksData,
}: {
  feedbacksData: BasicFeedback[];
}) => {
  const { feedbacks, setFeedbacks } = useFeedbacksStore();
  const { status } = useSession();
  useEffect(() => {
    if (feedbacksData) setFeedbacks(feedbacksData);
  }, [feedbacksData, setFeedbacks]);

const suggestions = feedbacks.filter(item=>item.status === 'Suggestion')

  if (feedbacks.length === 0)
    return (
      <div className="mt-20 flex flex-col items-center justify-center">
        <Image
          src={"/assets/illustration-empty.svg"}
          width={130}
          height={140}
          alt="empty"
        />
        <h1 className="mb-4 mt-12 text-2xl tracking-[-0.33px] text-dark-blue">
          There is no feedback yet.
        </h1>
        <p className="mb-12">
          Got a suggestion? Found a bug that needs to be squashed? We love
          hearing about new ideas to improve our app.
        </p>
        <Button asChild variant={"primary"} size={"lg"}>
          <Link
            href={status === "authenticated" ? "/new-feedback" : "/auth/login"}
          >
            + Add Feedback
          </Link>
        </Button>
      </div>
    );
  return (
    <div className="mt-6 w-full mobile:px-3">
      {suggestions.map((item) => (
        <SuggestionItem key={item.id} suggestion={item} />
      ))}
    </div>
  );
};
