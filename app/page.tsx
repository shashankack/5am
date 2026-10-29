import { HeroVideo } from "@/components/HeroVideo";
import { InquiryForm } from "@/components/InquiryForm";
import { IntroExperience } from "@/components/IntroExperience";
import { LandingSection } from "@/components/LandingSection";
import { LogoSlider } from "@/components/LogoSlider";
import { getLandingSections } from "@/content";

export default function Home() {
  const sections = getLandingSections();

  const heroSection = sections.find((section) => section.id === "hero-video");
  const rest = sections.filter((section) => section.id !== "hero-video");

  return (
    <main className="flex flex-1 flex-col bg-bg">
      <IntroExperience
        hero={
          heroSection?.video ? (
            <HeroVideo src={heroSection.video} label={heroSection.title} />
          ) : null
        }
      >
        <LogoSlider draggable={false} />
        {rest.map((section) => (
          <LandingSection
            key={section.id}
            section={section}
            showCategories={section.id === "we-create-campaigns"}
          />
        ))}
        <InquiryForm />
      </IntroExperience>
    </main>
  );
}
