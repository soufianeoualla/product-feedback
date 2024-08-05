"use client";
import { cn } from "~/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { addReplySchema } from "schemas";
import { api } from "~/trpc/react";
import toast from "react-hot-toast";
import type { z } from "zod";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "~/components/ui/form";
import { Textarea } from "~/components/ui/textarea";
import { useFeedbacksStore } from "~/store/feedback";
import type { Dispatch, SetStateAction } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

type Props = {
  className?: string;
  parentId: number;
  commentId: number;
  setReplyOpned: Dispatch<SetStateAction<boolean>>;
  content?: string;
};

export const AddReply = ({
  className,
  parentId,
  commentId,
  setReplyOpned,
  content,
}: Props) => {
  const router =useRouter()
  const {status} =useSession()
  const { addReply, updateReply } = useFeedbacksStore();
  const form = useForm<z.infer<typeof addReplySchema>>({
    resolver: zodResolver(addReplySchema),
    defaultValues: {
      content: content ? content : "",
      parentId: parentId,
      commentId: commentId,
    },
  });

  const {
    mutate: postReply,
    isPending,
    error,
  } = api.feedback.addReply.useMutation({
    onSuccess(data) {
      toast.success("Your reply is posted");
      form.reset({ content: "", parentId: parentId });
      addReply(data);
      setReplyOpned(false);
    },
    onError() {
      toast.error(error?.message ?? "Failed to post reply");
    },
  });

  const { mutate: editReply, isPending: isLoading } =
    api.feedback.editComment.useMutation({
      onSuccess(data) {
        toast.success("Your reply is edited");
        form.reset({ content: "", parentId: parentId });
        setReplyOpned(false);
        updateReply(data.id, data.content, data.parentId!);
      },
      onError(error) {
        toast.error(error?.message ?? "Failed to edit reply");
      },
    });

  const onSubmit = (values: z.infer<typeof addReplySchema>) => {
    if (status === "unauthenticated") {
      toast.error("Your are not authenticated ");
      return router.push("/auth/login");
    }
    content
      ? editReply({ content: values.content, id: commentId })
      : postReply(values);
  };
  return (
    <div className="w-full">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className={cn("mt-6 flex gap-4", className)}>
                    <Textarea disabled={isPending} maxLength={250} {...field} />
                    <Button
                      disabled={isPending || isLoading}
                      variant={"primary"}
                      size={"lg"}
                    >
                      {content ? "Edit Reply" : "Post Reply"}
                    </Button>
                  </div>
                </FormControl>
                <FormMessage className={className} />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  );
};
