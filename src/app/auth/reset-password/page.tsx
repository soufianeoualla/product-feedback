import type { Metadata } from "next";
import { Suspense } from "react";
import { ResetPassword } from "~/components/auth/ResetPassword";

export const metadata: Metadata = {
  title: "Reset Password",
  description: "Reset Password Page",
};
const page = () => {
  return (
    <Suspense>
      <ResetPassword />
    </Suspense>
  );
};

export default page;
