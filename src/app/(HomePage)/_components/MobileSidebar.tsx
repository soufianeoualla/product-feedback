"use client";
import { Menu, X } from "lucide-react";
import { Sidebar } from "./sidebar/Sidebar";
import type { BasicFeedback } from "~/store/feedback";
import { Button } from "~/components/ui/button";
import { useState } from "react";

type Props = {
  feedbacksData: BasicFeedback[];
};

export const MobileSidebar = ({ feedbacksData }: Props) => {
  const [isOpened, setIsOpened] = useState(false);
  return (
    <>
      <div className="z-50 flex h-[72px] w-full items-center justify-between bg-gradient-to-bl from-rose-500 from-[0%] via-purple-500 via-[53%] to-blue-500 to-[100%] px-6 text-white">
        <div className="">
          <h2 className="text-xl tracking-[-0.25px]">Frontend Mentor</h2>
          <p className="font-medium text-white text-opacity-70">
            Feedback Board
          </p>
        </div>
        <Button
          variant={"ghost"}
          size={"icon"}
          onClick={() => setIsOpened(!isOpened)}
        >
          {isOpened ? <X /> : <Menu />}
        </Button>
      </div>
      {isOpened && (
        <>
          <div className="fixed inset-0 top-[72px] z-40 h-full w-full bg-black/30" />
          <div className="absolute right-0 z-50 h-full w-[75%] bg-[#F7F8FD] px-6">
            <Sidebar feedbacksData={feedbacksData} />
          </div>
        </>
      )}
    </>
  );
};
