"use client";

import { useInquiry } from "./InquiryForm";

type FloatingCTAProps = {
  visible: boolean;
};

export function FloatingCTA({ visible }: FloatingCTAProps) {
  const { open, dialogId, openInquiry } = useInquiry();
  const shown = visible && !open;

  return (
      <div
        className={[
          "fixed z-[110] transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
          "right-[max(1rem,env(safe-area-inset-right))] bottom-[max(1rem,env(safe-area-inset-bottom))]",
          "md:top-1/2 md:right-0 md:bottom-auto md:pr-[env(safe-area-inset-right)]",
          shown
            ? "translate-y-0 md:-translate-y-1/2 md:translate-x-0"
            : "pointer-events-none translate-y-[calc(100%+2rem)] md:-translate-y-1/2 md:translate-x-full",
        ].join(" ")}
        aria-hidden={!shown}
      >
        <button
          type="button"
          onClick={openInquiry}
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-controls={dialogId}
          tabIndex={shown ? 0 : -1}
          className={[
            "group flex cursor-pointer items-center gap-2.5 bg-heading text-bg ring-1 ring-heading",
            "shadow-[0_12px_40px_-16px_rgba(0,0,0,0.45)]",
            "transition-[background-color,color,transform] duration-200 ease-out",
            "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-heading",
            "min-h-12 rounded-full px-5 active:scale-[0.97]",
            "md:min-h-0 md:min-w-11 md:flex-col md:gap-3 md:rounded-l-2xl md:rounded-r-none md:px-3 md:py-6",
            "md:hover:bg-bg md:hover:text-heading md:active:scale-100",
          ].join(" ")}
        >
          <span
            className="size-1.5 shrink-0 rounded-full bg-bg transition-colors duration-200 ease-out md:size-2 md:group-hover:bg-heading"
            aria-hidden
          />
          <span className="font-heading text-sm whitespace-nowrap md:rotate-180 md:tracking-[0.14em] md:[writing-mode:vertical-rl]">
            Become a Client
          </span>
        </button>
      </div>
  );
}
