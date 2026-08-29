"use client";

import { FormEvent, useState } from "react";
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

export function InquiryForm() {
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
    <section
      id="inquiry"
      className="w-full scroll-mt-28 bg-bg px-6 py-16 md:scroll-mt-32 md:px-16 md:py-28"
    >
      <Reveal className="mx-auto w-full max-w-xl">
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
                  "font-sans text-sm text-heading placeholder:text-body md:px-6 md:py-5 md:text-base",
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
                "inline-flex cursor-pointer items-center justify-center rounded-full bg-heading px-8 py-3",
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
      </Reveal>
    </section>
  );
}
