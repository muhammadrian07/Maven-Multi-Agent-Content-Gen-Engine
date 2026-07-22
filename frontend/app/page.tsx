import type { Metadata } from "next";
import { LandingPage } from "@/components/landing/LandingPage";

export const metadata: Metadata = {
  title: "maven.ai",
  description:
    "AI-powered synthesis design for blogs, YouTube, and UGC ads.",
};

export default function HomePage() {
  return <LandingPage />;
}
