import { GobackBtn } from "~/components/GobackBtn";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <div className="mx-auto max-w-[540px] space-y-16 py-24 mobile:px-3">
        <GobackBtn className="absolute left-[100px] top-[50px] mobile:left-3" />

        {children}
      </div>
      
    </>
  );
};

export default layout;
