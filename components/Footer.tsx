const EMAIL = "5amlabs@info.com";

const SOCIAL = [
  {
    name: "Instagram",
    href: "https://www.instagram.com/5amlabs",
    icon: InstagramIcon,
  },
  {
    name: "WhatsApp",
    href: "https://wa.me/",
    icon: WhatsAppIcon,
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/company/5amlabs",
    icon: LinkedInIcon,
  },
] as const;

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="h-[18px] w-[18px] fill-bg">
      <path d="M12 7.2A4.8 4.8 0 1 0 12 16.8 4.8 4.8 0 0 0 12 7.2Zm0 7.92A3.12 3.12 0 1 1 12 8.88a3.12 3.12 0 0 1 0 6.24ZM17.52 6.96a1.12 1.12 0 1 1-2.24 0 1.12 1.12 0 0 1 2.24 0ZM21 7.2c0-2.32-1.88-4.2-4.2-4.2H7.2C4.88 3 3 4.88 3 7.2v9.6C3 19.12 4.88 21 7.2 21h9.6c2.32 0 4.2-1.88 4.2-4.2V7.2Zm-1.68 9.6c0 1.4-1.12 2.52-2.52 2.52H7.2a2.52 2.52 0 0 1-2.52-2.52V7.2C4.68 5.8 5.8 4.68 7.2 4.68h9.6c1.4 0 2.52 1.12 2.52 2.52v9.6Z" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="h-[18px] w-[18px] fill-bg">
      <path d="M19.05 4.91A9.82 9.82 0 0 0 12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.91-7.02Zm-7.01 15.24h-.01a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.18 8.18 0 0 1-1.26-4.38c0-4.54 3.7-8.23 8.24-8.23 2.2 0 4.26.86 5.82 2.42a8.18 8.18 0 0 1 2.41 5.81c0 4.54-3.7 8.24-8.23 8.24Zm4.52-6.16c-.25-.12-1.47-.72-1.7-.81-.23-.08-.39-.12-.56.12-.17.25-.64.8-.79.97-.15.17-.29.19-.54.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.24-1.47-1.38-1.72-.15-.25-.02-.38.11-.5.11-.11.25-.29.37-.43.12-.15.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.35-.77-1.84-.2-.48-.4-.42-.56-.42h-.48c-.17 0-.43.06-.66.31-.23.25-.87.85-.87 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.06-.1-.23-.17-.48-.29Z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="h-[15px] w-[15px] fill-bg">
      <path d="M6.54 21H3.56V9h2.98v12ZM5.05 7.43a1.73 1.73 0 1 1 0-3.46 1.73 1.73 0 0 1 0 3.46ZM20.45 21h-2.98v-5.84c0-1.39-.03-3.18-1.94-3.18-1.94 0-2.24 1.51-2.24 3.08V21h-2.98V9h2.86v1.64h.04c.4-.75 1.37-1.54 2.82-1.54 3.01 0 3.57 1.98 3.57 4.56V21Z" />
    </svg>
  );
}

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-bg px-6 py-20 md:px-16 md:py-28">
      <div className="mx-auto flex max-w-3xl flex-col items-center text-center font-sans text-heading">
        <p className="text-base md:text-lg">Thank you for your time.</p>
        <p className="mt-2 text-sm md:text-[15px]">
          © 2026, 5amLabs, All rights reserved.
        </p>
        <a
          href={`mailto:${EMAIL}`}
          className="mt-2 text-sm text-[#0000ee] underline md:text-[15px]"
        >
          {EMAIL}
        </a>

        <nav aria-label="Social" className="mt-10 flex items-center gap-5">
          {SOCIAL.map(({ name, href, icon: Icon }) => (
            <a
              key={name}
              href={href}
              target="_blank"
              rel="noreferrer"
              aria-label={name}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-heading transition-opacity duration-150 ease-out hover:opacity-80"
            >
              <Icon />
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
};
