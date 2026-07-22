import { GetStartedButton } from "@/components/landing/GetStartedButton";
import { HeroIllustration } from "@/components/landing/HeroIllustration";

export function LandingHero() {
  return (
    <section className="relative mx-auto grid w-full max-w-6xl items-center gap-10 px-6 pb-20 pt-8 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:pb-28 lg:pt-12">
      <div
        aria-hidden
        className="pointer-events-none absolute -left-10 top-0 h-64 w-64 rounded-full bg-white/10 blur-2xl"
      />

      <div className="relative z-10 max-w-xl">
        <h1 className="text-[40px] font-normal leading-[1.15] text-white sm:text-[48px]">
          AI-powered synthesis design
        </h1>
        <p className="mt-5 max-w-md text-[16px] font-normal leading-normal text-white/75">
          Plan content pipelines, discover low-competition topics, and generate
          SEO blogs, YouTube scripts, and UGC ads with multi-agent AI —
          tailored to your workflow.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <GetStartedButton />
          <a
            href="#how-it-works"
            className="inline-flex items-center justify-center rounded-full border border-white/40 bg-transparent px-7 py-2.5 text-[16px] font-normal leading-normal text-white transition hover:bg-white/10"
          >
            Learn more
          </a>
        </div>
      </div>

      <div className="relative z-10 flex justify-center lg:justify-end">
        <HeroIllustration />
      </div>
    </section>
  );
}
