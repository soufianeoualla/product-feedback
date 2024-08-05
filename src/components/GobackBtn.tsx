"use client";
import { ChevronLeft } from "lucide-react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

export const GobackBtn = ({
  className,
  iconColor,
}: {
  className?: string;
  iconColor?: string;
}) => {
  const router = useRouter();
  return (
    <Button
      onClick={() => {
        router.back();
      }}
      className={className}
      variant={"link"}
    >
      <ChevronLeft width={16} className={"mr-2 text-blue-600"} color={iconColor} />
      Go Back
    </Button>
  );
};
