import { MessageCircle } from "lucide-react";
import { cn } from "~/lib/utils";
type Props = {
  commentsLength: number;
  className?: string;
};

export const CommentsIcon = ({ commentsLength, className }: Props) => {
  return (
    <div
      className={cn(
        "flex items-center gap-x-2 mobile:absolute mobile:bottom-4 mobile:right-4",
        className,
      )}
    >
      <MessageCircle className="fill-slate-200 text-slate-200" />
      <b className="text-dark-blue">{commentsLength}</b>
    </div>
  );
};
