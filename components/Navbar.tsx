"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { FloatingCTA } from "./FloatingCTA";
import { NAVBAR_ID } from "@/lib/intro";

/** Pixels scrolled before the navbar becomes solid */
export const NAVBAR_SOLID_SCROLL_THRESHOLD = 700;

export function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const update = () => {
      setScrolled(window.scrollY >= NAVBAR_SOLID_SCROLL_THRESHOLD);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  const solid = !isHome || scrolled;
  const logoColor = solid ? "text-heading" : "text-bg";

  return (
    <>
      <header
        id={NAVBAR_ID}
        className={[
          "pointer-events-none fixed inset-x-0 top-0 z-[110] pt-[env(safe-area-inset-top)] will-change-transform",
          "transition-[background-color] duration-300 ease-out",
          solid ? "bg-bg" : "bg-transparent",
        ].join(" ")}
      >
        <nav className="pointer-events-auto mx-auto flex h-12 w-full max-w-6xl items-center px-5 md:h-15 md:px-16">
          {/* Mobile */}
          <div className="flex w-full items-center px-15 md:hidden">
            <Link
              href="/"
              className={`shrink-0 font-sans text-lg tracking-tight transition-colors duration-300 ease-out ${logoColor}`}
            >
              <span className="font-bold">5</span>AM
            </Link>

            <div className="min-h-px min-w-[7.5rem] flex-1" aria-hidden />

            <Link
              href="/"
              className={`shrink-0 font-sans text-lg tracking-tight transition-colors duration-300 ease-out ${logoColor}`}
            >
              LABS
            </Link>
          </div>

          {/* Desktop */}
          <div className="hidden w-full items-center justify-center md:flex">
            <Link
              href="/"
              className={`font-sans text-base font-normal tracking-tight transition-colors duration-300 ease-out ${logoColor}`}
            >
              <span className="font-bold">5</span>amLabs.
            </Link>
          </div>
        </nav>
      </header>

      <FloatingCTA visible={solid} />
    </>
  );
}
