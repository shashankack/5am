import { getBrandsBySlugs, getCategories } from "@/content";
import type { LandingSection as LandingSectionType } from "@/content/types";
import { BrandShowcase } from "./BrandShowcase";
import { CategoryList } from "./CategoryList";
import { Reveal } from "./Reveal";

type LandingSectionProps = {
  section: LandingSectionType;
  showCategories?: boolean;
};

export function LandingSection({
  section,
  showCategories = false,
}: LandingSectionProps) {
  const brands = getBrandsBySlugs(section.clients);

  return (
    <section className="w-full px-6 py-16 md:px-16 md:py-40">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-20 md:gap-28">
        {(section.title || section.description || section.locations) && (
          <Reveal
            stagger=":scope > *"
            className="mx-auto flex max-w-3xl flex-col items-center gap-6 text-center"
          >
            {section.title ? (
              <h1 className="font-heading text-2xl leading-tight text-heading md:text-4xl">
                {section.title}
              </h1>
            ) : null}
            {section.description ? (
              <p className="text-sm leading-relaxed font-light text-body md:text-base">
                {section.description}
              </p>
            ) : null}
            {section.locations ? (
              <p className="text-[11px] tracking-[0.2em] text-body uppercase md:text-xs">
                {section.locations}
              </p>
            ) : null}
          </Reveal>
        )}

        {brands.length > 0 ? (
          <div className="flex flex-col gap-16 md:gap-20">
            {brands.map((brand) => (
              <BrandShowcase key={brand.slug} brand={brand} />
            ))}
          </div>
        ) : null}

        {showCategories ? (
          <CategoryList categories={getCategories()} />
        ) : null}
      </div>
    </section>
  );
}
