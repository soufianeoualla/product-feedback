"use client";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { RegisterForm } from "./RegisterForm";
import { LoginForm } from "./LoginForm";
import { Button } from "../ui/button";
import { useEffect } from "react";

type Props = {
  buttonLabel: string;
  buttonHref: string;
  social?: boolean;
};

export const CardWrapper = ({ buttonHref, buttonLabel, social }: Props) => {
  const { status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status === "authenticated") return router.push("/");
  }, [status,router]);
  
  const Component = pathname.includes("login") ? LoginForm : RegisterForm;
  const onClick = async () => {
    await signIn("google", {
      callbackUrl: "/",
    });
  };
  return (
    <div className="w-[370px] rounded-[10px] bg-white p-8 shadow-sm">
      {social && (
        <>
          <Button
            onClick={onClick}
            variant={"outline"}
            className="flex h-11 w-full items-center justify-center gap-x-2 border border-slate-200 text-neutral-500"
          >
            <Image
              src={"/assets/Google.svg"}
              alt="google"
              width={18}
              height={18}
            />
            Continue with Google
          </Button>
          <div className="my-8 flex items-center gap-x-4 text-xs font-medium text-neutral-500">
            <div className="h-[2px] w-full rounded-xl bg-slate-200" />
            OR
            <div className="h-[2px] w-full rounded-xl bg-slate-200" />
          </div>
        </>
      )}
      <Component />
      <div className="mt-6 flex items-center justify-center">
        <Link
          href={buttonHref}
          className="text-neutral-500 hover:text-blue-500 hover:underline"
        >
          {buttonLabel}
        </Link>
      </div>
    </div>
  );
};
