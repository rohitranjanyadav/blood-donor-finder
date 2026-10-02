import { useState } from "react";
import LandingHeader from "../components/landing/LandingHeader";
import LandingHero from "../components/landing/LandingHero";
import {
  FeaturesSection,
  HowItWorksSection,
  LandingStats,
  RoleCardsSection,
  TestimonialsSection,
} from "../components/landing/LandingSections";
import FaqSection from "../components/landing/FaqSection";
import LandingFooter, { LandingCta } from "../components/landing/LandingFooter";

export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "var(--font-body)" }}>
      <LandingHeader
        menuOpen={menuOpen}
        onToggleMenu={() => setMenuOpen((open) => !open)}
        onCloseMenu={() => setMenuOpen(false)}
      />
      <LandingHero />
      <LandingStats />
      <FeaturesSection />
      <HowItWorksSection />
      <RoleCardsSection />
      <TestimonialsSection />
      <FaqSection
        openFaq={openFaq}
        onToggle={(index) => setOpenFaq((current) => (current === index ? null : index))}
      />
      <LandingCta />
      <LandingFooter />
    </div>
  );
}
