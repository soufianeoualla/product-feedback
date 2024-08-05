import { MessageCircle } from "lucide-react";

export const CommentsIcon = ({ commentsLength }: { commentsLength: number }) => {
  return (
    <div className="flex items-center gap-x-2 mobile:absolute mobile:bottom-4 mobile:right-4 ">
      <MessageCircle className="fill-slate-200 text-slate-200" />
      <b className="text-dark-blue">{commentsLength}</b>
    </div>
  );
};
