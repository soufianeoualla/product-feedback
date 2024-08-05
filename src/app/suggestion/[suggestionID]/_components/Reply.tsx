import React, { useState } from "react";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import { generatedColor } from "~/lib/color";
import { AddReply } from "./AddReply";
import { useFeedbacksStore, type ExtendedReply } from "~/store/feedback";
import { api } from "~/trpc/react";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";

type Props = {
  reply: ExtendedReply;
  className: string;
};

export const Reply = ({ className, reply }: Props) => {
  const [replyOpned, setReplyOpned] = useState(false);
  const [edit, setEdit] = useState(false);
  const { data: session } = useSession();
  const user = session?.user;
  const { removeReply } = useFeedbacksStore();
  const { mutate: deleteComment, isPending } =
    api.feedback.deleteComment.useMutation({
      onSuccess() {
        toast.success("Your reply has been deleted");
        removeReply(reply.id, reply.parentId!);
      },
      onError(err) {
        toast.error(err?.message ?? "Failed to delete your reply");
      },
    });

  const onDelete = () => {
    deleteComment({ id: reply.id });
  };
  return (
    <>
      <div className={cn("mt-8", className)}>
        <div className="flex items-center justify-between">
          <div className="flex gap-x-8">
            <div
              style={{ background: generatedColor(reply.user.name) }}
              className="flex h-10 w-10 items-center justify-center rounded-full text-xl text-white"
            >
              <span className="-translate-y-[1px] capitalize">
                {reply.user.name.slice(0, 1)}
              </span>
            </div>
            <div>
              <b className="text-dark-blue">{reply.user.name}</b>
              <p>{reply.user.username}</p>
            </div>
          </div>
          <div>
            {reply.userId === user?.id ? (
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
                onClick={() => setReplyOpned(!replyOpned)}
                variant={"link"}
                className="text-blue-600"
              >
                {replyOpned ? "Cancel" : "Reply"}
              </Button>
            )}
          </div>
        </div>
        <div>
          {edit ? (
            <AddReply
              className="ml-[72px] pl-6"
              parentId={reply.parentId!}
              commentId={reply.id}
              setReplyOpned={setEdit}
              content={reply.content}
            />
          ) : (
            <p className="ml-[72px] mt-4">
              <span className="font-semibold text-primary">
                @{reply.reply_To}{" "}
              </span>{" "}
              {reply.content}
            </p>
          )}
        </div>
      </div>
      {replyOpned && (
        <AddReply
          className="ml-[72px] pl-6"
          parentId={reply.parentId!}
          commentId={reply.id}
          setReplyOpned={setReplyOpned}
        />
      )}
    </>
  );
};
