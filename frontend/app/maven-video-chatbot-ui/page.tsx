import type { Metadata } from "next";
import { ChatbotPage } from "@/components/chatbot/ChatbotPage";

export const metadata: Metadata = {
  title: "Maven Video Chat",
  description: "YouTube title research, scripts, and scene videos with Maven.",
};

export default function MavenVideoChatbotRoute() {
  return <ChatbotPage pipeline="video" />;
}
