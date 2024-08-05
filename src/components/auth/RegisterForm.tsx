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
import { registerSchema } from "schemas";
import { FormSucces } from "./FormSucces";
import { FormError } from "./FormError";
import { useState } from "react";
import { Button } from "../ui/button";
import { api } from "~/trpc/react";
export const RegisterForm = () => {
  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
      username: "",
    },
  });
  const [success, setSuccess] = useState<string | undefined>("");

  const {
    error,
    isPending,
    mutate: registerUser,
  } = api.auth.createUser.useMutation({
    onSuccess() {
      setSuccess("An email of confirmation is sent");
    },
  });

  const handleRegister = (values: z.infer<typeof registerSchema>) => {
    registerUser(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleRegister)} className="mt-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  disabled={isPending}
                  placeholder="Full Name"
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem className="mt-4">
              <FormControl>
                <Input disabled={isPending} placeholder="Username" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="mt-4">
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
                  placeholder="Password"
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <p className="text-xs font-medium text-neutral-500">
          By creating an account you agree with our Terms of Service, Privacy
          Policy,
        </p>
        {success && <FormSucces message={success} />}
        {error && <FormError message={error.message} />}

        <Button
          disabled={isPending}
          variant={"primary"}
          className="mt-3 w-full"
        >
          Create account
        </Button>
      </form>
    </Form>
  );
};
