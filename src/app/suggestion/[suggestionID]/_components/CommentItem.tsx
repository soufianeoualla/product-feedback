import { Button } from "~/components/ui/button";
import { Replies } from "./Replies";
import { useState } from "react";
import { AddReply } from "./AddReply";
import { useFeedbacksStore, type ExtendedComment } from "~/store/feedback";
import { generatedColor } from "~/lib/color";
import { api } from "~/trpc/react";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";
import { AddComment } from "./AddComment";

type Props = {
  comment: ExtendedComment;
};

export const CommentItem = ({ comment }: Props) => {
  const [replyOpend, setReplyOpned] = useState(false);
  const [edit, setEdit] = useState(false);
  const { data: session, status } = useSession();
  const user = session?.user;
  const { removeComment } = useFeedbacksStore();

  const { mutate: deleteComment, isPending } =
    api.feedback.deleteComment.useMutation({
      onSuccess() {
        toast.success("Your comment has been deleted");
        removeComment(comment.id);
      },
      onError(err) {
        toast.error(err?.message ?? "Failed to delete your comment");
      },
    });

  const onDelete = () => {
    deleteComment({ id: comment.id });
  };
  return (
    <div className="border-b border-slate-200 py-8">
      <div className="flex items-center justify-between">
        <div className="flex gap-x-8">
          <div
            style={{ background: generatedColor(comment.user.name) }}
            className="flex h-10 w-10 items-center justify-center rounded-full text-xl text-white"
          >
            <span className="-translate-y-[2px] capitalize">
              {comment.user.name.slice(0, 1)}
            </span>
          </div>

          <div>
            <b className="text-dark-blue">{comment.user.name}</b>
            <p>@{comment.user.username}</p>
          </div>
        </div>
        <div>
          {comment.userId === user?.id ? (
            <>
              <Button
                onClick={onDelete}
                variant={"link"}
                className="text-red-600"
                disabled={isPending || edit}
              >
                Delete
              </Button>
              <Button
                onClick={() => setEdit(!edit)}
                variant={"link"}
                className="text-primary"
                disabled={isPending}
              >
                {edit ? "Cancel" : " Edit"}
              </Button>
            </>
          ) : (
            <Button
              onClick={() => setReplyOpned(!replyOpend)}
              variant={"link"}
              className="text-blue-600"
            >
              {replyOpend ? "Cancel" : "Reply"}
            </Button>
          )}
        </div>
      </div>
      <div>
        <div className="ml-[72px]">
          {edit ? (
            <AddComment
              className="mt-0 pl-0"
              id={comment.id}
              content={comment.content}
              setEdit={setEdit}
            />
          ) : (
            <p className="mt-4">{comment.content}</p>
          )}
        </div>
        {replyOpend && (
          <AddReply
            className="ml-[72px]"
            parentId={comment.id}
            commentId={comment.id}
            setReplyOpned={setReplyOpned}
          />
        )}
        {comment.replies && <Replies replies={comment.replies} />}
      </div>
    </div>
  );
};
