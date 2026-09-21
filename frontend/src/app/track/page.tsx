"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function TrackPage() {
  const router = useRouter();
  const [orderNumber, setOrderNumber] = useState("");

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (orderNumber.trim()) {
      router.push(`/orders/${orderNumber.trim()}`);
    }
  };

  return (
    <main className="mx-auto max-w-xl px-6 py-20 sm:py-24">
      <div className="border border-[#e9e9e9] bg-white p-8 sm:p-10 shadow-xs text-center">
        <div className="h-16 w-16 rounded-full bg-[#faf8f5] flex items-center justify-center text-2xl mx-auto mb-4 text-[#8b7355] border border-[#e9e9e9]">
          ðŸ“¦
        </div>
        <span className="text-[10px] font-mono tracking-[0.25em] text-[#8b7355] uppercase block font-semibold mb-1">
          TRACK YOUR CREATION
        </span>
        <h1 className="font-display text-2xl sm:text-3xl font-semibold uppercase tracking-wider text-[#1c1b1b]">
          Track Your Order
        </h1>
        <p className="mt-2 text-xs text-[#6a6a6a] max-w-md mx-auto leading-relaxed">
          Enter your order reference from your email receipt or WhatsApp message to view real-time atelier tailoring and courier dispatch stages.
        </p>

        <form onSubmit={handleTrack} className="mt-8 space-y-4">
          <input
            type="text"
            required
            value={orderNumber}
            onChange={(e) => setOrderNumber(e.target.value)}
            placeholder="e.g. ORD-123456"
            className="w-full border border-[#e9e9e9] bg-[#faf8f5] px-4 py-3 text-xs text-center font-mono uppercase outline-none focus:border-[#1c1b1b] text-[#1c1b1b]"
          />

          <button
            type="submit"
            className="w-full bg-[#1c1b1b] py-3.5 text-xs font-semibold uppercase tracking-[0.2em] text-white hover:bg-[#8b7355] transition-colors"
          >
            Track Order â†’
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-[#e9e9e9] text-xs text-[#888888]">
          Need help locating your order reference?{" "}
          <Link href="/contact" className="text-[#1c1b1b] font-semibold hover:text-[#8b7355] underline">
            Contact Client Care
          </Link>
        </div>
      </div>
    </main>
  );
}

