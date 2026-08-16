"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import {
  clearIntroBootStyle,
  hasIntroPlayed,
  INTRO_VIDEO_SRC,
  markIntroPlayed,
  NAVBAR_ID,
} from "@/lib/intro";

gsap.registerPlugin(useGSAP);

type IntroExperienceProps = {
  hero: ReactNode;
  children: ReactNode;
};

type Phase = "boot" | "intro" | "done";

export function IntroExperience({ hero, children }: IntroExperienceProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const heroInnerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [phase, setPhase] = useState<Phase>("boot");

  useLayoutEffect(() => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (hasIntroPlayed() || reduced) {
      setPhase("done");
      return;
    }

    setPhase("intro");
    document.documentElement.style.overflow = "hidden";

    return () => {
      document.documentElement.style.overflow = "";
    };
  }, []);

  useGSAP(
    (_context, contextSafe) => {
      if (phase !== "intro" || !contextSafe) return;

      const track = trackRef.current;
      const heroInner = heroInnerRef.current;
      const video = videoRef.current;
      if (!track || !heroInner || !video) return;

      const viewport = () => window.innerHeight;

      gsap.set(track, { y: 0, force3D: true });
      // Scale content inside the hero clip  never the panel itself (avoids seams)
      gsap.set(heroInner, { scale: 1.08, transformOrigin: "50% 50%" });
      gsap.set(video, { opacity: 0, scale: 0.94, y: 12 });
      video.playbackRate = 3;

      gsap.to(video, {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 1,
        ease: "power3.out",
        delay: 0.04,
      });

      const finish = contextSafe(() => {
        const navbar = document.getElementById(NAVBAR_ID);
        if (navbar) {
          navbar.classList.add("nav-in");
          gsap.set(navbar, { clearProps: "transform" });
        }
        markIntroPlayed();
        document.documentElement.style.overflow = "";
        setPhase("done");
      });

      const pushOut = contextSafe(() => {
        const navbar = document.getElementById(NAVBAR_ID);

        // Hand transform control to GSAP  boot CSS would otherwise fight the tween
        clearIntroBootStyle();
        if (navbar) {
          gsap.set(navbar, { yPercent: -100, force3D: true });
        }

        const tl = gsap.timeline({ onComplete: finish });

        // One clean stack push  panels stay flush (1px overlap kills desktop hairlines)
        tl.to(
          track,
          {
            y: () => -(viewport() - 1),
            duration: 1.9,
            ease: "power3.inOut",
            force3D: true,
          },
          0,
        );

        // Intro mark drifts up and softens as it's pushed away
        tl.to(
          video,
          {
            y: -56,
            opacity: 0,
            scale: 0.9,
            duration: 1.05,
            ease: "power3.in",
          },
          0,
        );

        // Hero content eases into frame while the panel pushes
        tl.to(
          heroInner,
          {
            scale: 1,
            duration: 1.9,
            ease: "power3.inOut",
            force3D: true,
          },
          0,
        );

        // Navbar slides in from the top with the push
        if (navbar) {
          tl.to(
            navbar,
            {
              yPercent: 0,
              duration: 1.6,
              ease: "power3.out",
              force3D: true,
              overwrite: true,
            },
            0.2,
          );
        }
      });

      const onEnded = contextSafe(() => {
        gsap.delayedCall(0.22, pushOut);
      });

      video.addEventListener("ended", onEnded);

      const playPromise = video.play();
      if (playPromise) {
        playPromise.catch(() => {
          gsap.delayedCall(0.45, pushOut);
        });
      }

      return () => {
        video.removeEventListener("ended", onEnded);
        if (hasIntroPlayed()) {
          queueMicrotask(() => {
            const navbar = document.getElementById(NAVBAR_ID);
            if (!navbar) return;
            navbar.classList.add("nav-in");
            gsap.set(navbar, { clearProps: "transform" });
          });
        }
      };
    },
    { scope: rootRef, dependencies: [phase] },
  );

  if (phase === "boot") {
    return <div className="fixed inset-0 z-[100] bg-bg" aria-hidden />;
  }

  if (phase === "intro") {
    return (
      <div
        ref={rootRef}
        className="fixed inset-0 z-[100] overflow-hidden bg-bg"
      >
        <div ref={trackRef} className="will-change-transform">
          <section className="flex h-screen w-full items-center justify-center bg-bg">
            <video
              ref={videoRef}
              className="block h-auto w-[min(400px,40vw)] will-change-transform"
              src={INTRO_VIDEO_SRC}
              muted
              playsInline
              preload="auto"
              aria-label="Studio intro"
            />
          </section>

          {/* -mt-px overlaps the seam between stacked 100vh panels on desktop */}
          <div className="-mt-px h-screen w-full overflow-hidden bg-bg">
            <div
              ref={heroInnerRef}
              className="h-full w-full will-change-transform"
            >
              {hero}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col">
      {hero}
      {children}
    </div>
  );
}
