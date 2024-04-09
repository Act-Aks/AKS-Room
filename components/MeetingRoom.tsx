"use client";

import { cn } from "@/lib/utils";
import {
  CallControls,
  CallParticipantsList,
  CallStatsButton,
  CallingState,
  PaginatedGridLayout,
  SpeakerLayout,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";
import { useState } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import routes from "@/constants/routes";
import { LayoutList, Users } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import Each from "./Each";
import EndCallButton from "./EndCallButton";
import Loader from "./Loader";

type CallLayoutType = "grid" | "speaker-left" | "speaker-right";

const MeetingRoom = () => {
  const searchParams = useSearchParams();
  const isPersonalRoom = !!searchParams.get("personal");

  const [layout, setLayout] = useState<CallLayoutType>("speaker-left");
  const [showParticipants, setShowParticipants] = useState(false);

  const { useCallCallingState } = useCallStateHooks();
  const callingState = useCallCallingState();
  const router = useRouter();

  if (callingState !== CallingState.JOINED) {
    return <Loader />;
  }

  const CallLayout = () => {
    switch (layout) {
      case "grid":
        return <PaginatedGridLayout />;
      case "speaker-left":
        return <SpeakerLayout participantsBarPosition={"right"} />;

      default:
        return <SpeakerLayout participantsBarPosition={"left"} />;
    }
  };

  return (
    <section
      className={"relative h-screen w-full overflow-hidden pt-4 text-white"}
    >
      <div className={"relative flex size-full items-center justify-center"}>
        <div className={"flex size-full max-w-[1000px] items-center"}>
          <CallLayout />
        </div>
        <div
          className={cn("h-[calc(100vh - 86px)] hidden ml-2", {
            "show-block": showParticipants,
          })}
        >
          <CallParticipantsList onClose={() => setShowParticipants(false)} />
        </div>
      </div>

      <div
        className={
          "fixed bottom-0 flex w-full items-center justify-center gap-5 flex-wrap"
        }
      >
        <CallControls onLeave={() => router.push(routes.Home)} />

        <DropdownMenu>
          <div className={"flex items-center"}>
            <DropdownMenuTrigger
              className={
                "cursor-pointer rounded-2xl bg-[#19232D] px-2 py-2 hover:bg-[#4C535B]"
              }
            >
              <LayoutList size={20} className={"text-white"} />
            </DropdownMenuTrigger>
          </div>
          <DropdownMenuContent className={"border-dark-1 bg-dark-1 text-white"}>
            <Each
              of={["Grid", "Speaker-Left", "Speaker-Right"]}
              render={(item) => (
                <DropdownMenuItem
                  className={"cursor-pointer"}
                  onClick={() =>
                    setLayout(item.toLowerCase() as CallLayoutType)
                  }
                >
                  {item}
                </DropdownMenuItem>
              )}
            />
            <DropdownMenuSeparator className={"border-dark-1"} />
          </DropdownMenuContent>
        </DropdownMenu>

        <CallStatsButton />

        <button onClick={() => setShowParticipants((t) => !t)}>
          <div
            className={
              "cursor-pointer rounded-2xl bg-[#19232D] px-2 py-2 hover:bg-[#4C535B]"
            }
          >
            <Users size={20} className={"text-white"} />
          </div>
        </button>
        {!isPersonalRoom && <EndCallButton />}
      </div>
    </section>
  );
};

export default MeetingRoom;
