import { ContactSection } from "@/components/landing/ContactSection";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { LandingHero } from "@/components/landing/LandingHero";
import { Partners } from "@/components/landing/Partners";
import { Roadmap } from "@/components/landing/Roadmap";

export function LandingPage() {
  return (
    <div className="min-h-screen bg-landing font-landing text-[16px] font-normal leading-normal text-white">
      <LandingHeader />
      <main>
        <LandingHero />
        <HowItWorks />
        <Partners />
        <Roadmap />
        <ContactSection />
      </main>
      <LandingFooter />
    </div>
  );
}
