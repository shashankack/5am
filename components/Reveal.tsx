"use client";

import { useRef, type ReactNode } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

type RevealProps = {
  children: ReactNode;
  className?: string;
  stagger?: string;
  y?: number;
  delay?: number;
  duration?: number;
  start?: string;
};

export function Reveal({
  children,
  className,
  stagger,
  y = 14,
  delay = 0,
  duration = 0.48,
  start = "top 90%",
}: RevealProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return;
      }

      const targets = stagger ? root.querySelectorAll(stagger) : [root];
      if (!targets.length) return;

      gsap.fromTo(
        targets,
        { autoAlpha: 0, y },
        {
          autoAlpha: 1,
          y: 0,
          duration,
          delay,
          ease: "power2.out",
          stagger: stagger ? 0.04 : 0,
          force3D: true,
          overwrite: "auto",
          scrollTrigger: {
            trigger: root,
            start,
            once: true,
          },
        },
      );
    },
    { scope: rootRef },
  );

  return (
    <div ref={rootRef} className={className}>
      {children}
    </div>
  );
}
