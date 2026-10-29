"use client";

import { Menu, Plus, X } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { getCategories } from "@/content";
import { gsap, useGSAP } from "@/lib/gsap";
import { CategoryList } from "./CategoryList";
import { useInquiry } from "./InquiryForm";

const ITEMS = [
  { id: "work", label: "Explore our work" },
  { id: "services", label: "Services", hash: "services" },
  { id: "about", label: "About 5am", href: "/about" },
  { id: "contact", label: "Contact Us" },
] as const;

type NavMenuProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  barClassName: string;
};

export function NavMenu({ open, onOpenChange, barClassName }: NavMenuProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { openInquiry } = useInquiry();
  const rootRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const menuIconRef = useRef<SVGSVGElement>(null);
  const closeIconRef = useRef<SVGSVGElement>(null);
  const workPanelRef = useRef<HTMLDivElement>(null);
  const workIconRef = useRef<HTMLSpanElement>(null);
  const readyRef = useRef(false);
  const [workOpen, setWorkOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const menuId = useId();
  const workPanelId = `${menuId}-work`;
  const categories = getCategories();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onOpenChange(false);
    };

    document.addEventListener("keydown", onKey);
    document.documentElement.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
    };
  }, [open, onOpenChange]);

  useEffect(() => {
    onOpenChange(false);
    readyRef.current = false;
  }, [pathname, onOpenChange]);

  useEffect(() => {
    if (!open) setWorkOpen(false);
  }, [open]);

  useGSAP(
    () => {
      const overlay = overlayRef.current;
      const panel = panelRef.current;
      const menuIcon = menuIconRef.current;
      const closeIcon = closeIconRef.current;
      if (!overlay || !panel || !menuIcon || !closeIcon) return;

      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      const items = panel.querySelectorAll<HTMLElement>("[data-nav-item]");

      gsap.set([menuIcon, closeIcon], { transformOrigin: "50% 50%" });

      if (!readyRef.current) {
        readyRef.current = true;
        gsap.set(menuIcon, {
          opacity: open ? 0 : 1,
          rotation: open ? 90 : 0,
          scale: open ? 0.75 : 1,
        });
        gsap.set(closeIcon, {
          opacity: open ? 1 : 0,
          rotation: open ? 0 : -90,
          scale: open ? 1 : 0.75,
        });
        if (!open) {
          gsap.set(overlay, {
            autoAlpha: 0,
            clipPath: "inset(0 0 100% 0)",
          });
          return;
        }
      }

      gsap.killTweensOf([overlay, panel, menuIcon, closeIcon, items]);

      if (reduced) {
        gsap.set(overlay, {
          autoAlpha: open ? 1 : 0,
          clipPath: open ? "none" : "inset(0 0 100% 0)",
        });
        gsap.set(menuIcon, {
          opacity: open ? 0 : 1,
          rotation: open ? 90 : 0,
          scale: open ? 0.75 : 1,
        });
        gsap.set(closeIcon, {
          opacity: open ? 1 : 0,
          rotation: open ? 0 : -90,
          scale: open ? 1 : 0.75,
        });
        gsap.set(items, { clearProps: "opacity,transform" });
        return;
      }

      if (open) {
        const tl = gsap.timeline();
        tl.set(overlay, { autoAlpha: 1 });
        tl.fromTo(
          overlay,
          { clipPath: "inset(0 0 100% 0)" },
          {
            clipPath: "inset(0 0 0% 0)",
            duration: 0.72,
            ease: "power4.inOut",
          },
          0,
        );
        tl.to(
          menuIcon,
          {
            opacity: 0,
            rotation: 90,
            scale: 0.75,
            duration: 0.28,
            ease: "power2.inOut",
          },
          0,
        );
        tl.to(
          closeIcon,
          {
            opacity: 1,
            rotation: 0,
            scale: 1,
            duration: 0.32,
            ease: "power2.out",
          },
          0.04,
        );
        tl.fromTo(
          items,
          { y: 28, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.5,
            stagger: 0.07,
            ease: "power3.out",
          },
          0.28,
        );
        return;
      }

      const tl = gsap.timeline();
      tl.to(
        items,
        {
          y: -12,
          opacity: 0,
          duration: 0.22,
          stagger: { each: 0.03, from: "end" },
          ease: "power2.in",
        },
        0,
      );
      tl.to(
        overlay,
        {
          clipPath: "inset(0 0 100% 0)",
          duration: 0.5,
          ease: "power3.inOut",
        },
        0.04,
      );
      tl.set(overlay, { autoAlpha: 0 });
      tl.to(
        closeIcon,
        {
          opacity: 0,
          rotation: -90,
          scale: 0.75,
          duration: 0.24,
          ease: "power2.in",
        },
        0,
      );
      tl.to(
        menuIcon,
        {
          opacity: 1,
          rotation: 0,
          scale: 1,
          duration: 0.32,
          ease: "power2.out",
        },
        0.06,
      );
    },
    { scope: rootRef, dependencies: [open, mounted] },
  );

  useGSAP(
    () => {
      const panel = workPanelRef.current;
      const icon = workIconRef.current;
      if (!panel || !icon) return;

      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      gsap.killTweensOf([panel, icon]);
      gsap.set(icon, { transformOrigin: "50% 50%" });

      if (reduced) {
        gsap.set(panel, { height: workOpen ? "auto" : 0 });
        gsap.set(icon, { rotation: workOpen ? 45 : 0 });
        return;
      }

      if (!workOpen) {
        gsap.to(icon, { rotation: 0, duration: 0.28, ease: "power2.out" });
        gsap.to(panel, { height: 0, duration: 0.36, ease: "power3.inOut" });
        return;
      }

      gsap.set(panel, { height: "auto" });
      const target = panel.scrollHeight;
      gsap.set(panel, { height: 0 });
      gsap.to(icon, { rotation: 45, duration: 0.32, ease: "power2.out" });
      gsap.to(panel, {
        height: target,
        duration: 0.48,
        ease: "power3.out",
        onComplete: () => {
          gsap.set(panel, { height: "auto" });
        },
      });
    },
    { dependencies: [workOpen] },
  );

  const close = () => onOpenChange(false);

  const goToHash = (hash: string) => {
    close();
    const scroll = () =>
      document.getElementById(hash)?.scrollIntoView({ behavior: "smooth" });

    if (pathname === "/") {
      window.setTimeout(scroll, 420);
      return;
    }

    router.push(`/#${hash}`);
  };

  const onContact = () => {
    close();
    window.setTimeout(openInquiry, 280);
  };

  return (
    <div ref={rootRef} className="contents">
      <button
        type="button"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => onOpenChange(!open)}
        className={[
          "pointer-events-auto fixed top-[env(safe-area-inset-top)] right-[max(1.25rem,env(safe-area-inset-right))] z-[170]",
          "flex h-12 w-10 cursor-pointer items-center justify-center md:right-16 md:h-15",
          "transition-colors duration-300 ease-out",
          barClassName,
        ].join(" ")}
      >
        <span className="relative block size-5" aria-hidden>
          <Menu
            ref={menuIconRef}
            strokeWidth={1.5}
            className="absolute inset-0 size-5"
          />
          <X
            ref={closeIconRef}
            strokeWidth={1.5}
            className="absolute inset-0 size-5 opacity-0"
          />
        </span>
      </button>

      {mounted && open
        ? createPortal(
            <div
              ref={overlayRef}
              id={menuId}
              className={[
                "fixed inset-0 z-[150] overflow-y-auto bg-bg text-heading",
                open ? "pointer-events-auto" : "pointer-events-none",
              ].join(" ")}
              aria-hidden={!open}
              inert={!open ? true : undefined}
            >
              <div
                ref={panelRef}
                className="mx-auto flex min-h-full w-full max-w-6xl flex-col px-5 pt-[calc(4.25rem+env(safe-area-inset-top))] pb-16 md:px-16 md:pt-[calc(5.25rem+env(safe-area-inset-top))] md:pb-24"
              >
                <nav aria-label="Site">
            <ul className="flex flex-col">
              {ITEMS.map((item) => (
                <li
                  key={item.id}
                  data-nav-item
                  className="border-b border-body/15"
                >
                  {item.id === "work" ? (
                    <div>
                      <button
                        type="button"
                        aria-expanded={workOpen}
                        aria-controls={workPanelId}
                        onClick={() => setWorkOpen((current) => !current)}
                        className="flex w-full cursor-pointer items-center justify-between gap-6 py-5 text-left transition-colors duration-200 hover:text-body md:py-7"
                      >
                        <span className="font-heading text-3xl leading-none md:text-5xl">
                          {item.label}
                        </span>
                        <span
                          ref={workIconRef}
                          className="inline-flex text-body will-change-transform"
                          aria-hidden
                        >
                          <Plus
                            strokeWidth={1.5}
                            className="size-5 md:size-6"
                          />
                        </span>
                      </button>
                      <div
                        id={workPanelId}
                        ref={workPanelRef}
                        className="h-0 overflow-hidden"
                        inert={!workOpen ? true : undefined}
                      >
                        <div className="pb-8 md:pb-10">
                          <CategoryList
                            categories={categories}
                            title={null}
                            idPrefix="nav-"
                            sectionId="nav-work"
                            reveal={false}
                            syncScroll={false}
                            onNavigate={close}
                          />
                        </div>
                      </div>
                    </div>
                  ) : item.id === "contact" ? (
                    <button
                      type="button"
                      onClick={onContact}
                      className="flex w-full cursor-pointer py-5 text-left transition-colors duration-200 hover:text-body md:py-7"
                    >
                      <span className="font-heading text-3xl leading-none md:text-5xl">
                        {item.label}
                      </span>
                    </button>
                  ) : "href" in item ? (
                    <Link
                      href={item.href}
                      onClick={close}
                      className="flex w-full py-5 text-left transition-colors duration-200 hover:text-body md:py-7"
                    >
                      <span className="font-heading text-3xl leading-none md:text-5xl">
                        {item.label}
                      </span>
                    </Link>
                  ) : (
                    <button
                      type="button"
                      onClick={() => goToHash(item.hash)}
                      className="flex w-full cursor-pointer py-5 text-left transition-colors duration-200 hover:text-body md:py-7"
                    >
                      <span className="font-heading text-3xl leading-none md:text-5xl">
                        {item.label}
                      </span>
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </nav>
              </div>
            </div>,
            document.body,
          )
        : null}
    </div>
  );
}
