import type { Metadata, Viewport } from "next";
import { ReactNode } from "react";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Focus Haven | Train Your Mind",
  description:
    "Immersive focus and cognition training platform featuring meditation, pomodoro, focus games, and reflex drills.",
  openGraph: {
    title: "Focus Haven",
    description:
      "Immersive focus and cognition training platform featuring meditation, pomodoro, focus games, and reflex drills.",
  },
};

export const viewport: Viewport = {
  themeColor: "#1E3D58",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen text-night">
        <div className="relative flex min-h-screen flex-col overflow-x-hidden">
          <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(74,140,140,0.18),_transparent_55%)]" />
          <div className="pointer-events-none fixed bottom-[-15%] left-[-10%] -z-10 h-72 w-72 rounded-full bg-[radial-gradient(circle,_rgba(249,199,132,0.55),_transparent_65%)] blur-3xl" />
          <div className="pointer-events-none fixed right-[-15%] top-[-10%] -z-10 h-96 w-96 rounded-full bg-[radial-gradient(circle,_rgba(143,196,195,0.65),_transparent_70%)] blur-3xl" />
          <Header />
          <main className="mx-auto w-full max-w-6xl flex-1 px-6 pb-16 pt-12">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
