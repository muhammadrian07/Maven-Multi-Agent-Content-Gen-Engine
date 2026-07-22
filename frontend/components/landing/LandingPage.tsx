import { ContactSection } from "@/components/landing/ContactSection";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { LandingHero } from "@/components/landing/LandingHero";
import { Team } from "@/components/landing/Team";
import { Roadmap } from "@/components/landing/Roadmap";
import { PageTextureBackground } from "@/components/ui/PageTextureBackground";

/**
 * Texture lives on the page root (absolute, full height).
 * Purple hero is opaque; other sections stay translucent so the waves show through.
 */
export function LandingPage() {
  return (
    <div className="relative isolate min-h-screen overflow-x-hidden font-landing text-[16px] font-normal leading-normal">
      <PageTextureBackground intensity="landing" />

      <div className="relative z-10">
        <div className="bg-landing text-white">
          <LandingHeader />
          <LandingHero />
        </div>

        <HowItWorks />
        <Team />
        <Roadmap />
        <ContactSection />
        <LandingFooter />
      </div>
    </div>
  );
}
