"use client";

import React, { useState } from "react";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <main className="mx-auto max-w-5xl px-6 py-16 sm:py-24">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <span className="text-[10px] font-mono tracking-[0.25em] text-[#8b7355] uppercase block font-semibold mb-2">
          CLIENT CONCIERGE & ATELIER
        </span>
        <h1 className="font-display text-3xl sm:text-5xl font-semibold uppercase tracking-wider text-[#1c1b1b]">
          Customer Care & Atelier
        </h1>
        <p className="mt-3 text-xs sm:text-sm text-[#6a6a6a] leading-relaxed font-light">
          We welcome inquiries regarding bespoke sizing, private fittings, couture appointments, and order tracking.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
        {/* Info Column (5 Cols) */}
        <div className="md:col-span-5 bg-[#1c1b1b] text-white p-8 space-y-6 shadow-xs">
          <div>
            <h3 className="font-display text-lg font-semibold uppercase tracking-wider text-white mb-2">
              AvenderLine Atelier Doha
            </h3>
            <p className="text-xs text-[#a0a0a0] leading-relaxed font-light">
              Visit our private atelier by appointment to feel our textile swatches and consult with our master cutters.
            </p>
          </div>

          <div className="space-y-4 text-xs">
            <div className="flex items-start gap-3">
              <span className="text-[#8b7355] text-base">ðŸ“</span>
              <div>
                <strong className="block text-white uppercase tracking-wider text-[11px] mb-0.5">Location:</strong>
                <span className="text-[#c0c0c0]">Doha, Qatar</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="text-[#8b7355] text-base">ðŸ’¬</span>
              <div>
                <strong className="block text-white uppercase tracking-wider text-[11px] mb-0.5">Atelier WhatsApp Concierge:</strong>
                <a
                  href="https://wa.me/97455551234"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#c5a880] hover:underline font-mono"
                >
                  +974 5555 1234
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="text-[#8b7355] text-base">ðŸ“¸</span>
              <div>
                <strong className="block text-white uppercase tracking-wider text-[11px] mb-0.5">Official Instagram:</strong>
                <a
                  href="https://instagram.com/avender_line"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#c5a880] hover:underline font-mono"
                >
                  @avender_line
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="text-[#8b7355] text-base">âœ‰ï¸</span>
              <div>
                <strong className="block text-white uppercase tracking-wider text-[11px] mb-0.5">Client Relations:</strong>
                <span className="text-[#c0c0c0] font-mono">concierge@avenderline.com</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="text-[#8b7355] text-base">â°</span>
              <div>
                <strong className="block text-white uppercase tracking-wider text-[11px] mb-0.5">Working Days:</strong>
                <span className="text-[#c0c0c0] block">Saturday â€“ Thursday</span>
                <span className="text-[#888888] block">Friday</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-neutral-800">
            <a
              href="https://wa.me/97455551234"
              target="_blank"
              rel="noreferrer"
              className="w-full flex items-center justify-center gap-2 border border-[#25D366] bg-transparent py-3 text-xs font-semibold uppercase tracking-wider text-[#25D366] hover:bg-[#25D366] hover:text-white transition-colors"
            >
              <span>Instant WhatsApp Concierge</span>
              <span>ðŸ’¬</span>
            </a>
          </div>
        </div>

        {/* Message Form (7 Cols) */}
        <div className="md:col-span-7 border border-[#e9e9e9] bg-white p-8 shadow-xs">
          <h3 className="font-display text-lg font-semibold uppercase tracking-wider text-[#1c1b1b] mb-2">
            Send an Atelier Inquiry
          </h3>
          <p className="text-xs text-[#6a6a6a] mb-6">
            Our client care team will respond within business hours in Doha.
          </p>

          {submitted ? (
            <div className="border border-emerald-200 bg-emerald-50 p-6 text-center space-y-2">
              <span className="text-3xl block">ðŸ’Œ</span>
              <h4 className="font-display text-base font-semibold uppercase tracking-wider text-emerald-900">
                Message Received
              </h4>
              <p className="text-xs text-emerald-800 leading-relaxed">
                Thank you for contacting AvenderLine Maison. Our atelier concierge will be in touch shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="uppercase tracking-wider font-semibold block mb-1.5 text-[#1c1b1b]">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Sarah"
                  className="w-full border border-[#e9e9e9] bg-[#faf8f5] p-3 text-xs text-[#1c1b1b] outline-none focus:border-[#1c1b1b]"
                />
              </div>

              <div>
                <label className="uppercase tracking-wider font-semibold block mb-1.5 text-[#1c1b1b]">
                  Phone (WhatsApp) *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+974 5555 1234"
                  className="w-full border border-[#e9e9e9] bg-[#faf8f5] p-3 text-xs text-[#1c1b1b] outline-none focus:border-[#1c1b1b]"
                />
              </div>

              <div>
                <label className="uppercase tracking-wider font-semibold block mb-1.5 text-[#1c1b1b]">
                  Inquiry Details *
                </label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Inquire about bespoke sizing, fabric availability, or bridal couture..."
                  className="w-full border border-[#e9e9e9] bg-[#faf8f5] p-3 text-xs text-[#1c1b1b] outline-none focus:border-[#1c1b1b]"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#1c1b1b] py-3.5 text-xs font-semibold uppercase tracking-[0.2em] text-white hover:bg-[#8b7355] transition-colors"
              >
                Send Inquiry
              </button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}

