"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import Link from "next/link";
import { Button } from "../ui/button";
import { FormError } from "./FormError";
import { loginSchema } from "schemas";
import { loginHandler } from "action/login";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

export const LoginForm = () => {
  const [error, setError] = useState<string | undefined>();
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const handleLogin = (values: z.infer<typeof loginSchema>) => {
    startTransition(async () => {
      await loginHandler(values).then((data) => {
        if (data?.error) {
          setError(data?.error);
        } else {
          router.push("/");
        }
      });
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleLogin)} className="mt-8">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  disabled={isPending}
                  type="email"
                  placeholder="Email"
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="my-4">
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
        <Link
          href={"/auth/forgot-password"}
          className="flex flex-row-reverse justify-between text-xs font-medium text-neutral-500 hover:text-blue-500 hover:underline"
        >
          Forgot Password?
        </Link>
        {error && <FormError message={error} />}
        <Button
          disabled={isPending}
          variant={"primary"}
          className="mt-3 w-full"
        >
          Login
        </Button>
      </form>
    </Form>
  );
};
