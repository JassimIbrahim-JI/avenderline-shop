import Concierge from "@/components/Concierge";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Concierge | AvenderLine Maison",
  description: "Chat with the AvenderLine AI assistant in Doha for personalized styling, live order tracking, and bespoke sizing. Replies in English or Arabic.",
};

export default function ConciergePage() {
  return (
    <main className="mx-auto max-w-7xl px-6 py-16 sm:py-20">
      <div className="mb-10 text-center max-w-xl mx-auto">
        <span className="text-[10px] font-mono tracking-[0.25em] text-[#8b7355] uppercase block font-semibold mb-1">
          AVENDERLINE AI
        </span>
        <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-semibold uppercase tracking-wider text-[#1c1b1b]">
          AI Concierge
        </h1>
        <p className="mt-3 text-xs sm:text-sm text-[#6a6a6a] leading-relaxed font-light">
          The in-house AI assistant for the AvenderLine atelier. Ask in English or Arabic about silhouette pairing, royal crepe care, bespoke fits, or order updates.
        </p>
      </div>
      <Concierge />
    </main>
  );
}

