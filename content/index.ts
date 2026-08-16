import type { Brand, Category, Content, LandingSection } from "./types";
import en from "./en.json";

export const content = en as Content;

export function getCategories(): Category[] {
  return content.clients.categories;
}

export function getLandingSections(): LandingSection[] {
  return content.landing.sections;
}

export function getAllBrands(): Brand[] {
  return content.clients.categories.flatMap((category) => category.brands);
}

export function getBrandBySlug(slug: string): Brand | undefined {
  return getAllBrands().find((brand) => brand.slug === slug);
}

export function getBrandsBySlugs(slugs: string[]): Brand[] {
  return slugs
    .map((slug) => getBrandBySlug(slug))
    .filter((brand): brand is Brand => Boolean(brand));
}

function imageGroup(brand: Brand, index: number): string[] {
  const group = brand.media.images[index];
  if (!Array.isArray(group)) return [];
  return group.filter((src): src is string => typeof src === "string");
}

/** Landing grid — first sub-array. */
export function getShowcaseImages(brand: Brand): string[] {
  return imageGroup(brand, 0).slice(0, 4);
}

/** Case-study page — second sub-array. */
export function getDetailImages(brand: Brand): string[] {
  return imageGroup(brand, 1);
}
