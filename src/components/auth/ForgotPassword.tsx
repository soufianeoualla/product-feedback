"use client";
import { useState } from "react";
import { api } from "~/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { FormSucces } from "./FormSucces";
import { FormError } from "./FormError";
import { sendRestLinkSchema } from "schemas";

export const ForgotPassword = () => {
  const [success, setSuccess] = useState<string | undefined>("");
  const { handleSubmit, register, reset } = useForm<
    z.infer<typeof sendRestLinkSchema>
  >({
    resolver: zodResolver(sendRestLinkSchema),
    defaultValues: {
      email: "",
    },
  });

  const {
    mutate: sendRestLink,
    isPending,
    error,
  } = api.auth.sendResetLink.useMutation({
    onSuccess() {
      setSuccess("Reset link was sent successfully");
      reset();
    },
  });

  const onSend = (values: z.infer<typeof sendRestLinkSchema>) => {
    setSuccess(undefined);
    sendRestLink(values);
  };
  return (
    <form
      onSubmit={handleSubmit(onSend)}
      className="w-[370px] rounded-[10px] bg-white p-8 shadow-sm"
    >
      <p className="text-xs font-medium leading-5 text-neutral-500">
        Please enter the email address associated with your account. We&apos;ll
        promptly send you a link to reset your password.
      </p>

      <div className="my-4 space-y-2">
        <label className="text-xs font-medium text-neutral-600" htmlFor="email">
          Email
        </label>

        <Input
          {...register("email")}
          disabled={isPending}
          type="email"
          id="email"
          placeholder="Email"
        />
      </div>
      {success && <FormSucces message={success} />}
      {error && <FormError message={error.message} />}
      <Button
        variant={"primary"}
        size={"lg"}
        disabled={isPending}
        className="mt-2 w-full"
      >
        Send reset link
      </Button>
    </form>
  );
};
