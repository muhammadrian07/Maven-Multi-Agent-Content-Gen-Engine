export const PIPELINE_CARDS = [
  {
    id: "blog",
    title: "Maven Blog",
    iconSrc: "/blogger.png",
    href: "#",
    bullets: [
      "Discover low-competition niches",
      "Rank-friendly topic shortlists",
      "SEO-ready blog drafts",
    ],
  },
  {
    id: "video",
    title: "Maven Video",
    iconSrc: "/video.png",
    href: "#",
    bullets: [
      "YouTube title research",
      "Script generation for scenes",
      "Text-to-audio & scene videos",
    ],
  },
  {
    id: "ads",
    title: "Maven Ads",
    iconSrc: "/ads.png",
    href: "#",
    bullets: [
      "UGC ad generation",
      "Model shots from multiple angles",
      "Short 5–8s creative clips",
    ],
  },
] as const;

/** Post-login destination for pipeline picker. */
export const USER_SELECTION_PATH = "/user-selection";
