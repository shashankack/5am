"use client";

import type { Brand } from "@/content/types";
import { getDetailImages } from "@/content";
import { MediaImage } from "./MediaImage";
import { Reveal } from "./Reveal";

type BrandDetailProps = {
  brand: Brand;
};

function descriptionParagraphs(description: string): string[] {
  return description
    .split(/\n+/)
    .map((part) => part.trim())
    .filter(Boolean);
}

export function BrandDetail({ brand }: BrandDetailProps) {
  const paragraphs = descriptionParagraphs(brand.description);
  const mediaItems = [
    ...getDetailImages(brand).map((src) => ({ type: "image" as const, src })),
    ...brand.media.videos.map((src) => ({ type: "video" as const, src })),
  ];

  return (
    <main className="min-h-screen bg-bg pt-24 pb-32 md:pt-28 md:pb-40">
      <div className="mx-auto grid w-full max-w-7xl gap-12 px-6 md:grid-cols-2 md:gap-16 md:px-12 lg:gap-24 lg:px-16">
        <aside className="md:sticky md:top-28 md:self-start">
          <Reveal
            stagger=":scope > *"
            className="flex max-w-md flex-col gap-6 md:gap-8"
          >
            <h1 className="font-sans text-2xl font-normal tracking-tight text-heading md:text-3xl">
              {brand.title}
            </h1>

            {brand.caption ? (
              <p className="text-xs leading-relaxed text-body md:text-sm">
                {brand.caption}
              </p>
            ) : null}

            {paragraphs.length > 0 ? (
              <div className="flex flex-col gap-5">
                {paragraphs.map((paragraph) => (
                  <p
                    key={paragraph.slice(0, 24)}
                    className="text-xs leading-relaxed text-body md:text-sm"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            ) : null}
          </Reveal>
        </aside>

        <div className="flex min-w-0 flex-col gap-3 md:gap-4">
          {mediaItems.length > 0 ? (
            mediaItems.map((item, index) => (
              <Reveal
                key={`${brand.slug}-${item.type}-${index}`}
                y={36}
                delay={Math.min(index * 0.04, 0.2)}
                start="top 92%"
              >
                <div className="flex max-h-[70vh] w-full items-center justify-center bg-body/10">
                  {item.type === "image" ? (
                    <MediaImage
                      src={item.src}
                      alt={`${brand.title} — ${index + 1}`}
                      width={1600}
                      height={1200}
                      sizes="(min-width: 768px) 50vw, 100vw"
                      className="max-h-[70vh] w-auto max-w-full object-contain"
                    />
                  ) : (
                    <video
                      className="max-h-[70vh] w-auto max-w-full object-contain"
                      src={item.src}
                      controls
                      playsInline
                      preload="metadata"
                      aria-label={`${brand.title} video ${index + 1}`}
                    />
                  )}
                </div>
              </Reveal>
            ))
          ) : (
            <div className="flex aspect-[4/5] items-center justify-center bg-body/10">
              <p className="text-sm text-body">Media coming soon</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
