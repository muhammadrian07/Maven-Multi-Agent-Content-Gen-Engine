export const PIPELINE_CARDS = [
  {
    id: "blog",
    title: "Maven Blog",
    iconSrc: "/assets/blogger.png",
    href: "/maven-blog-chatbot-ui",
    bullets: [
      "Discover low-competition niches",
      "Rank-friendly topic shortlists",
      "SEO-ready blog drafts",
    ],
  },
  {
    id: "video",
    title: "Maven Video",
    iconSrc: "/assets/video.png",
    href: "/maven-video-chatbot-ui",
    bullets: [
      "YouTube title research",
      "Script generation for scenes",
      "Text-to-audio & scene videos",
    ],
  },
  {
    id: "ads",
    title: "Maven Ads",
    iconSrc: "/assets/ads.png",
    href: "/maven-ads-chatbot-ui",
    bullets: [
      "UGC ad generation",
      "Model shots from multiple angles",
      "Short 5–8s creative clips",
    ],
  },
] as const;

/** Post-login destination for pipeline picker. */
export const USER_SELECTION_PATH = "/user-selection";
