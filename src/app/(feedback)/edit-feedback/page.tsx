import { Suspense } from "react";
import { EditFeedback } from "../_components/EditFeedback";

const Page = () => {
  return (
    <>
      <Suspense>
        <EditFeedback />
      </Suspense>
    </>
  );
};

export default Page;
