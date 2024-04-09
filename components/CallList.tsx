"use client";

import { useGetCalls } from "@/hooks/useGetCalls";
import { generatePath } from "@/lib/utils";
import { Call, CallRecording } from "@stream-io/video-react-sdk";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Loader from "./Loader";
import MeetingCard from "./MeetingCard";
import { useToast } from "./ui/use-toast";

type CallListProps = {
  type: "upcoming" | "ended" | "recordings";
};

const CallList = ({ type }: CallListProps) => {
  const { endedCalls, upcomingCalls, callRecordings, loading } = useGetCalls();
  const router = useRouter();
  const [recordings, setRecordings] = useState<CallRecording[]>([]);
  const [recordingsLoading, setRecordingsLoading] = useState(false);
  const { toast } = useToast();

  const getCalls = () => {
    switch (type) {
      case "upcoming":
        return upcomingCalls;
      case "ended":
        return endedCalls;
      case "recordings":
        return recordings;

      default:
        return [];
    }
  };

  const getNoCallsMessage = () => {
    switch (type) {
      case "upcoming":
        return "No Upcoming Calls";
      case "ended":
        return "No Previous Calls";
      case "recordings":
        return "No Recordings";

      default:
        return "";
    }
  };

  useEffect(() => {
    if (type !== "recordings") {
      return;
    }

    const fetchRecordings = async () => {
      try {
        setRecordingsLoading(true);
        const callData = await Promise.all(
          callRecordings.map((meeting) => meeting.queryRecordings())
        );

        const recordings = callData
          .filter((call) => call.recordings.length > 0)
          .flatMap((call) => call.recordings);

        setRecordings(recordings);
      } catch (error) {
        toast({
          title: "Failed to fetch recordings",
          description: "Please try again later",
          variant: "destructive",
        });
      } finally {
        setRecordingsLoading(false);
      }
    };

    fetchRecordings();
  }, [type, callRecordings]);

  const calls = getCalls();
  const noCallsMessage = getNoCallsMessage();

  if (loading || recordingsLoading) {
    return <Loader />;
  }

  return (
    <div className={"grid grid-cols-1 gap-5 xl:grid-cols-2"}>
      {calls && calls.length > 0 ? (
        calls.map((meeting) => (
          <MeetingCard
            key={(meeting as Call).id ?? (meeting as CallRecording).filename}
            icon={
              type === "ended"
                ? "/icons/previous.svg"
                : type === "upcoming"
                ? "/icons/upcoming.svg"
                : "/icons/recordings.svg"
            }
            title={
              (meeting as Call).state?.custom?.description?.substring(0, 20) ??
              (meeting as CallRecording)?.filename?.substring(0, 20) ??
              "No Description"
            }
            date={
              (meeting as Call).state?.startsAt?.toLocaleString() ??
              (meeting as CallRecording)?.start_time?.toLocaleString()
            }
            isPreviousMeeting={type === "ended"}
            buttonIcon1={type === "recordings" ? "/icons/play.svg" : undefined}
            handleClick={
              type === "recordings"
                ? () => router.push(`${(meeting as CallRecording).url}`)
                : () =>
                    router.push(
                      generatePath("Meeting", { id: (meeting as Call).id })
                    )
            }
            link={
              type === "recordings"
                ? (meeting as CallRecording).url
                : `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${
                    (meeting as Call).id
                  }`
            }
            buttonText={type === "recordings" ? "Play" : "Start"}
          />
        ))
      ) : (
        <h1>{noCallsMessage}</h1>
      )}
    </div>
  );
};

export default CallList;
