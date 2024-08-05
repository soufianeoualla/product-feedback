import { Metadata } from "next";
import React from "react";
import { CardWrapper } from "~/components/auth/CardWrapper";

export const metadata: Metadata = {
  title: "Register",
  description: "Register Page",
};

const page = () => {
  return (
    <CardWrapper
      buttonHref="/auth/login"
      buttonLabel="Already have an account? Log in"
      social
    />
  );
};

export default page;
