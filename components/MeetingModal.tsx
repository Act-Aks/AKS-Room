import { HTMLAttributes } from "react";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Button } from "./ui/button";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  className?: HTMLAttributes<HTMLDivElement>["className"];
  children?: React.ReactNode;
  handleClick?: () => void;
  buttonTitle?: string;
  img?: string;
  buttonIcon?: string;
};

const MeetingModal = ({
  isOpen,
  onClose,
  title,
  className,
  children,
  handleClick,
  buttonTitle,
  buttonIcon,
  img,
}: Props) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className={
          "flex w-full max-w-[520px] flex-col gap-6 border-none bg-dark-1 px-6 py-9 text-white"
        }
      >
        <div className={"flex flex-col gap-6"}>
          {img && (
            <div className={"flex justify-center"}>
              <Image src={img} alt={"img"} width={72} height={72} />
            </div>
          )}
          <h1 className={cn("text-3xl font-bold leading-[42px]", className)}>
            {title}
          </h1>
          {children}

          <Button
            className={
              "bg-blue-1 focus-visible:ring-0 focus-visible:ring-offset-0"
            }
            onClick={handleClick}
          >
            {buttonIcon && (
              <Image src={buttonIcon} alt={"icon"} width={13} height={13} />
            )}
            &nbsp;
            {buttonTitle ?? "Schedule Meeting"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MeetingModal;
