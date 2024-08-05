type Props = {
  text: string;
  background: string;
  number?: number;
};
export const Status = ({ text, background, number }:Props) => {
  return (
    <div className="mt-6 tablet:mt-2 flex items-center justify-between text-gray-700">
      <div className="flex items-center gap-x-4">
        <div className={`h-2 w-2 rounded-full ${background} `} />
        <span>{text}</span>
      </div>
      <b>{number} </b>
    </div>
  );
};
