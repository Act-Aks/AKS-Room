"use client";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { sidebarLinks } from "@/constants";
import routes from "@/constants/routes";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Each from "./Each";

const MobileNav = () => {
  const pathname = usePathname();

  return (
    <section className={"w-full max-w-[264px]"}>
      <Sheet>
        <SheetTrigger>
          <Image
            src={"/icons/hamburger.svg"}
            alt={"hamburger"}
            width={36}
            height={36}
            className={"cursor-pointer sm:hidden"}
          />
        </SheetTrigger>
        <SheetContent side={"left"} className={"border-none bg-dark-1"}>
          <Link href={routes.Home} className={"flex items-center gap-1"}>
            <Image
              src={"/icons/logo.svg"}
              alt={"AKSoom logo"}
              width={32}
              height={32}
              className={"max-sm:size-10"}
            />
            <p className={"text-[26px] font-extrabold text-white"}>AKSoom</p>
          </Link>

          <div
            className={
              "flex h-[calc(100vh-72px)] flex-col justify-between overflow-y-auto"
            }
          >
            <SheetClose asChild>
              <section
                className={"flex h-full flex-col gap-6 pt-16 text-white"}
              >
                <Each
                  of={sidebarLinks}
                  render={({ imgUrl, label, route }) => {
                    const isActive = pathname === route;

                    return (
                      <SheetClose asChild key={route}>
                        <Link
                          href={route}
                          className={cn(
                            "flex gap-4 items-center p-4 rounded-lg w-full max-w-60",
                            { "bg-blue-1": isActive }
                          )}
                        >
                          <Image
                            src={imgUrl}
                            alt={label}
                            width={20}
                            height={20}
                          />
                          <p className={"font-semibold"}>{label}</p>
                        </Link>
                      </SheetClose>
                    );
                  }}
                />
              </section>
            </SheetClose>
          </div>
        </SheetContent>
      </Sheet>
    </section>
  );
};

export default MobileNav;
