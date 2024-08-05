"use client";
import { Category } from "../../../../components/ui/Category";
import { Status } from "~/components/Status";
import Link from "next/link";
import { type BasicFeedback, useFeedbacksStore } from "~/store/feedback";
import { useEffect, useState } from "react";
import type { Category as CategoryType } from "@prisma/client";
import { categories } from "~/lib/utils";

export const Sidebar = ({
  feedbacksData,
}: {
  feedbacksData: BasicFeedback[];
}) => {
  const { setFeedbacks } = useFeedbacksStore();
  const [selectedCategory, setSelectedCategory] = useState<
    CategoryType | "All"
  >("All");

  useEffect(() => {
    let filteredFeedbacks: BasicFeedback[];
    switch (selectedCategory) {
      case "Bug":
        filteredFeedbacks = feedbacksData.filter(
          (feedback) => feedback.category === "Bug",
        );
        break;
      case "Enhancement":
        filteredFeedbacks = feedbacksData.filter(
          (feedback) => feedback.category === "Enhancement",
        );
        break;
      case "Feature":
        filteredFeedbacks = feedbacksData.filter(
          (feedback) => feedback.category === "Feature",
        );
        break;
      case "UI":
        filteredFeedbacks = feedbacksData.filter(
          (feedback) => feedback.category === "UI",
        );
        break;
      case "UX":
        filteredFeedbacks = feedbacksData.filter(
          (feedback) => feedback.category === "UX",
        );
        break;
      case "All":
        filteredFeedbacks = feedbacksData;
        break;
      default:
        filteredFeedbacks = feedbacksData;
        break;
    }
    setFeedbacks(filteredFeedbacks);
  }, [selectedCategory]);

  const plannedFeedbacks = feedbacksData.filter(
    (item) => item.status === "Planned",
  );
  const inProgressFeedbacks = feedbacksData.filter(
    (item) => item.status === "InProgress",
  );
  const liveFeedbacks = feedbacksData.filter((item) => item.status === "Live");

  return (
    <aside className="sticky left-0 top-0 w-full self-start tablet:static tablet:grid tablet:grid-cols-3 tablet:items-center tablet:gap-x-2.5 mobile:grid-cols-1">
      <div className="flex h-[137px] w-full flex-col justify-end rounded-[10px] bg-gradient-to-bl from-rose-500 from-[0%] via-purple-500 via-[53%] to-blue-500 to-[100%] p-6 text-white tablet:h-[178px] mobile:hidden">
        <h2 className="text-xl tracking-[-0.25px]">Frontend Mentor</h2>
        <p className="font-medium text-white text-opacity-70">Feedback Board</p>
      </div>

      <div className="my-6 flex w-full flex-wrap items-center gap-2 rounded-[10px] bg-white p-6 tablet:h-[178px]">
        <Category
          text="All"
          setSelectedCategory={setSelectedCategory}
          selectedCategory={selectedCategory}
          className="hover:bg-blue-600 hover:text-white"
        />
        {categories.map((category, index) => (
          <Category
            key={index}
            text={category}
            setSelectedCategory={setSelectedCategory}
            selectedCategory={selectedCategory}
            className="hover:bg-blue-600 hover:text-white"
          />
        ))}
      </div>

      <div className="w-full rounded-[10px] bg-white p-6 tablet:h-[178px]">
        <div className="flex items-center justify-between">
          <h2 className="text-lg tracking-[-0.25px] text-blue-950">Roadmap</h2>
          <Link
            href={"/roadmap"}
            className="text-[13px] font-semibold text-blue-600 underline hover:text-opacity-70"
          >
            View
          </Link>
        </div>

        <Status
          number={plannedFeedbacks.length}
          text="Planned"
          background="bg-orange-400"
        />
        <Status
          number={inProgressFeedbacks.length}
          text="In-progress"
          background="bg-purple-600"
        />
        <Status
          number={liveFeedbacks.length}
          text="Live"
          background="bg-blue-600"
        />
      </div>
    </aside>
  );
};
