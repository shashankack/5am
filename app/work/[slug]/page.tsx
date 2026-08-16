import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BrandDetail } from "@/components/BrandDetail";
import { getAllBrands, getBrandBySlug } from "@/content";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getAllBrands().map((brand) => ({ slug: brand.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const brand = getBrandBySlug(slug);

  if (!brand) {
    return { title: "Not found — 5AM" };
  }

  return {
    title: `${brand.title} — 5AM`,
    description: brand.caption || brand.description,
  };
}

export default async function BrandPage({ params }: PageProps) {
  const { slug } = await params;
  const brand = getBrandBySlug(slug);

  if (!brand) {
    notFound();
  }

  return <BrandDetail brand={brand} />;
}
