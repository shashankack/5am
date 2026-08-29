import {
  HeroVideo,
  InquiryForm,
  IntroExperience,
  LandingSection,
} from "@/components";
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
        {rest.map((section, index) => (
          <LandingSection
            key={section.id}
            section={section}
            showCategories={index === rest.length - 1}
          />
        ))}
        <InquiryForm />
      </IntroExperience>
    </main>
  );
}
