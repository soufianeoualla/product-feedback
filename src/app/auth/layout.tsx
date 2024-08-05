import { SessionProvider } from "next-auth/react";
import { GobackBtn } from "~/components/GobackBtn";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="mx-auto flex h-screen max-w-screen-md flex-col items-center justify-center gap-y-10 mobile:px-4">
      <GobackBtn className="absolute left-[100px] top-[50px] mobile:left-4" />
      <SessionProvider>{children}</SessionProvider>
    </div>
  );
};

export default layout;
