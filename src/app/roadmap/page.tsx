"use client";
import { GobackBtn } from "~/components/GobackBtn";
import { Header } from "~/components/Header";
import { Column } from "./_components/Column";
import { useFeedbacksStore } from "~/store/feedback";
import type { BasicFeedback } from "~/store/feedback";
import { api } from "~/trpc/react";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

const Page = () => {
  const { feedbacks, setFeedbacks } = useFeedbacksStore();
  const {
    data: feedbacksData,
    isLoading,
    isFetching,
  } = api.feedback.getFeedbacks.useQuery();
  useEffect(() => {
    if (feedbacksData) setFeedbacks(feedbacksData);
  }, [feedbacksData, setFeedbacks]);

  const plannedFeedbacks = feedbacks?.filter(
    (item) => item.status === "Planned",
  );
  const inProgressFeedbacks = feedbacks?.filter(
    (item) => item.status === "InProgress",
  );
  const liveFeedbacks = feedbacks?.filter((item) => item.status === "Live");

  type column = {
    label: "Planned" | "In-Progress" | "Live";
    description: string;
    feedbacks: BasicFeedback[];
  };
  const columns: column[] = [
    {
      label: "Planned",
      description: "Ideas prioritized for research",
      feedbacks: plannedFeedbacks,
    },
    {
      label: "In-Progress",
      description: "Currently being developed",
      feedbacks: inProgressFeedbacks,
    },
    {
      label: "Live",
      description: "Released features",
      feedbacks: liveFeedbacks,
    },
  ];
  if (isLoading || isFetching)
    return (
      <div className="mt-80 flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" />
      </div>
    );

  return (
    <div className="tablet:px-4 mx-auto max-w-[1100px] py-20">
      <Header>
        <div>
          <GobackBtn className="text-white" iconColor="white" />
          <h1 className="text-2xl text-white">Roadmap</h1>
        </div>
      </Header>

      <div className="tablet:gap-x-2.5 tablet:text-[13px] mt-12 grid grid-cols-3 gap-8">
        {columns.map((column) => (
          <Column
            key={column.label}
            feedbacks={column.feedbacks}
            description={column.description}
            label={column.label}
          />
        ))}
      </div>
    </div>
  );
};

export default Page;
