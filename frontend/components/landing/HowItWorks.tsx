import { GetStartedButton } from "@/components/landing/GetStartedButton";

const COLUMNS = [
  {
    title: "M1 Builder",
    icon: (
      <svg viewBox="0 0 64 64" className="h-14 w-14" fill="none" aria-hidden>
        <rect x="8" y="18" width="28" height="22" rx="2" stroke="#38266a" strokeWidth="1.8" />
        <circle cx="44" cy="28" r="10" stroke="#38266a" strokeWidth="1.8" />
        <path d="M36 48c4-10 20-10 24 0v6H36v-6Z" stroke="#38266a" strokeWidth="1.8" />
        <path d="M14 28h16M14 34h10" stroke="#38266a" strokeWidth="1.4" />
      </svg>
    ),
    bullets: [
      "Discover low-competition niches",
      "Rank-friendly topic shortlists",
      "SEO-ready blog drafts",
    ],
  },
  {
    title: "M1 Analyst",
    icon: (
      <svg viewBox="0 0 64 64" className="h-14 w-14" fill="none" aria-hidden>
        <circle cx="32" cy="18" r="9" stroke="#38266a" strokeWidth="1.8" />
        <path d="M18 54c4-16 24-16 28 0" stroke="#38266a" strokeWidth="1.8" />
        <rect x="38" y="28" width="18" height="24" rx="2" stroke="#38266a" strokeWidth="1.8" />
        <path d="M42 36h10M42 42h8M42 48h6" stroke="#38266a" strokeWidth="1.3" />
      </svg>
    ),
    bullets: [
      "YouTube title research",
      "Script generation for scenes",
      "Text-to-audio handoff",
    ],
  },
  {
    title: "M1 Architect",
    icon: (
      <svg viewBox="0 0 64 64" className="h-14 w-14" fill="none" aria-hidden>
        <circle cx="16" cy="32" r="7" stroke="#38266a" strokeWidth="1.8" />
        <circle cx="48" cy="18" r="7" stroke="#38266a" strokeWidth="1.8" />
        <circle cx="48" cy="46" r="7" stroke="#38266a" strokeWidth="1.8" />
        <path d="M23 29l18-8M23 35l18 8" stroke="#38266a" strokeWidth="1.6" />
      </svg>
    ),
    bullets: [
      "UGC ad generation",
      "Model shots from multiple angles",
      "Short 5–8s creative clips",
    ],
  },
];

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="w-full bg-white text-[rgb(56,38,106)]"
    >
      <div className="mx-auto w-full max-w-6xl px-6 py-20 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-[32px] font-normal leading-normal text-[rgb(56,38,106)] sm:text-[36px]">
            How maven.ai works
          </h2>
          <p className="mt-4 text-[16px] font-normal leading-normal text-[rgb(56,38,106)]/75">
            Three specialized agents collaborate on research, writing, and media
            production so you move from idea to publish-ready assets faster.
          </p>
        </div>

        <div className="mt-14 grid gap-12 md:grid-cols-3 md:gap-8">
          {COLUMNS.map((column) => (
            <div key={column.title} className="flex flex-col items-center text-center">
              <div className="mb-5">{column.icon}</div>
              <h3 className="text-[20px] font-normal leading-normal text-[rgb(56,38,106)]">
                {column.title}
              </h3>
              <ul className="mt-4 space-y-2 text-left">
                {column.bullets.map((item) => (
                  <li
                    key={item}
                    className="flex gap-2 text-[16px] font-normal leading-normal text-[rgb(56,38,106)]/80"
                  >
                    <span
                      aria-hidden
                      className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[rgb(56,38,106)]/55"
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex justify-center">
          <GetStartedButton />
        </div>
      </div>
    </section>
  );
}
