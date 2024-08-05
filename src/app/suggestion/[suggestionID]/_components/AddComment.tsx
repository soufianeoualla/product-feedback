"use client";
import { type Dispatch, type SetStateAction, useState } from "react";
import { Button } from "~/components/ui/button";
import { useParams, useRouter } from "next/navigation";
import { api } from "~/trpc/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { addCommentSchema } from "schemas";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "~/components/ui/form";
import { Textarea } from "~/components/ui/textarea";
import { useFeedbacksStore } from "~/store/feedback";
import toast from "react-hot-toast";
import { cn } from "~/lib/utils";
import { useSession } from "next-auth/react";

type Props = {
  id?: number;
  content?: string;
  setEdit?: Dispatch<SetStateAction<boolean>>;
  className?: string;
};

export const AddComment = ({ id, setEdit, content, className }: Props) => {
  const [text, setText] = useState("");
  const { status } = useSession();
  const router = useRouter();
  const { suggestionID } = useParams();
  const form = useForm<z.infer<typeof addCommentSchema>>({
    resolver: zodResolver(addCommentSchema),
    defaultValues: {
      content: content ? content : "",
      id: suggestionID as string,
    },
  });
  const { addComment, updateComment } = useFeedbacksStore();

  const { mutate: postComment, isPending } =
    api.feedback.addComment.useMutation({
      onSuccess(data) {
        toast.success("Your comment is posted");
        form.reset({ content: "", id: suggestionID as string });
        setText("");
        addComment(data);
      },
      onError(error) {
        toast.error(error?.message ?? "Failed to post comment");
      },
    });

  const { mutate: editComment, isPending: isLoading } =
    api.feedback.editComment.useMutation({
      onSuccess(data) {
        toast.success("Your comment is edited");
        form.reset({ content: "", id: suggestionID as string });
        setText("");
        setEdit && setEdit(false);
        updateComment(data.id, data.content);
      },
      onError(error) {
        toast.error(error?.message ?? "Failed to edit comment");
      },
    });

  const onSubmit = (values: z.infer<typeof addCommentSchema>) => {
    if (status === "unauthenticated") {
      toast.error("Your are not authenticated ");
      return router.push("/auth/login");
    }
    id ? editComment({ content: values.content, id }) : postComment(values);
  };
  return (
    <div className={cn("mt-6 rounded-[10px] bg-white px-8 py-6", className)}>
      {!id && <h2 className="mb-6 text-lg text-dark-blue">Add Comment</h2>}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    disabled={isPending}
                    {...field}
                    maxLength={250}
                    onChange={(e) => {
                      field.onChange(e);
                      setText(e.target.value);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex items-center justify-between">
            <p>{250 - text.length} Characters left</p>
            <Button
              disabled={isPending || isLoading}
              variant={"primary"}
              size={"lg"}
            >
              {id ? "Edit Commnt" : " Post Comment"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
