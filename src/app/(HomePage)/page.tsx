"use client";
import { Header } from "~/components/Header";
import { Sidebar } from "~/app/(HomePage)/_components/sidebar/Sidebar";
import { HeaderHome } from "./_components/HeaderHome";
import { Suggestions } from "./_components/Suggestions";
import { Loader2 } from "lucide-react";
import { api } from "~/trpc/react";
import { MobileSidebar } from "./_components/MobileSidebar";

export default function Home() {
  const { data, isLoading, isFetching } = api.feedback.getFeedbacks.useQuery();
  if (isLoading || isFetching)
    return (
      <div className="mt-80 flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" />
      </div>
    );

  return (
    <>
      {data && (
        <div className="relative mx-auto flex max-w-screen-xl gap-x-10 py-6 tablet:w-full tablet:flex-col tablet:p-6 mobile:p-0">
          <div className="relative desktop:max-w-[255px] mobile:hidden h-full">
            <Sidebar feedbacksData={data} />
           
          </div>
          <div className="hidden mobile:block">
            <MobileSidebar feedbacksData={data} />
          </div>

          <div className="w-full">
            <Header>
              <HeaderHome />
            </Header>
            <Suggestions feedbacksData={data} />
          </div>
        </div>
      )}
    </>
  );
}
