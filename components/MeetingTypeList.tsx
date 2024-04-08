"use client";

import { MEETINGS_TYPE } from "@/constants";
import { generatePath } from "@/lib/utils";
import { useUser } from "@clerk/nextjs";
import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk";
import { useRouter } from "next/navigation";
import { useState } from "react";
import HomeCard from "./HomeCard";
import MeetingModal from "./MeetingModal";
import { useToast } from "./ui/use-toast";

type MeetingType = (typeof MEETINGS_TYPE)[keyof typeof MEETINGS_TYPE];

const MeetingTypeList = () => {
  const router = useRouter();
  const [meetingType, setMeetingType] = useState<MeetingType>();
  const [values, setValues] = useState({
    dateTime: new Date(),
    description: "",
    link: "",
  });
  const [callDetails, setCallDetails] = useState<Call>();

  const { toast } = useToast();
  const { user } = useUser();
  const client = useStreamVideoClient();

  const createMeeting = async () => {
    if (!user || !client) {
      return;
    }

    try {
      if (!values.dateTime) {
        toast({ title: "Please select a date and time" });
        return;
      }

      const id = crypto.randomUUID();
      const call = client.call("default", id);

      if (!call) {
        throw new Error("Failed to create call");
      }

      const startsAt =
        values.dateTime.toISOString() ?? new Date(Date.now()).toISOString();

      const description = values.description ?? "Instant meeting";

      await call.getOrCreate({
        data: {
          starts_at: startsAt,
          custom: {
            description,
          },
        },
      });

      setCallDetails(call);

      if (!values.description) {
        router.push(generatePath("Meeting", { id: call.id }));
      }

      toast({ title: "Meeting created" });
    } catch (error) {
      console.log(error);
      toast({ title: "Failed to create meeting" });
    }
  };

  return (
    <section className={"grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4"}>
      <HomeCard
        icon={"/icons/add-meeting.svg"}
        title={"New Meeting"}
        description={"Start a new meeting"}
        onClickCard={() => setMeetingType("isInstantMeeting")}
        className={"bg-orange-1"}
      />
      <HomeCard
        icon={"/icons/schedule.svg"}
        title={"Schedule Meeting"}
        description={"Plan your meeting"}
        onClickCard={() => setMeetingType("isScheduleMeeting")}
        className={"bg-blue-1"}
      />
      <HomeCard
        icon={"/icons/recordings.svg"}
        title={"View Recordings"}
        description={"Check out your recordings"}
        onClickCard={() => setMeetingType("isJoiningMeeting")}
        className={"bg-purple-1"}
      />
      <HomeCard
        icon={"/icons/join-meeting.svg"}
        title={"Join Meeting"}
        description={"via invite link"}
        onClickCard={() => setMeetingType("isJoiningMeeting")}
        className={"bg-yellow-1"}
      />

      <MeetingModal
        isOpen={meetingType === "isInstantMeeting"}
        onClose={() => setMeetingType(undefined)}
        title={"Start an Instant Meeting"}
        className={"text-center"}
        buttonTitle={"Start Meeting"}
        handleClick={createMeeting}
      />
    </section>
  );
};

export default MeetingTypeList;
