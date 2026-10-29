import type { Metadata, Viewport } from "next";
import { cookies } from "next/headers";
import localFont from "next/font/local";
import { Noto_Serif } from "next/font/google";
import { Footer } from "@/components/Footer";
import { InquiryProvider } from "@/components/InquiryForm";
import { Navbar } from "@/components/Navbar";
import { INTRO_PENDING_CLASS, INTRO_PLAYED_KEY } from "@/lib/intro";
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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const introPlayed =
    (await cookies()).get(INTRO_PLAYED_KEY)?.value === "1";

  return (
    <html
      lang="en"
      className={`${helvetica.variable} ${notoSerif.variable} h-full antialiased${introPlayed ? "" : ` ${INTRO_PENDING_CLASS}`}`}
    >
      <body className="flex min-h-full flex-col bg-bg font-sans text-body antialiased">
        <InquiryProvider>
          <Navbar />
          {children}
          <Footer />
        </InquiryProvider>
      </body>
    </html>
  );
}
