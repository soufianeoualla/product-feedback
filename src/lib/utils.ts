import type { Category } from "@prisma/client";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const categories: Category[] = [
  "UI",
  "UX",
  "Enhancement",
  "Bug",
  "Feature",
];

export const statuses = ["Suggestion", "Planned", "In-Progress", "Live"];
