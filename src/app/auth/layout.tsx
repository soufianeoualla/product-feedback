import { SessionProvider } from "next-auth/react";
import { GobackBtn } from "~/components/GobackBtn";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="mx-auto flex h-screen max-w-screen-md flex-col items-center justify-center gap-y-10">
      <GobackBtn className="absolute left-[100px] top-[50px]" />
      <SessionProvider>{children}</SessionProvider>
    </div>
  );
};

export default layout;
