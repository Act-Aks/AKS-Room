"use client";

import { MEETINGS_TYPE } from "@/constants";
import routes from "@/constants/routes";
import { generatePath } from "@/lib/utils";
import { useUser } from "@clerk/nextjs";
import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk";
import { useRouter } from "next/navigation";
import { useState } from "react";
import ReactDatePicker from "react-datepicker";
import HomeCard from "./HomeCard";
import MeetingModal from "./MeetingModal";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
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

  const meetingLink = `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${callDetails?.id}`;

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
        onClickCard={() => router.push(routes.Recordings)}
        className={"bg-purple-1"}
      />
      <HomeCard
        icon={"/icons/join-meeting.svg"}
        title={"Join Meeting"}
        description={"via invite link"}
        onClickCard={() => setMeetingType("isJoiningMeeting")}
        className={"bg-yellow-1"}
      />

      {!callDetails ? (
        <MeetingModal
          isOpen={meetingType === "isScheduleMeeting"}
          onClose={() => setMeetingType(undefined)}
          title={"Create Meeting"}
          handleClick={createMeeting}
        >
          <div className={"flex flex-col gap-2.5"}>
            <label
              className={"text-base text-normal leading-[22px] text-sky-2"}
            >
              Add Description
            </label>
            <Textarea
              className={
                "border-none bg-dark-3 focus-visible:ring-0 focus-visible:ring-offset-0"
              }
              onChange={(e) =>
                setValues({ ...values, description: e.target.value })
              }
            />
          </div>
          <div className={"flex w-full flex-col gap-2.5"}>
            <label
              className={"text-base text-normal leading-[22px] text-sky-2"}
            >
              Select Date and Time
            </label>
            <ReactDatePicker
              selected={values.dateTime}
              showTimeSelect={true}
              timeFormat={"HH:mm"}
              timeIntervals={15}
              timeCaption={"Time"}
              dateFormat={"MMMM d, yyyy h:mm aa"}
              className={"w-full rounded bg-dark-3 p-2 focus:outline-none"}
              onChange={(date) => setValues({ ...values, dateTime: date! })}
            />
          </div>
        </MeetingModal>
      ) : (
        <MeetingModal
          isOpen={meetingType === "isScheduleMeeting"}
          onClose={() => setMeetingType(undefined)}
          title={"Meeting Created"}
          className={"text-center"}
          buttonTitle={"Copy Meeting Link"}
          handleClick={() => {
            navigator.clipboard.writeText(meetingLink);
            toast({ title: "Meeting link copied" });
          }}
          img={"/icons/checked.svg"}
          buttonIcon={"/icons/copy.svg"}
        />
      )}

      <MeetingModal
        isOpen={meetingType === "isInstantMeeting"}
        onClose={() => setMeetingType(undefined)}
        title={"Start an Instant Meeting"}
        className={"text-center"}
        buttonTitle={"Start Meeting"}
        handleClick={createMeeting}
      />

      <MeetingModal
        isOpen={meetingType === "isJoiningMeeting"}
        onClose={() => setMeetingType(undefined)}
        title={"Enter the meeting link to Join"}
        className={"text-center"}
        buttonTitle={"Join Meeting"}
        handleClick={() => router.push(values.link)}
      >
        <Input
          placeholder={"Meeting link"}
          className={
            "border-none bg-dark-3 focus-visible:ring-0 focus-visible:ring-offset-0"
          }
          onChange={(e) => setValues({ ...values, link: e.target.value })}
        />
      </MeetingModal>
    </section>
  );
};

export default MeetingTypeList;
