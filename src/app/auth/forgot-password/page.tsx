import { Metadata } from "next";
import React from "react";
import { ForgotPassword } from "~/components/auth/ForgotPassword";

export const metadata: Metadata = {
  title: "Forgot Password",
  description: "Forgot Password Page",
};

const page = () => {
  return <ForgotPassword />;
};

export default page;
