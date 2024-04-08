import { cn } from "@/lib/utils";
import Image from "next/image";

type Props = {
  icon: string;
  title: string;
  description: string;
  onClickCard: () => void;
  className?: React.HTMLAttributes<HTMLDivElement>["className"];
};

const HomeCard = ({
  icon,
  title,
  description,
  onClickCard,
  className,
}: Props) => {
  return (
    <div
      className={cn(
        "bg-orange-1 px-4 py-6 flex flex-col justify-between w-full xl:max-w-[270px] min-h-[260px] rounded-[14px] cursor-pointer hover:opacity-80",
        className
      )}
      onClick={onClickCard}
    >
      <div className={"flex-center glassmorphism size-12 rounded-[10px]"}>
        <Image src={icon} alt={"meeting"} width={28} height={28} />
      </div>

      <div className={"flex flex-col gap-2"}>
        <h1 className={"text-2xl font-bold"}>{title}</h1>
        <p className={"text-lg font-normal"}>{description}</p>
      </div>
    </div>
  );
};

export default HomeCard;
