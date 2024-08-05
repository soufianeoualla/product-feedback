"use client";
import { Check, ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import { useFeedbacksStore } from "~/store/feedback";

const sortOptions = [
  "Most Upvotes",
  "Least Upvotes",
  "Most Comments",
  "Least Comments",
];
export const Sort = () => {
  const [selected, setSelected] = useState<string>("Most Upvotes");
  const { feedbacks, setFeedbacks } = useFeedbacksStore();

  useEffect(() => {
    const sortedFeedbacks = [...feedbacks];

    switch (selected) {
      case "Most Comments":
        sortedFeedbacks.sort((a, b) => b.comments.length - a.comments.length);
        break;
      case "Least Comments":
        sortedFeedbacks.sort((a, b) => a.comments.length - b.comments.length);
        break;
      case "Least Upvotes":
        sortedFeedbacks.sort((a, b) => a.upvotes - b.upvotes);
        break;
      case "Most Upvotes":
        sortedFeedbacks.sort((a, b) => b.upvotes - a.upvotes);
        break;
      default:
        sortedFeedbacks.sort((a, b) => b.comments.length - a.comments.length);
        break;
    }

    setFeedbacks(sortedFeedbacks);
  }, [selected, setFeedbacks]);
  return (
    <div className="group relative z-20">
      <Button variant={"ghost"} className="p-0">
        Sort by :&nbsp;
        <span className="font-bold text-white group-hover:text-slate-100">
          {selected}
        </span>
        <ChevronDown
          width={18}
          className="ml-2 text-white group-hover:rotate-180 group-hover:text-slate-100"
        />
      </Button>
      <div className="absolute z-20 hidden w-[255px] hover:block group-hover:block">
        <div className="z-10 w-full p-5" />
        <div className="w-full rounded-[10px] bg-white shadow-md">
          <ul>
            {sortOptions.map((option, index) => (
              <li
                onClick={() => setSelected(option)}
                key={index}
                className="flex cursor-pointer items-center justify-between border-b border-slate-200 px-6 py-4 text-stone-600 last-of-type:border-0 hover:text-primary"
              >
                {option}
                {option === selected && (
                  <Check className="text-primary" width={18} />
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
