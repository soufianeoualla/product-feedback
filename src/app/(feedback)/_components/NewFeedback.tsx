"use client";

import type { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Plus } from "lucide-react";
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
import { newFeedbackSchema } from "schemas";
import { categories } from "~/lib/utils";
import { api } from "~/trpc/react";
import toast from "react-hot-toast";
import { Textarea } from "~/components/ui/textarea";
import { useRouter } from "next/navigation";

export const NewFeedback = () => {
  const router = useRouter();
  const form = useForm<z.infer<typeof newFeedbackSchema>>({
    resolver: zodResolver(newFeedbackSchema),
    defaultValues: {
      category: undefined,
      feedbackDetail: "",
      feedbackTitle: "",
    },
  });
  let toastId: string;
  const {
    mutate: newFeedBack,
    error,
    isPending,
  } = api.feedback.newFeedback.useMutation({
    onMutate() {
      toastId = toast.loading("Loading...");
    },

    onSuccess() {
      toast.dismiss(toastId);
      toast.success("Feedback created");
      router.push("/");
    },
    onError() {
      toast.dismiss(toastId);
      error && toast.error(error?.message);
    },
  });

  const onSubmit = (values: z.infer<typeof newFeedbackSchema>) => {
    newFeedBack(values);
    form.reset();
  };

  return (
    <div className="relative rounded-[10px] bg-white p-10 mobile:p-6">
      <div className="absolute -top-7 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-bl from-rose-500 from-[0%] via-purple-500 via-[53%] to-blue-500 to-[100%]">
        <Plus strokeWidth={3} className="text-white" />
      </div>
      <h1 className="mb-10 mt-4 text-2xl text-dark-blue">
        {" Create New Feedback"}
      </h1>

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
                  <Input disabled={isPending} {...field} />
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
                    disabled={isPending}
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
                  <Textarea disabled={isPending} maxLength={250} {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <div className="mobile:flex-col flex items-center justify-end gap-4">
            <Button
              className="mobile:w-full"
              disabled={isPending}
              size={"lg"}
              type="submit"
            >
              Cancel
            </Button>
            <Button
              className="mobile:w-full"
              variant={"primary"}
              size={"lg"}
              type="submit"
            >
              Add Feedback
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
