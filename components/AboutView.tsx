"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useLayoutEffect, useRef, useState } from "react";
import { Magnet } from "@/components/Magnet";
import { useInquiry } from "@/components/InquiryForm";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";

const Dither = dynamic(
  () => import("@/components/Dither").then((mod) => mod.Dither),
  { ssr: false },
);

const CITIES = [
  { code: "BLR", name: "Bengaluru", note: "Base of operations" },
  { code: "BOM", name: "Mumbai", note: "Campaigns & talent" },
  { code: "DEL", name: "Delhi", note: "National reach" },
] as const;

const STEPS = [
  {
    n: "01",
    title: "Concept",
    body: "The idea, the references, the world. We start with a brief that already feels like a frame.",
  },
  {
    n: "02",
    title: "Direction",
    body: "Casting, styling, locations, light. Every choice is made so the shoot can move fast and stay precise.",
  },
  {
    n: "03",
    title: "Production",
    body: "Senior-led crews on set. Tight schedules, high-pressure talent days, no noise in the result.",
  },
  {
    n: "04",
    title: "Delivery",
    body: "Stills, motion, and assets cut for campaign, print, and culture — ready to live everywhere they need to.",
  },
] as const;

function AboutDither() {
  const hostRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useLayoutEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const arm = () => {
      if (host.clientWidth >= 2 && host.clientHeight >= 2) {
        setReady(true);
      }
    };

    const observer = new ResizeObserver(arm);
    observer.observe(host);
    arm();

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={hostRef} className="absolute inset-0">
      {ready ? (
        <Dither
          waveColor="#111111"
          backgroundColor="#ffffff"
          waveSpeed={0.045}
          waveFrequency={2.6}
          waveAmplitude={0.32}
          colorNum={5}
          pixelSize={3}
          ditherMode="halftone"
          mouseEffect="ripple"
          mouseRadius={0.9}
          mouseStrength={1.15}
          trail={0.7}
          clickRipple
          enableMouseInteraction
          contrast={1.15}
          className="h-full w-full"
        />
      ) : null}
    </div>
  );
}

export function AboutView() {
  const { openInquiry } = useInquiry();
  const rootRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return;
      }

      gsap.fromTo(
        "[data-about-hero]",
        { opacity: 0, y: 36 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          stagger: 0.12,
          delay: 0.06,
          ease: "power3.out",
          immediateRender: true,
        },
      );
    },
    { scope: copyRef, revertOnUpdate: true },
  );

  useGSAP(
    () => {
      const refresh = () => ScrollTrigger.refresh();
      const refreshId = window.requestAnimationFrame(refresh);

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return () => window.cancelAnimationFrame(refreshId);
      }

      gsap.utils
        .toArray<HTMLElement>("[data-about-reveal]")
        .forEach((section) => {
          const items = section.querySelectorAll<HTMLElement>(
            "[data-about-item]",
          );
          const targets = items.length ? items : [section];

          gsap.fromTo(
            targets,
            { opacity: 0, y: 40 },
            {
              opacity: 1,
              y: 0,
              duration: 0.75,
              stagger: 0.1,
              ease: "power3.out",
              immediateRender: true,
              overwrite: "auto",
              scrollTrigger: {
                trigger: section,
                start: "top 82%",
                once: true,
              },
            },
          );
        });

      window.requestAnimationFrame(refresh);

      return () => window.cancelAnimationFrame(refreshId);
    },
    { scope: rootRef, revertOnUpdate: true },
  );

  return (
    <main className="flex flex-1 flex-col bg-bg">
      <section className="relative isolate min-h-[100svh] w-full overflow-hidden">
        <AboutDither />

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-bg/70 via-transparent to-bg" />

        <div
          ref={copyRef}
          className="relative z-10 mx-auto flex min-h-[100svh] w-full max-w-6xl flex-col justify-end px-6 pb-16 pt-28 md:px-16 md:pb-20"
        >
          <p
            data-about-hero
            className="text-[11px] tracking-[0.28em] text-heading/70 uppercase md:text-xs"
          >
            Move the cursor · click for ripples
          </p>
          <h1
            data-about-hero
            className="mt-5 max-w-4xl font-heading text-5xl leading-[0.92] text-heading md:text-7xl lg:text-8xl"
          >
            The studio
            <span className="mt-2 block font-sans text-2xl font-normal tracking-tight md:text-4xl">
              5amLabs.
            </span>
          </h1>
          <p
            data-about-hero
            className="mt-8 max-w-xl text-sm leading-relaxed text-heading/75 md:text-base"
          >
            Senior-led production. High-impact shoots for celebrities and
            leading brands — from the first still to the last frame.
          </p>
        </div>
      </section>

      <div ref={rootRef}>
      <section
        data-about-reveal
        className="w-full px-6 py-20 md:px-16 md:py-32"
      >
        <div className="mx-auto grid w-full max-w-6xl gap-14 md:grid-cols-12 md:gap-10">
          <div className="md:col-span-5">
            <p
              data-about-item
              className="text-[11px] tracking-[0.22em] text-body uppercase md:text-xs"
            >
              About 5am
            </p>
            <h2
              data-about-item
              className="mt-4 font-heading text-3xl leading-tight text-heading md:text-5xl"
            >
              Built for work that has to hold.
            </h2>
          </div>
          <div className="flex flex-col gap-6 md:col-span-7 md:pt-10">
            <p
              data-about-item
              className="text-sm leading-relaxed text-body md:text-[17px] md:leading-8"
            >
              We are a senior-led production studio creating high-impact shoots
              for celebrities and leading brands. From concept development and
              creative direction to production and final delivery, we bring
              every campaign to life through strong visuals, precise execution,
              and a clear understanding of culture.
            </p>
            <p
              data-about-item
              className="text-sm leading-relaxed text-body md:text-[17px] md:leading-8"
            >
              The room is quiet on purpose. The work is not. We treat light,
              timing, and talent with the same seriousness — so the image
              survives the billboard, the feed, and the archive.
            </p>
          </div>
        </div>
      </section>

      <section
        data-about-reveal
        className="w-full border-y border-heading/10 px-6 py-16 md:px-16 md:py-20"
      >
        <div className="mx-auto grid w-full max-w-6xl gap-10 md:grid-cols-3">
          {CITIES.map((city) => (
            <article
              key={city.code}
              data-about-item
              className="group relative overflow-hidden bg-heading px-7 py-10 text-bg transition-transform duration-500 ease-out md:px-8 md:py-12 md:hover:-translate-y-1"
            >
              <p className="font-sans text-xs tracking-[0.28em] uppercase opacity-60">
                {city.note}
              </p>
              <p className="mt-8 font-heading text-6xl leading-none tracking-tight md:text-7xl">
                {city.code}
              </p>
              <p className="mt-4 text-sm md:text-base">{city.name}</p>
            </article>
          ))}
        </div>
      </section>

      <section
        data-about-reveal
        className="w-full px-6 py-20 md:px-16 md:py-32"
      >
        <div className="mx-auto w-full max-w-6xl">
          <p
            data-about-item
            className="text-[11px] tracking-[0.22em] text-body uppercase md:text-xs"
          >
            How we work
          </p>
          <h2
            data-about-item
            className="mt-4 max-w-xl font-heading text-3xl leading-tight text-heading md:text-5xl"
          >
            One line from idea to delivery.
          </h2>

          <ol className="mt-14 grid gap-px bg-heading/10 md:grid-cols-4">
            {STEPS.map((step) => (
              <li
                key={step.n}
                data-about-item
                className="flex flex-col gap-5 bg-bg px-6 py-8 md:px-7 md:py-10"
              >
                <span className="font-sans text-xs tracking-[0.2em] text-body">
                  {step.n}
                </span>
                <h3 className="font-heading text-2xl text-heading md:text-3xl">
                  {step.title}
                </h3>
                <p className="text-sm leading-relaxed text-body">{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section
        data-about-reveal
        className="w-full px-6 pb-28 md:px-16 md:pb-36"
      >
        <div className="mx-auto flex w-full max-w-6xl flex-col items-start gap-8 border-t border-heading/10 pt-16 md:flex-row md:items-end md:justify-between md:pt-20">
          <div className="max-w-lg">
            <h2
              data-about-item
              className="font-heading text-3xl leading-tight text-heading md:text-5xl"
            >
              If the work matters, start here.
            </h2>
            <p
              data-about-item
              className="mt-4 text-sm leading-relaxed text-body md:text-base"
            >
              Briefs, talent, timelines — tell us what you&apos;re making.
            </p>
          </div>

          <div data-about-item>
            <Magnet padding={80} magnetStrength={3} maxOffset={28} scale={1.04}>
              <button
                type="button"
                onClick={openInquiry}
                className="inline-flex cursor-pointer items-center rounded-full bg-heading px-8 py-4 font-sans text-sm text-bg transition-opacity duration-200 hover:opacity-90 md:px-10 md:py-5 md:text-[15px]"
              >
                Become a Client
              </button>
            </Magnet>
          </div>
        </div>

        <p data-about-item className="mx-auto mt-16 w-full max-w-6xl">
          <Link
            href="/"
            className="text-xs tracking-[0.18em] text-body uppercase transition-colors duration-200 hover:text-heading"
          >
            ← All work
          </Link>
        </p>
      </section>
      </div>
    </main>
  );
}
