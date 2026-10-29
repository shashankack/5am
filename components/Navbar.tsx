"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { FloatingCTA } from "./FloatingCTA";
import { NavMenu } from "./NavMenu";
import { NAVBAR_ID } from "@/lib/intro";
import { consumeHomeScrollRestore, saveHomeScroll } from "@/lib/scroll-memory";

/** Pixels scrolled before the navbar becomes solid */
export const NAVBAR_SOLID_SCROLL_THRESHOLD = 700;

export function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const update = () => {
      setScrolled(window.scrollY >= NAVBAR_SOLID_SCROLL_THRESHOLD);
      if (window.location.pathname === "/") saveHomeScroll(window.scrollY);
    };

    if (isHome) {
      const y = consumeHomeScrollRestore();
      if (y !== null) {
        requestAnimationFrame(() =>
          window.scrollTo({ top: y, behavior: "instant" }),
        );
      }
    }

    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, [isHome]);

  const solid = !isHome || scrolled || menuOpen;
  const logoColor = solid ? "text-heading" : "text-bg";

  return (
    <>
      <header
        id={NAVBAR_ID}
        className={[
          "pointer-events-none fixed inset-x-0 top-0 z-[160] pt-[env(safe-area-inset-top)] will-change-transform",
          "transition-[background-color] duration-300 ease-out",
          solid ? "bg-bg" : "bg-transparent",
        ].join(" ")}
      >
        <nav className="pointer-events-auto relative mx-auto flex h-12 w-full max-w-6xl items-center px-5 md:h-15 md:px-16">
          <div className="flex w-full items-center justify-around px-10 md:hidden">
            <Link
              href="/"
              className={`font-sans text-lg font-normal tracking-tight transition-colors duration-300 ease-out ${logoColor}`}
            >
              <span className="font-bold">5</span>am
            </Link>
            <Link
              href="/"
              className={`font-sans text-lg font-normal tracking-tight transition-colors duration-300 ease-out ${logoColor}`}
            >
              Labs.
            </Link>
          </div>

          <Link
            href="/"
            className={`absolute left-1/2 hidden -translate-x-1/2 font-sans text-base font-normal tracking-tight transition-colors duration-300 ease-out md:block ${logoColor}`}
          >
            <span className="font-bold">5</span>amLabs.
          </Link>
        </nav>
      </header>

      <NavMenu
        open={menuOpen}
        onOpenChange={setMenuOpen}
        barClassName={logoColor}
      />

      <FloatingCTA visible={solid && !menuOpen} />
    </>
  );
}
