"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { GobackBtn } from "~/components/GobackBtn";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const { status } = useSession();
  useEffect(() => {
    if (status === "unauthenticated") return router.push("/auth/login");
  }, [status, router]);
  return (
    <>
      <div className="mx-auto max-w-[540px] space-y-16 py-24 mobile:px-3">
        <GobackBtn className="absolute left-[100px] top-[50px] mobile:left-3" />

        {children}
      </div>
    </>
  );
};

export default Layout;
