import { MessageCircle } from "lucide-react";

export const CommentsIcon = ({ commentsLength }: { commentsLength: number }) => {
  return (
    <div className="flex items-center gap-x-2 ">
      <MessageCircle className="fill-slate-200 text-slate-200" />
      <b className="text-dark-blue">{commentsLength}</b>
    </div>
  );
};
