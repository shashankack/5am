"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { Category } from "@/content/types";
import { gsap } from "@/lib/gsap";
import { Reveal } from "./Reveal";

type CategoryListProps = {
  categories: Category[];
  title?: string | null;
};

export function CategoryList({
  categories,
  title = "Explore Our Work by Category",
}: CategoryListProps) {
  const listRef = useRef<HTMLUListElement>(null);
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const prevOpenRef = useRef<string | null>(null);
  const reducedMotionRef = useRef(false);

  useEffect(() => {
    reducedMotionRef.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const list = listRef.current;
    if (!list) return;

    categories.forEach((category) => {
      const panel = list.querySelector<HTMLElement>(
        `[data-category="${category.slug}"] [data-panel]`,
      );
      const icon = list.querySelector<HTMLElement>(
        `[data-category="${category.slug}"] [data-icon]`,
      );
      if (panel) gsap.set(panel, { height: 0 });
      if (icon) gsap.set(icon, { rotation: 0, transformOrigin: "50% 50%" });
    });
  }, [categories]);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;

    const reduced = reducedMotionRef.current;
    const prev = prevOpenRef.current;
    const next = openSlug;
    prevOpenRef.current = next;

    const getParts = (slug: string) => {
      const item = list.querySelector<HTMLElement>(
        `[data-category="${slug}"]`,
      );
      if (!item) return null;
      return {
        panel: item.querySelector<HTMLElement>("[data-panel]"),
        brands: item.querySelectorAll<HTMLElement>("[data-brand]"),
        icon: item.querySelector<HTMLElement>("[data-icon]"),
      };
    };

    const closePanel = (slug: string) => {
      const parts = getParts(slug);
      if (!parts?.panel) return;

      gsap.killTweensOf([parts.panel, parts.brands, parts.icon]);

      if (reduced) {
        gsap.set(parts.panel, { height: 0 });
        gsap.set(parts.brands, { clearProps: "opacity,transform" });
        gsap.set(parts.icon, { rotation: 0 });
        return;
      }

      const tl = gsap.timeline();
      tl.to(
        parts.brands,
        {
          opacity: 0,
          y: -6,
          duration: 0.16,
          stagger: { each: 0.012, from: "end" },
          ease: "power2.in",
        },
        0,
      );
      tl.to(
        parts.panel,
        {
          height: 0,
          duration: 0.36,
          ease: "power3.inOut",
        },
        0.02,
      );
      tl.to(
        parts.icon,
        {
          rotation: 0,
          duration: 0.28,
          ease: "power2.out",
        },
        0,
      );
    };

    const openPanel = (slug: string) => {
      const parts = getParts(slug);
      if (!parts?.panel) return;

      gsap.killTweensOf([parts.panel, parts.brands, parts.icon]);

      if (reduced) {
        gsap.set(parts.panel, { height: "auto" });
        gsap.set(parts.brands, { clearProps: "opacity,transform" });
        gsap.set(parts.icon, { rotation: 45 });
        return;
      }

      gsap.set(parts.brands, { opacity: 0, y: 10 });
      gsap.set(parts.panel, { height: "auto" });
      const targetHeight = parts.panel.scrollHeight;
      gsap.set(parts.panel, { height: 0 });

      const tl = gsap.timeline();
      tl.to(
        parts.panel,
        {
          height: targetHeight,
          duration: 0.45,
          ease: "power3.out",
          onComplete: () => {
            // Keep in sync with content if fonts/images shift layout
            gsap.set(parts.panel, { height: "auto" });
          },
        },
        0,
      );
      tl.to(
        parts.brands,
        {
          opacity: 1,
          y: 0,
          duration: 0.34,
          stagger: 0.03,
          ease: "power2.out",
        },
        0.1,
      );
      tl.to(
        parts.icon,
        {
          rotation: 45,
          duration: 0.32,
          ease: "power2.out",
        },
        0,
      );
    };

    if (prev && prev !== next) {
      closePanel(prev);
    }

    if (next && next !== prev) {
      openPanel(next);
    }
  }, [openSlug]);

  const onToggle = (slug: string) => {
    setOpenSlug((current) => (current === slug ? null : slug));
  };

  return (
    <div id="work" className="w-full">
      {title ? (
        <Reveal className="mb-10 md:mb-14">
          <h2 className="font-heading text-3xl leading-tight text-heading md:text-5xl">
            {title}
          </h2>
        </Reveal>
      ) : null}

      <Reveal stagger=":scope > li">
        <ul ref={listRef} className="border-t border-body/20">
          {categories.map((category) => {
            const isOpen = openSlug === category.slug;
            const panelId = `category-panel-${category.slug}`;
            const buttonId = `category-trigger-${category.slug}`;

            return (
              <li
                key={category.slug}
                data-category={category.slug}
                className="border-b border-body/20"
              >
                <button
                  type="button"
                  id={buttonId}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => onToggle(category.slug)}
                  className="relative z-10 flex w-full cursor-pointer items-center justify-between py-5 text-left md:py-6"
                >
                  <span className="text-sm text-body transition-colors duration-200 md:text-base">
                    {category.title}
                  </span>
                  <span
                    data-icon
                    className="inline-block text-lg leading-none text-body will-change-transform"
                    aria-hidden
                  >
                    +
                  </span>
                </button>

                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  data-panel
                  className="overflow-hidden"
                  inert={!isOpen ? true : undefined}
                >
                  <ul className="flex flex-col gap-3 pb-6 md:gap-4 md:pb-8">
                    {category.brands.length > 0 ? (
                      category.brands.map((brand) => (
                        <li key={brand.slug} data-brand>
                          <Link
                            href={`/work/${brand.slug}`}
                            className="group flex items-baseline justify-between gap-6 py-1"
                            tabIndex={isOpen ? undefined : -1}
                          >
                            <span className="font-sans text-xs text-heading transition-colors duration-150 group-hover:text-body md:text-sm">
                              {brand.title}
                            </span>
                            {brand.caption ? (
                              <span className="max-w-[50%] text-right text-[11px] text-body md:text-xs">
                                {brand.caption}
                              </span>
                            ) : null}
                          </Link>
                        </li>
                      ))
                    ) : (
                      <li data-brand className="text-xs text-body">
                        No work listed yet
                      </li>
                    )}
                  </ul>
                </div>
              </li>
            );
          })}
        </ul>
      </Reveal>
    </div>
  );
}
