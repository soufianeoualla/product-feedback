"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { useRouter, useSearchParams } from "next/navigation";
import { FormSucces } from "./FormSucces";
import { FormError } from "./FormError";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import { ResetPasswordSchema } from "schemas";
import { api } from "~/trpc/react";
export const ResetPassword = () => {
  const [success, setSuccess] = useState<string | undefined>("");
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const router = useRouter();
  const form = useForm<z.infer<typeof ResetPasswordSchema>>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
      token: "",
    },
  });

  useEffect(() => {
    form.reset({
      token: token,
    });
  }, []);

  const {
    mutate: resetPassword,
    isPending,
    error,
  } = api.auth.resetPassword.useMutation({
    onSuccess() {
      setSuccess("Your password has been changed successfully");
      setTimeout(() => {
        router.push("/");
      }, 2000);
    }
  })

  const onReset = (values: z.infer<typeof ResetPasswordSchema>) => {
    resetPassword(values);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onReset)}
        className="mt-8 w-[320px] rounded-[10px] bg-white p-8 shadow-sm"
      >
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="my-4">
              <FormLabel>New Password</FormLabel>
              <FormControl>
                <Input
                  disabled={isPending}
                  type="password"
                  placeholder="*******"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem className="my-4">
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input
                  disabled={isPending}
                  type="password"
                  placeholder="*******"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {success && <FormSucces message={success} />}
        {error && <FormError message={error.message} />}
        <Button
          type="submit"
          variant={"primary"}
          size={"lg"}
          disabled={isPending}
          className="mt-2"
        >
          Reset password
        </Button>
      </form>
    </Form>
  );
};
