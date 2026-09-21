"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { shimmerBlurDataUrl } from "@/components/ShimmerImage";

export default function CartPage() {
  const {
    items,
    removeItem,
    updateQuantity,
    subtotal,
    freeShippingThreshold,
    amountToFreeShipping,
    shippingCost,
    total,
  } = useCart();

  const [promoCode, setPromoCode] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);
  const [promoMessage, setPromoMessage] = useState<{ text: string; isError: boolean } | null>(null);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (promoCode.trim().toUpperCase() === "DOHA10" || promoCode.trim().toUpperCase() === "AVENDER") {
      setDiscountPercent(10);
      setPromoMessage({ text: "10% Maison privilege discount applied successfully! âœ¨", isError: false });
    } else {
      setPromoMessage({ text: "Invalid or expired promo code.", isError: true });
    }
  };

  const discountAmount = Math.round((subtotal * discountPercent) / 100);
  const finalTotal = Math.max(0, total - discountAmount);

  return (
    <main className="mx-auto max-w-7xl px-6 py-12 sm:py-16">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-2 text-xs text-[#888888] uppercase tracking-wider font-mono">
        <Link href="/" className="hover:text-[#1c1b1b] transition-colors">
          Home
        </Link>
        <span>/</span>
        <span className="text-[#1c1b1b] font-semibold">Shopping Bag</span>
      </nav>

      <div className="mb-10">
        <h1 className="font-display text-2xl sm:text-3xl font-semibold uppercase tracking-wider text-[#1c1b1b]">
          Shopping Bag
        </h1>
        <p className="mt-1 text-xs text-[#6a6a6a]">
          Review your selected creations and atelier measurements before checkout.
        </p>
      </div>

      {items.length === 0 ? (
        <div className="py-20 text-center border border-dashed border-[#e9e9e9] bg-[#faf8f5] p-8 max-w-xl mx-auto">
          <div className="h-16 w-16 rounded-full bg-white flex items-center justify-center text-3xl mx-auto mb-4 text-[#8b7355] shadow-xs">
            ðŸ›ï¸
          </div>
          <h2 className="font-display text-lg font-semibold uppercase tracking-wider text-[#1c1b1b]">
            Your shopping bag is empty
          </h2>
          <p className="mt-2 text-xs text-[#6a6a6a] leading-relaxed max-w-sm mx-auto">
            Explore our curated collections of handcrafted Qatari haute couture abayas and royal bishts.
          </p>
          <Link
            href="/collections/women"
            className="mt-6 inline-block bg-[#1c1b1b] px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.2em] text-white hover:bg-[#8b7355] transition-colors"
          >
            Explore Collections
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Items Table / List (8 Cols) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Free Shipping Meter */}
            <div className="border border-[#e9e9e9] bg-[#faf8f5] p-4 text-xs">
              {amountToFreeShipping > 0 ? (
                <p className="text-[#6a6a6a]">
                  Add <span className="font-semibold text-[#1c1b1b]">{amountToFreeShipping} QAR</span> more to qualify for{" "}
                  <span className="font-semibold text-[#1c1b1b]">Complimentary Qatar Express Delivery</span> ðŸ‡¶ðŸ‡¦
                </p>
              ) : (
                <p className="font-semibold text-[#1c1b1b] uppercase tracking-wider">
                  ðŸŽ‰ Your order qualifies for complimentary express delivery across Qatar!
                </p>
              )}
              <div className="mt-2 h-1 w-full overflow-hidden bg-[#e9e9e9]">
                <div
                  className="h-full bg-[#1c1b1b]"
                  style={{
                    width: `${Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100))}%`,
                  }}
                />
              </div>
            </div>

            {/* Items Card List */}
            <div className="divide-y divide-[#e9e9e9] border border-[#e9e9e9] bg-white p-6 shadow-xs">
              {items.map((item, idx) => {
                const displayName = item.product.name;
                return (
                  <div key={`${item.product.id}-${item.size}-${idx}`} className="flex flex-col sm:flex-row gap-5 py-6 first:pt-0 last:pb-0">
                    {/* Thumbnail */}
                    <div className="relative aspect-[3/4] w-24 sm:w-28 flex-shrink-0 overflow-hidden bg-[#faf8f5] border border-[#e9e9e9]">
                      <Image
                        src={item.product.images[0] ?? "https://placehold.co/400x600"}
                        alt={displayName}
                        fill
                        placeholder="blur"
                        blurDataURL={shimmerBlurDataUrl(112, 150)}
                        sizes="112px"
                        className="object-cover"
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start">
                          <Link
                            href={`/products/${item.product.slug}`}
                            className="font-display text-sm font-semibold uppercase tracking-wider text-[#1c1b1b] hover:text-[#8b7355] transition-colors"
                          >
                            {displayName}
                          </Link>
                          <button
                            onClick={() => removeItem(item.product.id, item.size)}
                            className="text-[#888888] hover:text-red-600 text-xs transition-colors uppercase tracking-wider"
                            title="Remove item"
                          >
                            âœ• Remove
                          </button>
                        </div>

                        <div className="mt-2 flex flex-wrap gap-2 text-xs">
                          <span className="border border-[#e9e9e9] bg-[#faf8f5] px-2 py-0.5 text-[#1c1b1b] font-medium uppercase tracking-wider">
                            Length: {item.size}
                          </span>
                          {item.closure && (
                            <span className="border border-[#e9e9e9] bg-white px-2 py-0.5 text-[#6a6a6a] uppercase tracking-wider">
                              Closure: {item.closure}
                            </span>
                          )}
                          <span className="border border-[#e9e9e9] bg-[#faf8f5] px-2 py-0.5 text-[#8b7355] uppercase tracking-wider text-[11px]">
                            Complimentary Sheila Scarf Included
                          </span>
                        </div>

                        {item.customNotes && (
                          <p className="mt-2 text-[11px] text-[#6a6a6a] italic bg-[#faf8f5] p-2 border border-[#e9e9e9]">
                            Atelier Notes: {item.customNotes}
                          </p>
                        )}
                      </div>

                      {/* Quantity & Line Total */}
                      <div className="mt-4 flex items-center justify-between border-t border-[#e9e9e9] pt-3">
                        <div className="flex items-center border border-[#e9e9e9] bg-white px-3 py-1">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.size, item.quantity - 1)}
                            className="h-6 w-6 text-sm font-semibold text-[#6a6a6a] hover:text-[#1c1b1b]"
                          >
                            -
                          </button>
                          <span className="px-3 text-xs font-semibold">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.size, item.quantity + 1)}
                            className="h-6 w-6 text-sm font-semibold text-[#6a6a6a] hover:text-[#1c1b1b]"
                          >
                            +
                          </button>
                        </div>

                        <div className="text-end">
                          <span className="text-xs text-[#888888] block">
                            {item.product.price} {item.product.currency} Ã— {item.quantity}
                          </span>
                          <span className="text-sm font-semibold text-[#1c1b1b]">
                            {item.product.price * item.quantity} {item.product.currency}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Summary Column (4 Cols) */}
          <div className="lg:col-span-4 border border-[#e9e9e9] bg-[#faf8f5] p-6 space-y-5 sticky top-28">
            <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-[#1c1b1b] border-b border-[#e9e9e9] pb-3">
              Order Summary
            </h3>

            {/* Promo Code Form */}
            <form onSubmit={handleApplyPromo} className="space-y-2">
              <label className="text-xs text-[#6a6a6a] uppercase tracking-wider block font-medium">
                Promo Code or Gift Voucher
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  placeholder="DOHA10"
                  className="flex-1 border border-[#e9e9e9] bg-white px-3.5 py-2 text-xs uppercase outline-none focus:border-[#1c1b1b]"
                />
                <button
                  type="submit"
                  className="bg-[#1c1b1b] px-5 py-2 text-xs font-semibold uppercase tracking-wider text-white hover:bg-[#8b7355] transition-colors"
                >
                  Apply
                </button>
              </div>
              {promoMessage && (
                <p
                  className={`text-[11px] ${
                    promoMessage.isError ? "text-red-600" : "text-emerald-700 font-medium"
                  }`}
                >
                  {promoMessage.text}
                </p>
              )}
            </form>

            {/* Breakdown */}
            <div className="space-y-2 text-xs text-[#6a6a6a] border-t border-[#e9e9e9] pt-4">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="font-medium text-[#1c1b1b]">{subtotal} QAR</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700 font-medium">
                  <span>Maison Discount ({discountPercent}%):</span>
                  <span>-{discountAmount} QAR</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Delivery (Qatar):</span>
                <span className="font-medium text-[#1c1b1b]">
                  {shippingCost === 0 ? "Complimentary" : `${shippingCost} QAR`}
                </span>
              </div>
              <div className="flex justify-between border-t border-[#e9e9e9] pt-3 text-sm font-semibold text-[#1c1b1b]">
                <span>Total:</span>
                <span className="text-[#8b7355]">{finalTotal} QAR</span>
              </div>
            </div>

            {/* Checkout CTA */}
            <Link
              href="/checkout"
              className="block w-full bg-[#1c1b1b] py-3.5 text-center text-xs font-semibold uppercase tracking-[0.2em] text-white transition-colors hover:bg-[#8b7355]"
            >
              Proceed to Checkout
            </Link>

            <p className="text-[10px] text-center text-[#888888] tracking-wider uppercase">
              ðŸ”’ Encrypted 256-Bit SSL Checkout
            </p>
          </div>
        </div>
      )}
    </main>
  );
}

