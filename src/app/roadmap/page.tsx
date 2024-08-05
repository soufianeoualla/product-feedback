"use client";
import { GobackBtn } from "~/components/GobackBtn";
import { Header } from "~/components/Header";
import { Column } from "./_components/Column";
import { useFeedbacksStore } from "~/store/feedback";
import type { BasicFeedback } from "~/store/feedback";
import { api } from "~/trpc/react";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "~/lib/utils";

const Page = () => {
  const { feedbacks, setFeedbacks } = useFeedbacksStore();
  const [selectedFeedbacks, setSelectedFeedbacks] = useState(1);
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
    <>
      <div className="mx-auto max-w-[1100px] py-20 tablet:px-4 mobile:p-0">
        <Header>
          <div>
            <GobackBtn className="text-white" iconColor="white" />
            <h1 className="text-2xl text-white mobile:text-lg">Roadmap</h1>
          </div>
        </Header>

        <div className="mt-12 grid grid-cols-3 gap-8 tablet:gap-x-2.5 tablet:text-[13px] mobile:hidden">
          {columns.map((column) => (
            <Column
              key={column.label}
              feedbacks={column.feedbacks}
              description={column.description}
              label={column.label}
            />
          ))}
        </div>
        <div className="hidden mobile:block">
          <div className="flex w-full items-center justify-between bg-white">
            {columns.map((column, index) => (
              <span
                onClick={() => setSelectedFeedbacks(index)}
                key={column.label}
                className={cn(
                  "flex w-[125px] items-center justify-center border-b border-b-slate-100 pb-4 pt-5 text-[13px] font-bold text-neutral-400",
                  selectedFeedbacks === index &&
                    "border-b-[3px] border-b-primary text-dark-blue",
                )}
              >
                {column.label} ({column.feedbacks.length})
              </span>
            ))}
          </div>
          <Column
            feedbacks={columns[selectedFeedbacks]!.feedbacks}
            description={columns[selectedFeedbacks]!.description}
            label={columns[selectedFeedbacks]!.label}
          />
        </div>
      </div>
    </>
  );
};

export default Page;
