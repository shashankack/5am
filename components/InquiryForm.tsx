"use client";

import { X } from "lucide-react";
import { FormEvent, useEffect, useId, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { Reveal } from "./Reveal";

const INQUIRY_EMAIL = "5amlabs@info.com";

const FIELDS = [
  { name: "name", label: "Your Name", type: "text", autoComplete: "name" },
  {
    name: "email",
    label: "Your Official Email",
    type: "email",
    autoComplete: "email",
  },
  {
    name: "location",
    label: "City, Country",
    type: "text",
    autoComplete: "address-level2",
  },
  {
    name: "engagement",
    label: "Engagement Type",
    type: "text",
    autoComplete: "off",
  },
  {
    name: "source",
    label: "How Did You Find Us?",
    type: "text",
    autoComplete: "off",
  },
] as const;

type FieldName = (typeof FIELDS)[number]["name"];
type FormState = Record<FieldName, string>;

const emptyForm = (): FormState => ({
  name: "",
  email: "",
  location: "",
  engagement: "",
  source: "",
});

function InquiryFields() {
  const [values, setValues] = useState<FormState>(emptyForm);
  const [status, setStatus] = useState<"idle" | "sent">("idle");

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const subject = encodeURIComponent(
      `Inquiry from ${values.name || "5am Labs site"}`,
    );
    const body = encodeURIComponent(
      [
        `Name: ${values.name}`,
        `Email: ${values.email}`,
        `City, Country: ${values.location}`,
        `Engagement Type: ${values.engagement}`,
        `How Did You Find Us?: ${values.source}`,
      ].join("\n"),
    );

    window.location.href = `mailto:${INQUIRY_EMAIL}?subject=${subject}&body=${body}`;
    setStatus("sent");
  };

  return (
    <form
      onSubmit={onSubmit}
      className="flex flex-col gap-3.5 md:gap-4"
      noValidate={false}
    >
      {FIELDS.map((field) => (
        <label key={field.name} className="block">
          <span className="sr-only">{field.label}</span>
          <input
            name={field.name}
            type={field.type}
            required
            autoComplete={field.autoComplete}
            placeholder={field.label}
            value={values[field.name]}
            onChange={(event) =>
              setValues((current) => ({
                ...current,
                [field.name]: event.target.value,
              }))
            }
            className={[
              "w-full rounded-2xl border border-body/15 bg-body/[0.04] px-5 py-4",
              "font-sans text-base text-heading placeholder:text-body md:px-6 md:py-5",
              "outline-none transition-[border-color,background-color] duration-150",
              "focus:border-body/35 focus:bg-body/[0.06]",
            ].join(" ")}
          />
        </label>
      ))}

      <div className="flex flex-col items-center gap-3 pt-4 md:pt-6">
        <button
          type="submit"
          className={[
            "inline-flex min-h-12 w-full cursor-pointer items-center justify-center rounded-full bg-heading px-8 py-3 sm:w-auto",
            "font-sans text-sm text-bg transition-opacity duration-150 ease-out",
            "hover:opacity-85 md:px-10 md:py-3.5 md:text-[15px]",
          ].join(" ")}
        >
          Submit Inquiry
        </button>

        {status === "sent" ? (
          <p className="text-center text-xs text-body md:text-sm">
            Opening your email client…
          </p>
        ) : null}
      </div>
    </form>
  );
}

export function InquiryForm() {
  return (
    <section
      id="inquiry"
      className="w-full scroll-mt-28 bg-bg px-6 py-16 md:scroll-mt-32 md:px-16 md:py-28"
    >
      <Reveal className="mx-auto w-full max-w-xl">
        <InquiryFields />
      </Reveal>
    </section>
  );
}

type InquiryModalProps = {
  id?: string;
  open: boolean;
  onClose: () => void;
};

export function InquiryModal({ id, open, onClose }: InquiryModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleClose = () => onClose();
    dialog.addEventListener("close", handleClose);
    return () => dialog.removeEventListener("close", handleClose);
  }, [onClose]);

  useEffect(() => {
    const dialog = dialogRef.current;
    const card = cardRef.current;
    if (!dialog) return;

    if (open) {
      if (!dialog.open) dialog.showModal();
      document.documentElement.style.overflow = "hidden";

      if (
        card &&
        !window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ) {
        const isSheet = !window.matchMedia("(min-width: 768px)").matches;
        gsap.fromTo(
          card,
          isSheet ? { yPercent: 100, y: 0, opacity: 1 } : { opacity: 0, y: 18 },
          {
            opacity: 1,
            y: 0,
            yPercent: 0,
            duration: isSheet ? 0.42 : 0.36,
            ease: isSheet ? "power3.out" : "power2.out",
            overwrite: true,
          },
        );
      }
    } else if (dialog.open) {
      dialog.close();
    }

    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      id={id}
      aria-labelledby={titleId}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      className={[
        "fixed inset-0 z-[200] m-0 h-full max-h-none w-full max-w-none border-none bg-transparent p-0",
        "open:grid open:place-items-end md:p-6 md:open:place-items-center",
        "backdrop:bg-heading/40 backdrop:backdrop-blur-[2px]",
      ].join(" ")}
    >
      <div
        ref={cardRef}
        onClick={(event) => event.stopPropagation()}
        className={[
          "relative w-full overflow-y-auto overscroll-contain bg-bg shadow-[0_24px_80px_-24px_rgba(0,0,0,0.35)]",
          "max-h-[92dvh] rounded-t-3xl px-5 pt-3 pb-[max(1.5rem,env(safe-area-inset-bottom))]",
          "md:max-h-[min(90dvh,44rem)] md:max-w-xl md:rounded-2xl md:px-10 md:py-10",
        ].join(" ")}
      >
        <div
          className="mx-auto mb-4 h-1 w-10 rounded-full bg-body/30 md:hidden"
          aria-hidden
        />
        <div className="mb-6 flex items-start justify-between gap-4 md:mb-8">
          <div className="min-w-0">
            <h2
              id={titleId}
              className="font-heading text-2xl leading-tight text-heading md:text-3xl"
            >
              Become a Client
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-body md:text-[15px]">
              Share a few details and we&apos;ll be in touch.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close inquiry form"
            className="flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-full text-heading transition-colors duration-150 ease-out hover:bg-body/10"
          >
            <X aria-hidden strokeWidth={1.5} className="size-[18px]" />
          </button>
        </div>

        <InquiryFields />
      </div>
    </dialog>
  );
}
