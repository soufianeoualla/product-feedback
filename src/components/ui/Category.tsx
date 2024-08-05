import type { Category as CategoryType } from "@prisma/client";
import type { Dispatch, SetStateAction } from "react";
import { cn } from "~/lib/utils";

type Props = {
  text: CategoryType | "All";
  selectedCategory?: CategoryType | "All";
  setSelectedCategory?: Dispatch<SetStateAction<CategoryType | "All">>;
  className?: string;
};
export const Category = ({
  text,
  setSelectedCategory,
  selectedCategory,
  className,
}: Props) => {
  return (
    <span
      onClick={() => setSelectedCategory && setSelectedCategory(text)}
      className={cn(
        "cursor-pointer rounded-lg bg-slate-100 px-4 py-2 text-[13px] font-semibold capitalize text-blue-600",
        className,
        text === selectedCategory && "bg-blue-600 text-white",
      )}
    >
      {text}
    </span>
  );
};
