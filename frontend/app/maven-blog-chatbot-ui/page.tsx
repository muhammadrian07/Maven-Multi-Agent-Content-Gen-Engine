import type { Metadata } from "next";
import { ChatbotPage } from "@/components/chatbot/ChatbotPage";

export const metadata: Metadata = {
  title: "Maven Blog Chat",
  description: "Research niches and draft SEO-ready blogs with Maven.",
};

export default function MavenBlogChatbotRoute() {
  return <ChatbotPage pipeline="blog" />;
}
