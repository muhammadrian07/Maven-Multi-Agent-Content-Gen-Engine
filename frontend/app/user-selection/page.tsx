import type { Metadata } from "next";
import { UserSelectionPage } from "@/components/selection/UserSelectionPage";

export const metadata: Metadata = {
  title: "Choose a pipeline",
  description: "Select Maven Blog, Video, or Ads to continue.",
};

export default function UserSelectionRoute() {
  return <UserSelectionPage />;
}
