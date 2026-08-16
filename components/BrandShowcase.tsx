"use client";

import Link from "next/link";
import gsap from "gsap";
import { useRef, type MouseEvent } from "react";
import type { Brand } from "@/content/types";
import { getShowcaseImages } from "@/content";
import { MediaImage } from "./MediaImage";
import { Reveal } from "./Reveal";

type BrandShowcaseProps = {
  brand: Brand;
};

/** Max shift in px — opposite to cursor */
const MAX_SHIFT = 8;

export function BrandShowcase({ brand }: BrandShowcaseProps) {
  const images: string[] = getShowcaseImages(brand);
  const href = `/work/${brand.slug}`;
  const cardRef = useRef<HTMLAnchorElement>(null);
  const xTo = useRef<gsap.QuickToFunc | null>(null);
  const yTo = useRef<gsap.QuickToFunc | null>(null);

  const ensureTweens = () => {
    const card = cardRef.current;
    if (!card || xTo.current) return;

    xTo.current = gsap.quickTo(card, "x", {
      duration: 0.55,
      ease: "power2.out",
    });
    yTo.current = gsap.quickTo(card, "y", {
      duration: 0.55,
      ease: "power2.out",
    });
  };

  const onMove = (event: MouseEvent<HTMLAnchorElement>) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    ensureTweens();
    const card = cardRef.current;
    if (!card || !xTo.current || !yTo.current) return;

    const rect = card.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;

    xTo.current((0.5 - x) * (MAX_SHIFT * 2));
    yTo.current((0.5 - y) * (MAX_SHIFT * 2));
  };

  const onLeave = () => {
    ensureTweens();
    xTo.current?.(0);
    yTo.current?.(0);
  };

  return (
    <Reveal>
      <article className="w-full">
        <header className="mb-4 flex items-baseline justify-between gap-6 md:mb-6">
          <h2 className="font-sans text-xs font-normal text-heading md:text-sm">
            {brand.title}
          </h2>
          {brand.caption ? (
            <h2 className="font-sans text-xs font-normal text-heading md:text-sm">
              {brand.caption}
            </h2>
          ) : null}
        </header>

        <Link
          ref={cardRef}
          href={href}
          aria-label={`View ${brand.title} project`}
          onMouseMove={onMove}
          onMouseLeave={onLeave}
          className="grid cursor-pointer grid-cols-2 gap-2 outline-none will-change-transform md:gap-3 [&:hover>div]:shadow-[0_14px_32px_-14px_rgba(0,0,0,0.2)]"
        >
          {images.length > 0
            ? images.map((src, index) => (
                <div
                  key={`${brand.slug}-${index}`}
                  className="relative flex aspect-[1/1] items-center justify-center overflow-hidden bg-body/10 shadow-[0_8px_24px_-12px_rgba(0,0,0,0.2)] transition-shadow duration-300 ease-out"
                >
                  <MediaImage
                    src={src}
                    alt={`${brand.title} — ${index + 1}`}
                    fill
                    sizes="(min-width: 768px) 40vw, 50vw"
                    className="object-cover"
                  />
                </div>
              ))
            : Array.from({ length: 4 }, (_, index) => (
                <div
                  key={`${brand.slug}-placeholder-${index}`}
                  className="relative flex aspect-[4/3] items-center justify-center overflow-hidden bg-body/10 shadow-[0_8px_24px_-12px_rgba(0,0,0,0.2)]"
                >
                  {index === 0 ? (
                    <p className="px-4 text-center text-xs tracking-wide text-body">
                      Media coming soon
                    </p>
                  ) : null}
                </div>
              ))}
        </Link>
      </article>
    </Reveal>
  );
}
