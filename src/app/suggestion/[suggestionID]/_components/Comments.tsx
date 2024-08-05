import type { ExtendedComment } from "~/store/feedback";
import { CommentItem } from "./CommentItem";

type Props = {
  comments: ExtendedComment[];
};

export const Comments = ({ comments }: Props) => {
  return (
    <div className="mt-6 rounded-[10px] bg-white p-8">
      <h2 className="mb-7 text-lg text-dark-blue">
        {comments.length} Comments
      </h2>
      {comments.map((item) => {
        if (!item.parentId) return <CommentItem key={item.id} comment={item} />;
      })}
    </div>
  );
};
