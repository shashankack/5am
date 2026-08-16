"use client";

import {
  cloneElement,
  isValidElement,
  useLayoutEffect,
  useRef,
  useState,
  type ReactElement,
  type ReactNode,
} from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import {
  clearIntroBootStyle,
  hasIntroPlayed,
  INTRO_VIDEO_SRC,
  markIntroPlayed,
  NAVBAR_ID,
} from "@/lib/intro";

type IntroExperienceProps = {
  hero: ReactNode;
  children: ReactNode;
};

type Phase = "boot" | "intro" | "done";

export function IntroExperience({ hero, children }: IntroExperienceProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const introPanelRef = useRef<HTMLElement>(null);
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
      const video = videoRef.current;
      const introPanel = introPanelRef.current;
      const heroVideo = rootRef.current?.querySelector<HTMLVideoElement>(
        ".js-hero-video",
      );
      if (!track || !video || !introPanel) return;

      gsap.set(track, { y: 0, force3D: true });
      video.playbackRate = 3;

      let pushing = false;

      if (heroVideo) {
        heroVideo.pause();
        const holdFrame = () => {
          if (pushing) return;
          void heroVideo.play().then(() => {
            if (!pushing) heroVideo.pause();
          });
        };
        if (heroVideo.readyState >= 2) {
          holdFrame();
        } else {
          heroVideo.addEventListener("loadeddata", holdFrame, { once: true });
        }
      }

      const finish = contextSafe(() => {
        const navbar = document.getElementById(NAVBAR_ID);
        if (navbar) {
          navbar.classList.add("nav-in");
          gsap.set(navbar, { clearProps: "transform" });
        }
        introPanel.style.display = "none";
        gsap.set(track, { y: 0, clearProps: "transform" });
        markIntroPlayed();
        document.documentElement.style.overflow = "";
        setPhase("done");
      });

      const pushOut = contextSafe(() => {
        const navbar = document.getElementById(NAVBAR_ID);

        clearIntroBootStyle();
        if (navbar) {
          gsap.set(navbar, { yPercent: -100, force3D: true });
        }

        pushing = true;
        void heroVideo?.play();

        const tl = gsap.timeline({ onComplete: finish });

        tl.to(
          track,
          {
            y: () => -(window.innerHeight - 1),
            duration: 1.05,
            ease: "power2.inOut",
            force3D: true,
          },
          0,
        );

        if (navbar) {
          tl.to(
            navbar,
            {
              yPercent: 0,
              duration: 0.7,
              ease: "power2.out",
              force3D: true,
              overwrite: true,
            },
            0.08,
          );
        }
      });

      const onEnded = contextSafe(() => {
        gsap.delayedCall(0.06, pushOut);
      });

      video.addEventListener("ended", onEnded);

      const playPromise = video.play();
      if (playPromise) {
        playPromise.catch(() => {
          gsap.delayedCall(0.2, pushOut);
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
    { scope: rootRef, dependencies: [phase], revertOnUpdate: false },
  );

  if (phase === "boot") {
    return <div className="fixed inset-0 z-[100] bg-bg" aria-hidden />;
  }

  const heroNode = isValidElement(hero)
    ? cloneElement(hero as ReactElement<{ autoPlay?: boolean }>, {
        autoPlay: phase === "done",
      })
    : hero;

  return (
    <div
      ref={rootRef}
      className={
        phase === "done"
          ? "flex flex-1 flex-col"
          : "fixed inset-0 z-[100] overflow-hidden bg-bg"
      }
    >
      <div
        ref={trackRef}
        className={phase === "done" ? "flex flex-1 flex-col" : "will-change-transform"}
      >
        {phase === "intro" ? (
          <section
            ref={introPanelRef}
            className="flex h-screen w-full items-center justify-center bg-bg"
          >
            <video
              ref={videoRef}
              className="block h-auto w-[min(400px,40vw)]"
              src={INTRO_VIDEO_SRC}
              muted
              playsInline
              preload="auto"
              aria-label="Studio intro"
            />
          </section>
        ) : null}

        <div
          className={
            phase === "intro"
              ? "-mt-px h-screen w-full overflow-hidden bg-bg"
              : undefined
          }
        >
          {heroNode}
        </div>

        {phase === "done" ? children : null}
      </div>
    </div>
  );
}
