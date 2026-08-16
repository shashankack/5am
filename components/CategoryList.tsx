"use client";

import Link from "next/link";
import { useState } from "react";
import type { Category } from "@/content/types";
import { Reveal } from "./Reveal";

type CategoryListProps = {
  categories: Category[];
  title?: string | null;
};

export function CategoryList({
  categories,
  title = "Explore Our Work by Category",
}: CategoryListProps) {
  const [openSlug, setOpenSlug] = useState<string | null>(null);

  return (
    <div id="work" className="w-full">
      {title ? (
        <Reveal className="mb-10 md:mb-14">
          <h2 className="font-heading text-3xl leading-tight text-heading md:text-5xl">
            {title}
          </h2>
        </Reveal>
      ) : null}

      <Reveal stagger="li">
        <ul className="border-t border-body/20">
          {categories.map((category) => {
            const isOpen = openSlug === category.slug;
            const panelId = `category-panel-${category.slug}`;
            const buttonId = `category-trigger-${category.slug}`;

            return (
              <li key={category.slug} className="border-b border-body/20">
                <button
                  type="button"
                  id={buttonId}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() =>
                    setOpenSlug((current) =>
                      current === category.slug ? null : category.slug,
                    )
                  }
                  className="flex w-full cursor-pointer items-center justify-between py-5 text-left md:py-6"
                >
                  <span className="text-sm text-body md:text-base">
                    {category.title}
                  </span>
                  <span
                    className={[
                      "text-lg leading-none text-body transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
                      isOpen ? "rotate-45" : "rotate-0",
                    ].join(" ")}
                    aria-hidden
                  >
                    +
                  </span>
                </button>

                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  className={[
                    "grid transition-[grid-template-rows] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
                    isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                  ].join(" ")}
                >
                  <div className="overflow-hidden">
                    <ul className="flex flex-col gap-3 pb-6 md:gap-4 md:pb-8">
                      {category.brands.length > 0 ? (
                        category.brands.map((brand) => (
                          <li key={brand.slug}>
                            <Link
                              href={`/work/${brand.slug}`}
                              className="group flex items-baseline justify-between gap-6 py-1"
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
                        <li className="text-xs text-body">No work listed yet</li>
                      )}
                    </ul>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </Reveal>
    </div>
  );
}
