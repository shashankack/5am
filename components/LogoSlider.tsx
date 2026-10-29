"use client";

import { useRef, type CSSProperties } from "react";
import { CLIENT_LOGOS, type ClientLogo } from "@/lib/client-logos";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { MediaImage } from "./MediaImage";

export type LogoSliderProps = {
  logos?: ClientLogo[];
  /** Pixels travelled per second. */
  speed?: number;
  direction?: "left" | "right";
  /** Pause the marquee while the pointer is over the strip. */
  pauseOnHover?: boolean;
  /** Allow click-and-drag to scrub the strip. */
  draggable?: boolean;
  /** Soft fade at the left and right edges. */
  fadeEdges?: boolean;
  /** Start logos muted; they sharpen on hover. */
  muted?: boolean;
  /** Pause while the strip is off screen. */
  pauseWhenOffscreen?: boolean;
  /** Force the marquee to stay still. */
  paused?: boolean;
  gap?: number;
  logoHeight?: number;
  className?: string;
};

export function LogoSlider({
  logos = CLIENT_LOGOS,
  speed = 42,
  direction = "left",
  pauseOnHover = true,
  draggable = true,
  fadeEdges = true,
  muted = true,
  pauseWhenOffscreen = true,
  paused = false,
  gap = 56,
  logoHeight = 44,
  className,
}: LogoSliderProps) {
  const rootRef = useRef<HTMLElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const sequenceRef = useRef<HTMLUListElement>(null);

  useGSAP(
    (_context, contextSafe) => {
      const root = rootRef.current;
      const viewport = viewportRef.current;
      const track = trackRef.current;
      const sequence = sequenceRef.current;
      if (!root || !viewport || !track || !sequence || !contextSafe) return;
      if (logos.length === 0) return;

      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      const state = {
        x: 0,
        width: 0,
        hovering: false,
        dragging: false,
        offscreen: false,
        lastX: 0,
      };

      const measure = () => {
        const next = sequence.nextElementSibling as HTMLElement | null;
        state.width = next
          ? next.offsetLeft - sequence.offsetLeft
          : sequence.offsetWidth;
      };
      measure();

      const wrapX = () => {
        if (state.width <= 0) return;
        state.x = gsap.utils.wrap(-state.width, 0, state.x);
        gsap.set(track, { x: state.x, force3D: true });
      };

      const moving = () =>
        !reduced &&
        !paused &&
        !state.dragging &&
        !(pauseOnHover && state.hovering) &&
        !(pauseWhenOffscreen && state.offscreen);

      const tick = () => {
        if (moving() && state.width > 0) {
          const delta = gsap.ticker.deltaRatio(60);
          const step = (speed / 60) * delta;
          state.x += direction === "left" ? -step : step;
        }
        wrapX();
      };

      gsap.ticker.add(tick);

      const onViewportEnter = contextSafe(() => {
        state.hovering = true;
      });
      const onViewportLeave = contextSafe(() => {
        state.hovering = false;
      });

      if (pauseOnHover) {
        viewport.addEventListener("pointerenter", onViewportEnter);
        viewport.addEventListener("pointerleave", onViewportLeave);
      }

      const onPointerDown = contextSafe((event: PointerEvent) => {
        if (!draggable || event.button !== 0) return;
        state.dragging = true;
        state.lastX = event.clientX;
        viewport.setPointerCapture(event.pointerId);
        viewport.style.cursor = "grabbing";
      });

      const onPointerMove = contextSafe((event: PointerEvent) => {
        if (!state.dragging) return;
        state.x += event.clientX - state.lastX;
        state.lastX = event.clientX;
        wrapX();
      });

      const onPointerUp = contextSafe((event: PointerEvent) => {
        if (!state.dragging) return;
        state.dragging = false;
        if (viewport.hasPointerCapture(event.pointerId)) {
          viewport.releasePointerCapture(event.pointerId);
        }
        viewport.style.cursor = draggable ? "grab" : "default";
      });

      if (draggable) {
        viewport.style.cursor = "grab";
        viewport.addEventListener("pointerdown", onPointerDown);
        viewport.addEventListener("pointermove", onPointerMove);
        viewport.addEventListener("pointerup", onPointerUp);
        viewport.addEventListener("pointercancel", onPointerUp);
      }

      const observer = new ResizeObserver(measure);
      observer.observe(sequence);

      let trigger: ScrollTrigger | undefined;
      if (pauseWhenOffscreen) {
        trigger = ScrollTrigger.create({
          trigger: root,
          start: "top bottom",
          end: "bottom top",
          onToggle: (self) => {
            state.offscreen = !self.isActive;
          },
        });
        state.offscreen = !trigger.isActive;
      }

      return () => {
        gsap.ticker.remove(tick);
        observer.disconnect();
        trigger?.kill();
        viewport.removeEventListener("pointerenter", onViewportEnter);
        viewport.removeEventListener("pointerleave", onViewportLeave);
        viewport.removeEventListener("pointerdown", onPointerDown);
        viewport.removeEventListener("pointermove", onPointerMove);
        viewport.removeEventListener("pointerup", onPointerUp);
        viewport.removeEventListener("pointercancel", onPointerUp);
      };
    },
    {
      scope: rootRef,
      dependencies: [
        logos,
        speed,
        direction,
        pauseOnHover,
        draggable,
        muted,
        pauseWhenOffscreen,
        paused,
        gap,
        logoHeight,
      ],
      revertOnUpdate: true,
    },
  );

  const sequence = (
    hidden: boolean,
    ref?: typeof sequenceRef,
  ) => (
    <ul
      ref={ref}
      data-sequence
      aria-hidden={hidden || undefined}
      className="flex shrink-0 items-center gap-8 md:[gap:var(--logo-gap)]"
    >
      {logos.map((logo, index) => (
        <li
          key={`${hidden ? "b" : "a"}-${logo.src}-${index}`}
          className="shrink-0 overflow-visible"
        >
          <div
            data-logo
            className="group flex h-7 cursor-pointer items-center justify-center overflow-visible md:h-[var(--logo-h)]"
          >
            <MediaImage
              src={logo.src}
              alt={hidden ? "" : logo.alt}
              width={220}
              height={80}
              fadeIn={false}
              draggable={false}
              className={[
                "h-full w-auto max-w-[6.5rem] origin-center object-contain object-center md:max-w-[11rem]",
                "transition-[transform,opacity,filter] duration-300 ease-out",
                muted
                  ? "opacity-70 grayscale group-hover:scale-105 group-hover:opacity-100 group-hover:grayscale-0"
                  : "opacity-90 group-hover:scale-105 group-hover:opacity-100",
              ].join(" ")}
            />
          </div>
        </li>
      ))}
    </ul>
  );

  if (logos.length === 0) return null;

  return (
    <section
      ref={rootRef}
      aria-label="Clients"
      className={["relative w-full overflow-x-hidden bg-bg py-6 md:py-12", className]
        .filter(Boolean)
        .join(" ")}
      style={
        {
          "--logo-gap": `${gap}px`,
          "--logo-h": `${logoHeight}px`,
        } as CSSProperties
      }
    >
      <div
        ref={viewportRef}
        className={[
          "relative overflow-x-clip overflow-y-visible py-3 select-none md:py-5",
          fadeEdges
            ? "[mask-image:linear-gradient(to_right,transparent,black_7%,black_93%,transparent)]"
            : null,
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <div
          ref={trackRef}
          className="flex w-max gap-8 will-change-transform md:[gap:var(--logo-gap)]"
        >
          {sequence(false, sequenceRef)}
          {sequence(true)}
        </div>
      </div>
    </section>
  );
}
