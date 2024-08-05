import React from "react";
import { StatusItem } from "./StatusItem";
import type { BasicFeedback } from "~/store/feedback";

type Props = {
  label: "Planned" | "In-Progress" | "Live";
  description: string;
  feedbacks: BasicFeedback[];
};

export const Column = ({ label, description, feedbacks }: Props) => {
  return (
    <div className="mobile:p-4">
      <h2 className="text-lg text-dark-blue ">
        {label} ({feedbacks.length})
      </h2>
      <p>{description}</p>
      <div className="mt-8">
        {feedbacks.map((item) => (
          <StatusItem key={item.id} text={label} feedback={item} />
        ))}
      </div>
    </div>
  );
};
