"use client";
import { api } from "~/trpc/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Loader } from "lucide-react";
import { FormSucces } from "./FormSucces";
import { FormError } from "./FormError";

export const VerficationWrapper = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const router = useRouter();
  const [success, setSuccess] = useState<string | undefined>("");

  const { mutate: verifyEmail, error } = api.auth.verifyEmail.useMutation({
    onSuccess() {
      setSuccess("Your email has been verified");
    },
  });

  const handleVerfication = useCallback(() => {
    verifyEmail({ token });
    setTimeout(() => {
      setTimeout(() => {
        setSuccess("Redirecting...");
      }, 3000);
      router.push("/auth/login");
    }, 5000);
  }, [token, router, verifyEmail]);

  useEffect(() => {
    handleVerfication();
  }, [handleVerfication]);
  return (
    <div className="flex w-[350px] flex-col items-center justify-center gap-y-4 rounded-[10px] bg-white p-4 shadow-sm">
      <h1 className="text-xl font-bold text-dark-blue">
        Confirming your email...
      </h1>
      {success && <FormSucces message={success} />}
      {error && <FormError message={error.message} />}
      {!success && !error && (
        <Loader className="animate-spin text-purple-600" />
      )}
    </div>
  );
};
