"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useGetCallById } from "@/hooks/useGetCallById";
import { generatePath } from "@/lib/utils";
import { useUser } from "@clerk/nextjs";
import { useStreamVideoClient } from "@stream-io/video-react-sdk";
import { useRouter } from "next/navigation";
import Table from "./_components/Table";

const PersonalRoom = () => {
  const { user } = useUser();
  const { toast } = useToast();
  const client = useStreamVideoClient();
  const router = useRouter();

  const meetingId = user?.id;
  const meetingLink = `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${meetingId}?personal=true`;

  const { call } = useGetCallById(meetingId!);

  const startRoom = async () => {
    if (!client || !user) {
      return;
    }

    if (!call) {
      const newCall = client.call("default", user.id);

      await newCall?.getOrCreate({
        data: {
          starts_at: new Date().toISOString(),
        },
      });
    }

    router.push(`${generatePath("Meeting", { id: meetingId })}?personal=true`);
  };

  const copyLink = () => {
    navigator.clipboard.writeText(meetingLink);
    toast({ title: "Link Copied!" });
  };

  return (
    <section className={"flex size-full flex-col gap-10 text-white"}>
      <h1 className={"text-3xl font-bold"}>Personal</h1>

      <div className={"flex w-full flex-col gap-8 xl:max-w-[900px]"}>
        <Table
          title={"Topic"}
          description={`${user?.username?.toUpperCase()}'s Meeting Room`}
        />
        <Table title={"Meeting ID"} description={meetingId!} />
        <Table title={"Invite link"} description={meetingLink} />
      </div>

      <div className={"flex gap-5"}>
        <Button className={"bg-blue-1"} onClick={startRoom}>
          Start Meeting
        </Button>
        <Button className={"bg-dark-3"} onClick={copyLink}>
          Copy Invite
        </Button>
      </div>
    </section>
  );
};

export default PersonalRoom;
