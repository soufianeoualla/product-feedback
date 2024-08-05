import Image from "next/image";
import React from "react";
import { Sort } from "./Sort";
import { useFeedbacksStore } from "~/store/feedback";

export const HeaderHome = () => {
  const { feedbacks } = useFeedbacksStore();

  return (
    <div className="flex items-center gap-x-9 ">
      <div className="mobile:hidden flex items-center gap-x-3">
        <Image
          src={"/assets/icon-suggestions.svg"}
          alt="icon_suggestions"
          width={24}
          height={24}
        />
        <h2 className="text-lg">{feedbacks.length} Suggestions</h2>
      </div>
      <Sort />
    </div>
  );
};
