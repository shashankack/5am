"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRef, useState } from "react";
import type { Brand } from "@/content/types";
import {
  getAdjacentBrands,
  getBrandCategory,
  getDetailImages,
} from "@/content";
import { gsap, useGSAP } from "@/lib/gsap";
import { requestHomeScrollRestore } from "@/lib/scroll-memory";
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
  const category = getBrandCategory(brand.slug);
  const adjacent = getAdjacentBrands(brand.slug);
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
            <Link
              href="/"
              scroll={false}
              onClick={requestHomeScrollRestore}
              className="group inline-flex w-fit items-center gap-2 text-xs text-body transition-colors duration-300 ease-out hover:text-heading focus-visible:text-heading focus-visible:outline-none md:text-sm"
            >
              <ArrowSwap direction="prev" small />
              <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-[position:100%_100%] bg-no-repeat pb-px transition-[background-size] duration-300 ease-out group-hover:bg-[length:100%_1px] group-hover:bg-[position:0_100%] group-focus-visible:bg-[length:100%_1px] motion-reduce:transition-none">
                All work
              </span>
            </Link>

            <div className="flex flex-col gap-3">
              {category ? (
                <p className="text-[11px] tracking-[0.2em] text-body uppercase md:text-xs">
                  {category.title}
                </p>
              ) : null}
              <h1 className="font-sans text-2xl font-normal tracking-tight text-heading md:text-3xl">
                {brand.title}
              </h1>
            </div>

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
            <div className="flex aspect-[4/5] flex-col items-center justify-center gap-2 bg-body/[0.06] px-6 text-center">
              <p className="font-heading text-lg text-heading md:text-xl">
                Imagery in the edit
              </p>
              <p className="max-w-xs text-xs leading-relaxed text-body md:text-sm">
                Selected frames from this project will be added soon.
              </p>
            </div>
          )}
        </div>
      </div>

      {adjacent ? (
        <nav
          aria-label="More work"
          className="mx-auto mt-24 grid w-full max-w-7xl grid-cols-2 px-6 md:mt-32 md:px-12 lg:px-16"
        >
          <AdjacentLink brand={adjacent.prev} direction="prev" />
          <AdjacentLink brand={adjacent.next} direction="next" />
        </nav>
      ) : null}
    </main>
  );
}

function ArrowSwap({
  direction,
  small = false,
}: {
  direction: "prev" | "next";
  small?: boolean;
}) {
  const Icon = direction === "next" ? ArrowRight : ArrowLeft;
  const exit =
    direction === "next"
      ? "group-hover:translate-x-6 group-focus-visible:translate-x-6"
      : "group-hover:-translate-x-6 group-focus-visible:-translate-x-6";
  const enter = direction === "next" ? "-translate-x-6" : "translate-x-6";
  const motion =
    "transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none";

  return (
    <span
      className={[
        "relative flex size-6 shrink-0 items-center justify-center overflow-hidden rounded-full border border-body/20",
        "transition-[border-color,background-color] duration-300 ease-out",
        "group-hover:border-heading group-hover:bg-heading group-focus-visible:border-heading group-focus-visible:bg-heading",
        small ? "" : "md:size-8",
      ].join(" ")}
    >
      <Icon
        aria-hidden
        strokeWidth={1.5}
        className={`size-3.5 ${small ? "" : "md:size-4"} ${motion} ${exit}`}
      />
      <Icon
        aria-hidden
        strokeWidth={1.5}
        className={`absolute size-3.5 text-bg ${small ? "" : "md:size-4"} ${motion} ${enter} group-hover:translate-x-0 group-focus-visible:translate-x-0`}
      />
    </span>
  );
}

function AdjacentLink({
  brand,
  direction,
}: {
  brand: Brand;
  direction: "prev" | "next";
}) {
  const isNext = direction === "next";

  return (
    <Link
      href={`/work/${brand.slug}`}
      aria-label={`${isNext ? "Next" : "Previous"} project: ${brand.title}`}
      className={[
        "group flex min-w-0 flex-col gap-4 py-8 focus-visible:outline-none md:gap-5 md:py-10",
        isNext
          ? "items-end pl-4 text-right md:pl-10"
          : "items-start pr-4 text-left md:pr-10",
      ].join(" ")}
    >
      <span
        className={[
          "flex items-center gap-3 text-[10px] tracking-[0.2em] text-body uppercase md:text-[11px]",
          isNext ? "flex-row-reverse" : "",
        ].join(" ")}
      >
        <ArrowSwap direction={direction} small />
        {isNext ? "Next" : "Previous"}
      </span>

      <span className="flex max-w-full min-w-0 flex-col gap-2">
        <span className="font-heading text-base leading-tight text-heading md:text-xl">
          <span
            className={[
              "bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-no-repeat pb-1",
              "transition-[background-size] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
              "group-hover:bg-[length:100%_1px] group-focus-visible:bg-[length:100%_1px] motion-reduce:transition-none",
              isNext ? "bg-[position:100%_100%]" : "bg-[position:0_100%]",
            ].join(" ")}
          >
            {brand.title}
          </span>
        </span>
        {brand.caption ? (
          <span className="hidden text-xs text-body md:block">
            {brand.caption}
          </span>
        ) : null}
      </span>
    </Link>
  );
}
