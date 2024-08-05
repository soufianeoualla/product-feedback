import Link from "next/link";
import { Button } from "./ui/button";
import { useSession } from "next-auth/react";

export const Header = ({ children }: { children: React.ReactNode }) => {
  const { status } = useSession();
  return (
    <header className="flex items-center justify-between rounded-[10px] bg-blue-gray py-6 pl-6 pr-4 text-white mobile:px-4 mobile:py-2 mobile:rounded-none">
      {children}
      <Button asChild variant={"primary"} size={"lg"}>
        <Link href={status === "authenticated" ? "/new-feedback" : "/auth/login"}>
          + Add Feedback
        </Link>
      </Button>
    </header>
  );
};
