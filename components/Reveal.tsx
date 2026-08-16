"use client";

import { useRef, type ReactNode } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** Stagger children matching this selector */
  stagger?: string;
  y?: number;
  delay?: number;
  start?: string;
};

export function Reveal({
  children,
  className,
  stagger,
  y = 28,
  delay = 0,
  start = "top 88%",
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
        { opacity: 0, y },
        {
          opacity: 1,
          y: 0,
          duration: 0.95,
          delay,
          ease: "power3.out",
          stagger: stagger ? 0.07 : 0,
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
