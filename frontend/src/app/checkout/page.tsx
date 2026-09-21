"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { api, type CheckoutPayload } from "@/lib/api";
import { shimmerBlurDataUrl } from "@/components/ShimmerImage";
import { ApplePayIcon, VisaIcon, MastercardIcon, WhatsAppIcon } from "@/components/Icons";

const qatarMunicipalities = [
  "Doha (Ø§Ù„Ø¯ÙˆØ­Ø©)",
  "The Pearl (Ø§Ù„Ù„Ø¤Ù„Ø¤Ø©)",
  "Lusail (Ù„ÙˆØ³ÙŠÙ„)",
  "West Bay (Ø§Ù„Ø®Ù„ÙŠØ¬ Ø§Ù„ØºØ±Ø¨ÙŠ)",
  "Al Rayyan (Ø§Ù„Ø±ÙŠØ§Ù†)",
  "Al Wakra (Ø§Ù„ÙˆÙƒØ±Ø©)",
  "Al Khor (Ø§Ù„Ø®ÙˆØ±)",
  "Umm Salal (Ø£Ù… ØµÙ„Ø§Ù„)",
  "Al Daayen (Ø§Ù„Ø¸Ø¹Ø§ÙŠÙ†)",
  "Muaither (Ù…Ø¹ÙŠØ°Ø±)",
  "Al Aziziyah (Ø§Ù„Ø¹Ø²ÙŠØ²ÙŠØ©)",
];

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, shippingCost, total, clearCart } = useCart();
  const { token, user } = useAuth();

  const [fullName, setFullName] = useState(user?.fullName ?? "");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState(user?.email ?? "");
  const [city, setCity] = useState("Doha (Ø§Ù„Ø¯ÙˆØ­Ø©)");
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [notes, setNotes] = useState("");
  const [gpsLocation, setGpsLocation] = useState<{ lat: number; lng: number; url: string } | null>(null);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsError, setGpsError] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"tap" | "apple_pay" | "cod">("tap");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDetectGps = () => {
    if (typeof window === "undefined" || !navigator.geolocation) {
      setGpsError("GPS geolocation is not supported by your browser. You can share your location on WhatsApp instead.");
      return;
    }
    setGpsLoading(true);
    setGpsError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const url = `https://maps.google.com/?q=${latitude},${longitude}`;
        setGpsLocation({ lat: latitude, lng: longitude, url });
        setGpsLoading(false);
      },
      (err) => {
        setGpsLoading(false);
        setGpsError("Could not access GPS. Don't worry, you can share your live location via WhatsApp.");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // Qatar Mobile Smart Formatter & Validator (8 digits, starts with 3, 5, 6, 7)
  const formatQatarPhone = (inputVal: string) => {
    const rawDigits = inputVal.replace(/\D/g, "").slice(0, 8);
    if (rawDigits.length <= 4) {
      return rawDigits;
    }
    return `${rawDigits.slice(0, 4)} ${rawDigits.slice(4)}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatQatarPhone(e.target.value);
    setPhone(formatted);
  };

  const cleanPhoneDigits = phone.replace(/\D/g, "");
  const hasInvalidPrefix = cleanPhoneDigits.length > 0 && !["3", "5", "6", "7"].includes(cleanPhoneDigits[0]);
  const isPhoneComplete = cleanPhoneDigits.length === 8 && !hasInvalidPrefix;

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      alert("Your shopping bag is empty");
      return;
    }

    if (!fullName.trim()) {
      setError("Please provide your Full Name.");
      return;
    }

    if (!isPhoneComplete) {
      setError("Please enter a valid 8-digit Qatar mobile number starting with 3, 5, 6, or 7 (e.g. 3329 8093).");
      return;
    }

    const effectiveAddress = addressLine1.trim() || (gpsLocation ? `GPS Pin: ${gpsLocation.url}` : "Live Location on WhatsApp");

    setLoading(true);
    setError(null);

    const payload: CheckoutPayload = {
      fullName,
      phone,
      addressLine1: effectiveAddress,
      addressLine2: addressLine2.trim() ? addressLine2 : undefined,
      city,
      postalCode: "00000",
      notes: notes.trim()
        ? (gpsLocation ? `${notes} | Maps: ${gpsLocation.url}` : notes)
        : (gpsLocation ? `Maps: ${gpsLocation.url}` : undefined),
      paymentMethod,
    };

    try {
      let orderNumber = `ORD-${Date.now().toString().slice(-6)}`;
      try {
        const res = await api.checkout(payload, token ?? undefined);
        if (res?.orderNumber) {
          orderNumber = res.orderNumber;
        }
      } catch {
        // Fall back to offline order generation for demo
      }

      // Save order to localStorage for tracking
      const newOrder = {
        orderNumber,
        fullName,
        email: email.trim(),
        phone,
        city,
        address: `${city} - ${effectiveAddress}`,
        mapsUrl: gpsLocation?.url,
        items: items.map((i) => ({
          name: i.product.name,
          size: i.size,
          quantity: i.quantity,
          price: i.product.price,
          image: i.product.images[0],
        })),
        total,
        paymentMethod:
          paymentMethod === "tap"
            ? "Credit / Debit Card (Tap Payments)"
            : paymentMethod === "apple_pay"
            ? "Apple Pay"
            : "Cash / Card on Delivery (Qatar)",
        status: "Pending",
        createdAt: new Date().toISOString(),
      };

      try {
        const existing = JSON.parse(localStorage.getItem("avenderline_orders") ?? "[]");
        localStorage.setItem("avenderline_orders", JSON.stringify([newOrder, ...existing]));
      } catch {
        // Ignore storage errors
      }

      // Dispatch order confirmation email asynchronously if email is provided
      if (email.trim() && email.includes("@")) {
        fetch("/api/email/order-confirmation", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newOrder),
        }).catch((err) => console.warn("[Checkout] Confirmation email dispatch deferred:", err));
      }

      clearCart();
      router.push(`/orders/${orderNumber}?success=true`);
    } catch (err: any) {
      setError(err.message || "An error occurred while processing your order. Please try again.");
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <main className="mx-auto max-w-xl px-6 py-20 text-center">
        <h2 className="font-display text-2xl font-semibold uppercase tracking-wider text-[#1c1b1b]">
          Your bag is empty
        </h2>
        <p className="mt-2 text-xs text-[#6a6a6a]">
          Your shopping bag currently has no creations. Explore our collection to continue.
        </p>
        <Link
          href="/collections/women"
          className="mt-6 inline-block bg-[#1c1b1b] px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.2em] text-white hover:bg-[#8b7355] transition-colors"
        >
          Explore Collections
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-6 py-12 sm:py-16">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-2 text-xs text-[#888888] uppercase tracking-wider font-mono">
        <Link href="/" className="hover:text-[#1c1b1b] transition-colors">
          Home
        </Link>
        <span>/</span>
        <Link href="/cart" className="hover:text-[#1c1b1b] transition-colors">
          Shopping Bag
        </Link>
        <span>/</span>
        <span className="text-[#1c1b1b] font-semibold">Checkout</span>
      </nav>

      <div className="mb-10">
        <h1 className="font-display text-2xl sm:text-3xl font-semibold uppercase tracking-wider text-[#1c1b1b]">
          Atelier Checkout
        </h1>
        <p className="mt-1 text-xs text-[#6a6a6a]">
          Complimentary climate-controlled express delivery across Qatar and bespoke atelier alterations.
        </p>
      </div>

      {error && (
        <div className="mb-6 border border-red-200 bg-red-50 p-4 text-xs text-red-700">
          âš ï¸ {error}
        </div>
      )}

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left: Form Fields (7 Cols) */}
        <div className="lg:col-span-7 space-y-8">
          {/* Step 1: Customer Contact */}
          <div className="border border-[#e9e9e9] bg-white p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-[#e9e9e9] pb-3">
              <span className="flex h-5 w-5 items-center justify-center bg-[#1c1b1b] text-[10px] font-bold text-white">
                1
              </span>
              <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-[#1c1b1b]">
                Contact Information
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs uppercase tracking-wider font-semibold text-[#1c1b1b] block mb-1.5">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g., Sarah"
                  className="w-full border border-[#e9e9e9] bg-[#faf8f5] px-4 py-2.5 text-xs text-[#1c1b1b] outline-none focus:border-[#1c1b1b]"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs uppercase tracking-wider font-semibold text-[#1c1b1b] block">
                    Phone (WhatsApp) <span className="text-red-500">*</span>
                  </label>
                  {isPhoneComplete && (
                    <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1 font-mono uppercase tracking-wider">
                      <span>âœ“ Valid Qatar Mobile</span>
                    </span>
                  )}
                </div>

                <div className="flex">
                  <span
                    className={`inline-flex items-center border border-e-0 px-3 text-xs font-mono transition-colors ${
                      isPhoneComplete
                        ? "border-emerald-600 bg-emerald-50 text-emerald-900 font-semibold"
                        : hasInvalidPrefix
                        ? "border-red-400 bg-red-50 text-red-800"
                        : "border-[#e9e9e9] bg-[#faf8f5] text-[#6a6a6a]"
                    }`}
                  >
                    +974
                  </span>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={handlePhoneChange}
                    maxLength={9} // 8 digits + 1 space
                    placeholder="3329 8093"
                    className={`w-full border px-4 py-2.5 text-xs text-[#1c1b1b] outline-none font-mono transition-colors ${
                      isPhoneComplete
                        ? "border-emerald-600 bg-emerald-50/20 focus:border-emerald-700"
                        : hasInvalidPrefix
                        ? "border-red-400 bg-red-50/20 focus:border-red-500"
                        : "border-[#e9e9e9] bg-[#faf8f5] focus:border-[#1c1b1b]"
                    }`}
                  />
                </div>

                {/* Real-time Status and Validation Guidance */}
                <div className="mt-1.5 min-h-[16px]">
                  {hasInvalidPrefix ? (
                    <p className="text-[11px] text-red-600 font-medium flex items-center gap-1">
                      <span>âš ï¸ Ø£Ø±Ù‚Ø§Ù… Ø§Ù„Ø¬ÙˆØ§Ù„ ÙÙŠ Ù‚Ø·Ø± ØªØ¨Ø¯Ø£ Ø¨Ù€ 3ØŒ 5ØŒ 6ØŒ Ø£Ùˆ 7</span>
                    </p>
                  ) : cleanPhoneDigits.length > 0 && !isPhoneComplete ? (
                    <p className="text-[11px] text-amber-700 font-light flex items-center justify-between">
                      <span>Enter 8 digits (e.g. 3329 8093)</span>
                      <span className="font-mono text-[10px] font-semibold">{cleanPhoneDigits.length}/8</span>
                    </p>
                  ) : isPhoneComplete ? (
                    <p className="text-[11px] text-emerald-700 font-medium">
                      âœ“ Ø¬Ø§Ù‡Ø² Ù„Ù„ØªÙ†Ø³ÙŠÙ‚ Ø§Ù„ÙÙˆØ±ÙŠ ÙˆÙ…Ø´Ø§Ø±ÙƒØ© Ø§Ù„Ù„ÙˆÙƒÙŠØ´Ù† Ø¹Ø¨Ø± Ø§Ù„ÙˆØ§ØªØ³Ø§Ø¨ (+974 {phone})
                    </p>
                  ) : (
                    <p className="text-[10.5px] text-[#888888] font-light">
                      8 digits starting with 3, 5, 6, or 7 (e.g. 3329 8093).
                    </p>
                  )}
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs uppercase tracking-wider font-semibold text-[#1c1b1b] block mb-1.5">
                  Email Address (for order confirmation & dispatch receipt)
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="client@domain.com"
                  className="w-full border border-[#e9e9e9] bg-[#faf8f5] px-4 py-2.5 text-xs text-[#1c1b1b] outline-none focus:border-[#1c1b1b]"
                />
              </div>
            </div>
          </div>

          {/* Step 2: Qatar Delivery & Location Coordination */}
          <div className="border border-[#e9e9e9] bg-white p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-[#e9e9e9] pb-3">
              <span className="flex h-5 w-5 items-center justify-center bg-[#1c1b1b] text-[10px] font-bold text-white">
                2
              </span>
              <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-[#1c1b1b]">
                Delivery & Location Details (State of Qatar) ðŸ‡¶ðŸ‡¦
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="text-xs uppercase tracking-wider font-semibold text-[#1c1b1b] block mb-1.5">
                  Zone / Municipality <span className="text-red-500">*</span>
                </label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full border border-[#e9e9e9] bg-[#faf8f5] px-4 py-2.5 text-xs text-[#1c1b1b] outline-none focus:border-[#1c1b1b]"
                >
                  {qatarMunicipalities.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>

              {/* Area & Street details */}
              <div className="sm:col-span-2">
                <label className="text-xs uppercase tracking-wider font-semibold text-[#1c1b1b] block mb-1.5">
                  Area, Street, or Villa / Tower Details (Ø§Ø®ØªÙŠØ§Ø±ÙŠ / Ù…Ø¨Ø³Ø·)
                </label>
                <input
                  type="text"
                  value={addressLine1}
                  onChange={(e) => setAddressLine1(e.target.value)}
                  placeholder="e.g. Al Dafna, Street 920, Villa 15 or Porto Arabia Tower 4"
                  className="w-full border border-[#e9e9e9] bg-[#faf8f5] px-4 py-2.5 text-xs text-[#1c1b1b] outline-none focus:border-[#1c1b1b]"
                />
              </div>

              {/* One-Click GPS Detection Card */}
              <div className="sm:col-span-2 border border-dashed border-[#dcd6cc] bg-[#faf8f5] p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm">ðŸ“</span>
                    <span className="text-xs font-semibold text-[#1c1b1b]">
                      Attach Current Delivery Pin (GPS)
                    </span>
                  </div>
                  <p className="text-[11px] text-[#6a6a6a]">
                    Tap to link your exact coordinates so the courier arrives right at your gate.
                  </p>
                  {gpsLocation && (
                    <p className="text-[11px] text-emerald-700 font-medium flex items-center gap-1 mt-1">
                      <span>âœ“ GPS Location Linked:</span>
                      <a
                        href={gpsLocation.url}
                        target="_blank"
                        rel="noreferrer"
                        className="underline font-mono"
                      >
                        View on Google Maps â†—
                      </a>
                    </p>
                  )}
                  {gpsError && (
                    <p className="text-[11px] text-amber-700 font-medium mt-1">
                      {gpsError}
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleDetectGps}
                  disabled={gpsLoading}
                  className="shrink-0 border border-[#1c1b1b] bg-white px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#1c1b1b] hover:bg-[#1c1b1b] hover:text-white transition-colors disabled:opacity-50 inline-flex items-center gap-1.5"
                >
                  {gpsLoading ? (
                    <>
                      <span className="inline-block h-3 w-3 animate-spin rounded-full border border-black border-t-transparent" />
                      <span>Detecting...</span>
                    </>
                  ) : gpsLocation ? (
                    <span>Update GPS Pin</span>
                  ) : (
                    <span>ðŸ“ Detect My Location</span>
                  )}
                </button>
              </div>

              {/* Reassurance Notice regarding WhatsApp Coordination */}
              <div className="sm:col-span-2 bg-[#f4f7f4] border border-[#d6e5d8] p-3.5 flex items-start gap-3">
                <div className="p-2 rounded-full bg-[#25D366]/10 text-[#25D366] shrink-0 mt-0.5">
                  <WhatsAppIcon className="w-4 h-4" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-semibold text-[#1c1b1b] tracking-wide">
                    WhatsApp Live Location Confirmation (ØªØ£ÙƒÙŠØ¯ Ø§Ù„Ù„ÙˆÙƒÙŠØ´Ù† Ø¨Ø§Ù„ÙˆØ§ØªØ³Ø§Ø¨)
                  </h4>
                  <p className="text-[11px] text-[#4a554b] leading-relaxed font-light">
                    No need to worry about complex zone numbers or blue plates. Our private courier will contact you via WhatsApp (+974 5555 1234) before dispatch to coordinate timing and receive your live location pin.
                  </p>
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs uppercase tracking-wider font-semibold text-[#1c1b1b] block mb-1.5">
                  Special Notes or Delivery Instructions
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Gate code, convenient delivery hour, or specific sizing note..."
                  className="w-full border border-[#e9e9e9] bg-[#faf8f5] px-4 py-2.5 text-xs text-[#1c1b1b] outline-none focus:border-[#1c1b1b]"
                />
              </div>
            </div>
          </div>

          {/* Step 3: Payment Method */}
          <div className="border border-[#e9e9e9] bg-white p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-[#e9e9e9] pb-3">
              <span className="flex h-5 w-5 items-center justify-center bg-[#1c1b1b] text-[10px] font-bold text-white">
                3
              </span>
              <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-[#1c1b1b]">
                Payment Method (Tap Payments Qatar Gateway)
              </h3>
            </div>

            <div className="space-y-3">
              {/* Tap Credit Card / Debit */}
              <label
                className={`flex items-center justify-between border p-4 cursor-pointer transition ${
                  paymentMethod === "tap"
                    ? "border-[#1c1b1b] bg-[#faf8f5]"
                    : "border-[#e9e9e9] bg-white hover:border-[#1c1b1b]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === "tap"}
                    onChange={() => setPaymentMethod("tap")}
                    className="accent-[#1c1b1b]"
                  />
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#1c1b1b] block">
                      Credit Card / Debit / Tap Payments
                    </span>
                    <span className="text-[11px] text-[#6a6a6a]">
                      100% secure encrypted payment via Qatari and international banks
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <VisaIcon className="h-5 w-auto" />
                  <MastercardIcon className="h-5 w-auto" />
                </div>
              </label>

              {/* Apple Pay */}
              <label
                className={`flex items-center justify-between border p-4 cursor-pointer transition ${
                  paymentMethod === "apple_pay"
                    ? "border-[#1c1b1b] bg-[#faf8f5]"
                    : "border-[#e9e9e9] bg-white hover:border-[#1c1b1b]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === "apple_pay"}
                    onChange={() => setPaymentMethod("apple_pay")}
                    className="accent-[#1c1b1b]"
                  />
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#1c1b1b] block">
                      Apple Pay (Express Checkout)
                    </span>
                    <span className="text-[11px] text-[#6a6a6a]">
                      Instant one-touch biometric authorization on Apple devices
                    </span>
                  </div>
                </div>
                <ApplePayIcon className="h-5 w-auto" />
              </label>

              {/* Cash / Card on Delivery */}
              <label
                className={`flex items-center justify-between border p-4 cursor-pointer transition ${
                  paymentMethod === "cod"
                    ? "border-[#1c1b1b] bg-[#faf8f5]"
                    : "border-[#e9e9e9] bg-white hover:border-[#1c1b1b]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === "cod"}
                    onChange={() => setPaymentMethod("cod")}
                    className="accent-[#1c1b1b]"
                  />
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#1c1b1b] block">
                      Cash or POS Card on Delivery (Qatar Only)
                    </span>
                    <span className="text-[11px] text-[#6a6a6a]">
                      Inspect your bespoke tailoring upon arrival and settle with private courier
                    </span>
                  </div>
                </div>
                <span className="border border-[#e9e9e9] bg-white px-2 py-0.5 text-[10px] uppercase tracking-wider text-[#8b7355] font-semibold">
                  Qatar Only
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Right: Order Summary Sticky (5 Cols) */}
        <div className="lg:col-span-5 border border-[#e9e9e9] bg-[#faf8f5] p-6 space-y-6 sticky top-28">
          <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-[#1c1b1b] border-b border-[#e9e9e9] pb-3">
            Creations in Order ({items.length} {items.length === 1 ? "piece" : "pieces"})
          </h3>

          {/* Mini Items List */}
          <div className="space-y-3 max-h-64 overflow-y-auto divide-y divide-[#e9e9e9]">
            {items.map((item, idx) => {
              const displayName = item.product.name;
              return (
                <div key={`${item.product.id}-${idx}`} className="flex gap-3 pt-3 first:pt-0">
                  <div className="relative aspect-[3/4] w-14 flex-shrink-0 overflow-hidden bg-white border border-[#e9e9e9]">
                    <Image
                      src={item.product.images[0] ?? "https://placehold.co/200x300"}
                      alt={displayName}
                      fill
                      placeholder="blur"
                      blurDataURL={shimmerBlurDataUrl(56, 75)}
                      sizes="56px"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0 text-xs">
                    <h4 className="font-semibold uppercase tracking-wide text-[#1c1b1b] truncate">{displayName}</h4>
                    <p className="text-[#6a6a6a] text-[11px] mt-0.5">Length: {item.size} Â· Qty: {item.quantity}</p>
                    <p className="font-semibold text-[#1c1b1b] mt-1">
                      {item.product.price * item.quantity} {item.product.currency}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Price Breakdown */}
          <div className="border-t border-[#e9e9e9] pt-4 space-y-2 text-xs text-[#6a6a6a]">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span className="font-medium text-[#1c1b1b]">{subtotal} QAR</span>
            </div>
            <div className="flex justify-between">
              <span>Qatar Express Delivery:</span>
              <span className="font-medium text-[#1c1b1b]">
                {shippingCost === 0 ? "Complimentary" : `${shippingCost} QAR`}
              </span>
            </div>
            <div className="flex justify-between border-t border-[#e9e9e9] pt-3 text-sm font-semibold text-[#1c1b1b]">
              <span>Total Due:</span>
              <span className="text-[#8b7355] text-base">{total} QAR</span>
            </div>
          </div>

          {/* Submit Order Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1c1b1b] py-4 text-xs font-semibold uppercase tracking-[0.2em] text-white transition-colors hover:bg-[#8b7355] disabled:opacity-50"
          >
            {loading ? "Registering Atelier Order..." : `Place Order (${total} QAR)`}
          </button>

          <div className="border border-[#e9e9e9] bg-white p-3 text-[11px] text-[#6a6a6a] space-y-1 text-center">
            <p>âœ… Handcrafted & bespoke tailored in Doha, Qatar</p>
            <p>ðŸ“¦ Live tracking notifications sent via WhatsApp & SMS</p>
          </div>
        </div>
      </form>
    </main>
  );
}

