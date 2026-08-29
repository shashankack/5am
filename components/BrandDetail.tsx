"use client";

import { useRef, useState } from "react";
import type { Brand } from "@/content/types";
import { getDetailImages } from "@/content";
import { gsap, useGSAP } from "@/lib/gsap";
import { MediaImage } from "./MediaImage";
import { Reveal } from "./Reveal";

type BrandDetailProps = {
  brand: Brand;
};

type MediaItem =
  | { type: "image"; src: string }
  | { type: "video"; src: string };

function descriptionParagraphs(description: string): string[] {
  return description
    .split(/\n+/)
    .map((part) => part.trim())
    .filter(Boolean);
}

function MediaFrame({
  item,
  brandTitle,
  index,
}: {
  item: MediaItem;
  brandTitle: string;
  index: number;
}) {
  const frameRef = useRef<HTMLDivElement>(null);
  const mediaWrapRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useGSAP(
    () => {
      const frame = frameRef.current;
      const media = mediaWrapRef.current;
      if (!frame || !media) return;

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.set(media, { autoAlpha: 1, y: 0, scale: 1 });
        return;
      }

      if (!ready) {
        gsap.set(media, { autoAlpha: 0, y: 18, scale: 1.015 });
        return;
      }

      gsap.fromTo(
        media,
        { autoAlpha: 0, y: 18, scale: 1.015 },
        {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          duration: 0.7,
          ease: "power3.out",
          force3D: true,
          overwrite: "auto",
          scrollTrigger: {
            trigger: frame,
            start: "top 92%",
            once: true,
          },
        },
      );
    },
    { scope: frameRef, dependencies: [ready] },
  );

  return (
    <div
      ref={frameRef}
      className={[
        "relative flex w-full items-start justify-center overflow-hidden",
        "transition-[background-color,min-height] duration-500",
        ready
          ? "min-h-0 bg-transparent"
          : "min-h-[42vw] bg-body/10 md:min-h-[28vw]",
      ].join(" ")}
    >
      {!ready ? (
        <div
          className="pointer-events-none absolute inset-0 animate-pulse bg-gradient-to-b from-body/[0.04] via-body/10 to-body/[0.04]"
          aria-hidden
        />
      ) : null}

      <div ref={mediaWrapRef} className="flex w-full justify-center will-change-transform">
        {item.type === "image" ? (
          <MediaImage
            src={item.src}
            alt={`${brandTitle}   ${index + 1}`}
            width={1600}
            height={1200}
            sizes="(min-width: 768px) 50vw, 100vw"
            fadeIn={false}
            priority={index === 0}
            className="max-h-[70vh] w-auto max-w-full object-contain object-top"
            onLoad={() => setReady(true)}
            onError={() => setReady(true)}
          />
        ) : (
          <video
            className="max-h-[70vh] w-auto max-w-full object-contain object-top"
            src={item.src}
            controls
            playsInline
            preload="metadata"
            aria-label={`${brandTitle} video ${index + 1}`}
            onLoadedData={() => setReady(true)}
            onError={() => setReady(true)}
          />
        )}
      </div>
    </div>
  );
}

export function BrandDetail({ brand }: BrandDetailProps) {
  const paragraphs = descriptionParagraphs(brand.description);
  const mediaItems: MediaItem[] = [
    ...getDetailImages(brand).map((src) => ({ type: "image" as const, src })),
    ...brand.media.videos
      .filter((src) => typeof src === "string" && src.trim().length > 0)
      .map((src) => ({ type: "video" as const, src })),
  ];

  return (
    <main className="min-h-screen bg-bg pt-24 pb-32 md:pt-28 md:pb-40">
      <div className="mx-auto grid w-full max-w-7xl gap-12 px-6 md:grid-cols-2 md:gap-16 md:px-12 lg:gap-24 lg:px-16">
        <aside className="md:sticky md:top-28 md:self-start">
          <Reveal
            stagger=":scope > *"
            y={18}
            duration={0.55}
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
              <MediaFrame
                key={`${brand.slug}-${item.type}-${index}`}
                item={item}
                brandTitle={brand.title}
                index={index}
              />
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
