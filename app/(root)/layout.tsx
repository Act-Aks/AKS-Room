import { StreamProvider } from "@/providers/StreamProvider";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AKS Room",
  description: "Video Calling App",
  icons: {
    icon: "/icons/logo.svg",
  },
};

const RootMainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main>
      <StreamProvider>{children}</StreamProvider>
    </main>
  );
};

export default RootMainLayout;
