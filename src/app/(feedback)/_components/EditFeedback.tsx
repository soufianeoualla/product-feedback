"use client";

import type { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2, Plus } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { editFeedbackSchema } from "schemas";
import { categories, statuses } from "~/lib/utils";
import { api } from "~/trpc/react";
import toast from "react-hot-toast";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { Textarea } from "~/components/ui/textarea";
import { useSession } from "next-auth/react";
export const EditFeedback = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const router = useRouter();
  const { status, data: session } = useSession();
  const user = session?.user;
  const form = useForm<z.infer<typeof editFeedbackSchema>>({
    resolver: zodResolver(editFeedbackSchema),
    defaultValues: {
      category: undefined,
      feedbackDetail: "",
      feedbackTitle: "",
      status: undefined,
      id: undefined,
    },
  });

  const {
    data: feedback,
    isLoading,
    isFetched,
  } = api.feedback.getEditedFeedback.useQuery(
    {
      id: id ?? "",
    },
    { enabled: !!id },
  );
  useEffect(() => {
    form.reset({
      category: feedback?.category,
      feedbackDetail: feedback?.detail,
      feedbackTitle: feedback?.title,
      id: feedback?.id,
      status: feedback?.status,
    });
  }, [id, isFetched, feedback, form, router]);

  useEffect(() => {
    if (status === "unauthenticated") return router.push("/auth/login");
  }, [status, router]);
  let toastId: string;

  const {
    mutate: editFeedback,
    error,
    isPending,
  } = api.feedback.editFeedback.useMutation({
    onMutate() {
      toastId = toast.loading("Loading...");
    },

    onSuccess(data) {
      toast.dismiss(toastId);
      toast.success("Your feedback has been successfully edited");
      router.push("/");
    },
    onError() {
      error && toast.error(error?.message);
    },
  });

  const {
    mutate: deleteFeedback,
    error: deleteError,
    isPending: isDeleting,
  } = api.feedback.deleteFeedback.useMutation({
    onSuccess() {
      toast.success("Your feedback has been successfully deleted");
      router.push("/");
    },
    onError() {
      deleteError && toast.error(deleteError?.message);
    },
  });

  const onSubmit = (values: z.infer<typeof editFeedbackSchema>) => {
    editFeedback(values);
  };
  const onDelete = () => {
    deleteFeedback({ id: feedback!.id });
  };
  if (isLoading)
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="animate-spin text-primary" />
      </div>
    );
  return (
    <div className="relative rounded-[10px] bg-white p-10 mobile:p-6">
      <div className="absolute -top-7 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-bl from-rose-500 from-[0%] via-purple-500 via-[53%] to-blue-500 to-[100%]">
        <Plus strokeWidth={3} className="text-white" />
      </div>
      <h1 className="mb-10 mt-4 text-2xl text-dark-blue">{"Editing"}</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="feedbackTitle"
            render={({ field }) => (
              <FormItem>
                <div>
                  <FormLabel>Feedback Title</FormLabel>
                  <FormDescription>
                    Add a short, descriptive headline
                  </FormDescription>
                </div>
                <FormControl>
                  <Input
                    disabled={
                      isPending || feedback?.userId !== user?.id || isDeleting
                    }
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <div>
                  <FormLabel>Category</FormLabel>
                  <FormDescription>
                    Choose a category for your feedback
                  </FormDescription>
                </div>
                <FormControl>
                  <Select
                    defaultValue={feedback?.category}
                    disabled={
                      isPending || feedback?.userId !== user?.id || isDeleting
                    }
                    onValueChange={(value) => field.onChange(value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue
                        placeholder="Category"
                        className="text-dark-blue"
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category, index) => (
                        <SelectItem
                          key={index}
                          value={category}
                          className="relative flex items-center justify-between"
                        >
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          {user?.role === "admin" && (
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <div>
                    <FormLabel>Update Status</FormLabel>
                    <FormDescription>Change feedback state</FormDescription>
                  </div>
                  <FormControl>
                    <Select
                      disabled={isPending || isDeleting}
                      onValueChange={(value) => field.onChange(value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        {statuses.map((item, index) => (
                          <SelectItem
                            key={index}
                            value={item}
                            className="relative flex items-center justify-between"
                          >
                            {item}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <FormField
            control={form.control}
            name="feedbackDetail"
            render={({ field }) => (
              <FormItem>
                <div>
                  <FormLabel>Feedback Detail</FormLabel>
                  <FormDescription>
                    Include any specific comments on what should be improved,
                    added, etc.
                  </FormDescription>
                </div>
                <FormControl>
                  <Textarea
                    disabled={
                      isPending || feedback?.userId !== user?.id || isDeleting
                    }
                    maxLength={250}
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex items-center justify-between mobile:flex-col">
            <Button
              onClick={onDelete}
              disabled={isPending || isDeleting}
              size={"lg"}
              type="button"
              variant={"destructive"}
              className="mobile:w-full"
            >
              Delete
            </Button>
            <div className="flex items-center gap-x-4 mobile:flex-col">
              <Button
                onClick={() => router.back()}
                disabled={isPending || isDeleting}
                size={"lg"}
                type="button"
                className="mobile:w-full"
              >
                Cancel
              </Button>
              <Button
                disabled={isPending || isDeleting}
                variant={"primary"}
                size={"lg"}
                type="submit"
                className="mobile:w-full"
              >
                Edit Feedback
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};
