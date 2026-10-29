import type { Metadata } from "next";
import { AboutView } from "@/components/AboutView";

export const metadata: Metadata = {
  title: "About 5am | 5AM",
  description:
    "Senior-led production studio creating high-impact shoots for celebrities and leading brands.",
};

export default function AboutPage() {
  return <AboutView />;
}
