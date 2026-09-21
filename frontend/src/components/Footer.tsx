"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  InstagramIcon,
  WhatsAppIcon,
  ApplePayIcon,
  VisaIcon,
  MastercardIcon,
  MadaIcon,
} from "@/components/Icons";

export default function Footer() {
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newsletterStatus, setNewsletterStatus] = useState<"idle" | "success" | "error">("idle");
  const [statusMessage, setStatusMessage] = useState("");

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;

    setIsSubmitting(true);
    setNewsletterStatus("idle");
    setStatusMessage("");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: newsletterEmail.trim(), source: "footer" }),
      });

      const data = await res.json();
      if (res.ok) {
        setNewsletterStatus("success");
        setStatusMessage(data.message || "Welcome to AvenderLine PrivÃ©.");
        setNewsletterEmail("");
      } else {
        setNewsletterStatus("error");
        setStatusMessage(data.error || "Failed to subscribe. Please try again.");
      }
    } catch {
      setNewsletterStatus("error");
      setStatusMessage("Network error. Please verify your connection.");
    } finally {
      setIsSubmitting(false);
    }
  };
  const exploreLinks = [
    { href: "/collections/women", label: "All Abayas" },
    { href: "/collections/classics", label: "Black Abayas" },
    { href: "/collections/occasions", label: "Haute Couture" },
    { href: "/concierge", label: "AI Concierge" },
  ];

  const clientCareLinks = [
    { href: "/size-guide", label: "Size Guide" },
    { href: "/shipping-returns", label: "Shipping & Returns" },
    { href: "/track", label: "Track Your Order" },
    { href: "/contact", label: "Contact Us & Atelier" },
  ];

  return (
    <footer className="border-t border-[#e9e9e9] bg-[#ffffff] text-[#1c1b1b]">
      {/* 4 Clean Columns (Prestige Theme Layout) */}
      <div className="mx-auto max-w-7xl px-6 py-16 sm:py-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 sm:gap-14">
        {/* Col 1: About the Maison */}
        <div className="space-y-4">
          <Link href="/" className="inline-block" aria-label="Avender Line Home">
            <Image
              src="/brand/logo.png"
              alt="Avender Line"
              width={160}
              height={26}
              className="h-6 w-auto object-contain"
            />
          </Link>
          <p className="text-xs text-[#6a6a6a] leading-relaxed">
            A luxury Qatari maison crafting contemporary couture abayas. Defined by fluid drapes, pristine royal silks, and timeless modest elegance tailored in our Doha atelier.
          </p>
          <div className="flex items-center gap-2.5 pt-1 text-[#1c1b1b]">
            <a
              href="https://instagram.com/avender_line"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#e9e9e9] hover:border-[#1c1b1b] transition-colors text-xs text-[#555555] hover:text-[#1c1b1b]"
              aria-label="Instagram @avender_line"
            >
              <InstagramIcon className="w-3.5 h-3.5" />
              <span className="font-mono text-[11px] font-medium">@avender_line</span>
            </a>
            <a
              href="https://wa.me/97455551234"
              target="_blank"
              rel="noreferrer"
              className="p-1.5 rounded-full border border-[#e9e9e9] hover:border-[#1c1b1b] transition-colors text-[#555555] hover:text-[#1c1b1b]"
              aria-label="WhatsApp Concierge"
            >
              <WhatsAppIcon className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Col 2: Explore Collections */}
        <div className="space-y-4">
          <h4 className="font-display text-xs uppercase tracking-[0.2em] font-semibold text-[#1c1b1b]">
            Explore
          </h4>
          <ul className="space-y-2.5 text-xs text-[#6a6a6a]">
            {exploreLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:text-[#1c1b1b] transition-colors">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Col 3: Client Care */}
        <div className="space-y-4">
          <h4 className="font-display text-xs uppercase tracking-[0.2em] font-semibold text-[#1c1b1b]">
            Client Care
          </h4>
          <ul className="space-y-2.5 text-xs text-[#6a6a6a]">
            {clientCareLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:text-[#1c1b1b] transition-colors">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Col 4: Newsletter */}
        <div className="space-y-4">
          <h4 className="font-display text-xs uppercase tracking-[0.2em] font-semibold text-[#1c1b1b]">
            Newsletter
          </h4>
          <p className="text-xs text-[#6a6a6a] leading-relaxed">
            Subscribe to receive updates, access to exclusive private collections, and salon invitations.
          </p>
          <form
            onSubmit={handleNewsletterSubmit}
            className="flex items-center border-b border-[#1c1b1b] pb-2 pt-1 transition-colors focus-within:border-[#8b7355]"
          >
            <input
              type="email"
              required
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              placeholder="Enter your email address"
              className="w-full bg-transparent text-xs text-[#1c1b1b] outline-none placeholder:text-[#a0a0a0]"
              disabled={isSubmitting}
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="text-xs font-semibold uppercase tracking-widest text-[#1c1b1b] hover:text-[#8b7355] transition-colors shrink-0 ps-3 disabled:opacity-50"
            >
              {isSubmitting ? "Joining..." : "Join"}
            </button>
          </form>

          {/* Feedback messages */}
          {newsletterStatus === "success" && (
            <div className="rounded border border-emerald-200 bg-emerald-50/60 p-2 text-[11px] text-emerald-800 leading-snug">
              âœ“ {statusMessage}
            </div>
          )}
          {newsletterStatus === "error" && (
            <div className="rounded border border-red-200 bg-red-50/60 p-2 text-[11px] text-red-700 leading-snug">
              âš ï¸ {statusMessage}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Legal & Payment Bar */}
      <div className="border-t border-[#e9e9e9] py-6 px-6 text-[11px] text-[#888888]">
        <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span>Qatar (QAR)</span>
            <span>Â·</span>
            <span>Â© {new Date().getFullYear()} AVENDERLINE. All rights reserved.</span>
          </div>

          {/* Official Payment Brand Icons */}
          <div className="flex items-center gap-2">
            <ApplePayIcon className="h-6 w-auto hover:opacity-90 transition-opacity" />
            <VisaIcon className="h-6 w-auto hover:opacity-90 transition-opacity" />
            <MastercardIcon className="h-6 w-auto hover:opacity-90 transition-opacity" />
            <MadaIcon className="h-6 w-auto hover:opacity-90 transition-opacity" />
          </div>
        </div>
      </div>
    </footer>
  );
}

