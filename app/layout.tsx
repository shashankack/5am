import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Noto_Serif } from "next/font/google";
import Script from "next/script";
import { Footer, Navbar } from "@/components";
import { INTRO_BOOT_SCRIPT } from "@/lib/intro";
import "./globals.css";

const helvetica = localFont({
  src: [
    {
      path: "../public/fonts/Helvetica.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/Helvetica-Bold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-helvetica",
  display: "swap",
  fallback: ["Helvetica Neue", "Helvetica", "Arial", "sans-serif"],
});

const notoSerif = Noto_Serif({
  variable: "--font-noto-serif",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "5AM",
  description:
    "Senior-led production studio creating high-impact shoots for celebrities and leading brands.",
};

export const viewport: Viewport = {
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${helvetica.variable} ${notoSerif.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-bg font-sans text-body antialiased">
        <Script id="intro-boot" strategy="beforeInteractive">
          {INTRO_BOOT_SCRIPT}
        </Script>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
