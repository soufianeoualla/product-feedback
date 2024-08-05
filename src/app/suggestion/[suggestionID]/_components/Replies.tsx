import type { ExtendedReply } from "~/store/feedback";
import { Reply } from "./Reply";

type Props = {
  replies: ExtendedReply[];
};
export const Replies = ({ replies }: Props) => {
  return (
    <div className="ml-5 border-l border-slate-200 pl-11">
      {replies.map((item) => (
        <Reply key={item.id} className="" reply={item} />
      ))}
    </div>
  );
};
