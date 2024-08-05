import { TriangleAlert } from "lucide-react";
import React from "react";
import { cn } from "~/lib/utils";
type Props = {
  message?: string;
  classname?:string
};
export const FormError = ({ message ,classname}: Props) => {
  return (
    <div className={cn("w-full py-2 bg-rose-600/15 text-rose-600 text-[13px] rounded-md px-4 flex items-center gap-x-3 mt-3",classname)}>
      <TriangleAlert className="w-5 h-5 " />
      {message}
    </div>
  );
};
