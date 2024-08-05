"use client";
import { SuggestionItem } from "~/components/SuggestionItem";
import { Button } from "~/components/ui/button";
import { Comments } from "./Comments";
import { AddComment } from "./AddComment";
import { GobackBtn } from "~/components/GobackBtn";
import { useParams, useRouter } from "next/navigation";
import { api } from "~/trpc/react";
import { Loader2 } from "lucide-react";
import { useFeedbacksStore } from "~/store/feedback";
import { useEffect } from "react";
import { useSession } from "next-auth/react";

export const SuggestionWrapper = () => {
  const { feedback, setFeedback } = useFeedbacksStore();
  const { data: session } = useSession();
  const { suggestionID } = useParams();
  const router = useRouter();
  const { data, isLoading, isFetching } = api.feedback.getFeedback.useQuery(
    {
      id: (suggestionID as string) ?? "",
    },
    { enabled: !!suggestionID },
  );

  useEffect(() => {
    if (data) setFeedback(data);
  }, [data, setFeedback]);

  if (isLoading || isFetching)
    return (
      <div className="mt-80 flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" />
      </div>
    );
  if (!data) {
    router.push("/");
    return null;
  }

  return (
    <div className="mx-auto max-w-[730px] py-20 tablet:px-4">
      <div className="mb-6 flex items-center justify-between">
        <GobackBtn />
        {session?.user && session.user.id === feedback.userId && (
          <Button
            onClick={() => router.push(`/edit-feedback?id=${feedback.id}`)}
            variant={"secondary"}
            size={"lg"}
          >
            Edit Feedback
          </Button>
        )}
      </div>
      <SuggestionItem suggestion={data} />
      {feedback.comments && feedback.comments.length > 0 && (
        <Comments comments={feedback.comments} />
      )}
      <AddComment />
    </div>
  );
};
