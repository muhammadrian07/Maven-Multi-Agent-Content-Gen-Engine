import type { Metadata } from "next";
import { ChatbotPage } from "@/components/chatbot/ChatbotPage";

export const metadata: Metadata = {
  title: "Maven Ads Chat",
  description: "UGC ads: brief, image/try-on, then short creative clips.",
};

export default function MavenAdsChatbotRoute() {
  return <ChatbotPage pipeline="ads" />;
}
