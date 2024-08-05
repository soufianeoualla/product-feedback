import type { Metadata } from "next";
import { Suspense } from "react";
import { VerficationWrapper } from "~/components/auth/VerficationWrapper";

export const metadata: Metadata = {
  title: "Verification",
  description: "Verification Page",
};

const page = () => {
  return (
    <div className="max-w-[1116px] mx-auto flex justify-center items-center h-screen">
      <Suspense>
        <VerficationWrapper />
      </Suspense>
    </div>
  );
};

export default page;
