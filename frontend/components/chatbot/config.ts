export type PipelineId = "blog" | "video" | "ads";

export type ChatToolId = "deep_search" | "reason";

export type ChatbotConfig = {
  pipeline: PipelineId;
  path: string;
  title: string;
  emptyHeading: string;
  placeholder: string;
  iconSrc: string;
  researchLabel: string;
};

export const CHATBOT_CONFIGS: Record<PipelineId, ChatbotConfig> = {
  blog: {
    pipeline: "blog",
    path: "/maven-blog-chatbot-ui",
    title: "Maven Blog",
    emptyHeading: "What can I help with?",
    placeholder: "Ask anything",
    iconSrc: "/assets/blogger.png",
    researchLabel: "Blog niche & SEO research",
  },
  video: {
    pipeline: "video",
    path: "/maven-video-chatbot-ui",
    title: "Maven Video",
    emptyHeading: "What can I help with?",
    placeholder: "Ask anything",
    iconSrc: "/assets/video.png",
    researchLabel: "YouTube title research",
  },
  ads: {
    pipeline: "ads",
    path: "/maven-ads-chatbot-ui",
    title: "Maven Ads",
    emptyHeading: "What can I help with?",
    placeholder: "Ask anything",
    iconSrc: "/assets/ads.png",
    researchLabel: "Product & creative briefing",
  },
};
