import type { Metadata } from "next";
import React from "react";
import { CardWrapper } from "~/components/auth/CardWrapper";

export const metadata: Metadata = {
  title: "Login",
  description: "Login Page",
};

const page = () => {
  return (
    <CardWrapper
      buttonHref="/auth/register"
      buttonLabel="Don't have an account? Sign up"
      social
    />
  );
};

export default page;
