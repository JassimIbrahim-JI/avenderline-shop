"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { shimmerBlurDataUrl } from "@/components/ShimmerImage";

export default function CartDrawer() {
  const {
    items,
    isCartOpen,
    closeCart,
    removeItem,
    updateQuantity,
    subtotal,
    amountToFreeShipping,
    freeShippingThreshold,
    shippingCost,
    total,
  } = useCart();

  const progressPercent = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />

          {/* Slide-out Drawer */}
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 280 }}
            className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-[#ffffff] shadow-2xl border-s border-[#e9e9e9]"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#e9e9e9] px-6 py-5">
              <div className="flex items-center gap-2">
                <span className="font-display text-lg font-semibold uppercase tracking-wider text-[#1c1b1b]">
                  Shopping Bag
                </span>
                <span className="border border-[#e9e9e9] bg-[#faf8f5] px-2 py-0.5 text-[11px] font-semibold text-[#8b7355]">
                  {items.reduce((s, i) => s + i.quantity, 0)} {items.reduce((s, i) => s + i.quantity, 0) === 1 ? "item" : "items"}
                </span>
              </div>
              <button
                onClick={closeCart}
                aria-label="Close Bag"
                className="flex h-9 w-9 items-center justify-center text-[#6a6a6a] hover:text-[#1c1b1b] transition-colors"
              >
                <svg className="w-5 h-5 stroke-[1.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Free shipping progress bar */}
            <div className="border-b border-[#e9e9e9] bg-[#faf8f5] px-6 py-4">
              {amountToFreeShipping > 0 ? (
                <p className="text-xs text-[#6a6a6a] leading-relaxed">
                  Add <span className="font-semibold text-[#1c1b1b]">{amountToFreeShipping} QAR</span> more to qualify for{" "}
                  <span className="font-semibold text-[#1c1b1b]">Complimentary Qatar Express Delivery</span>
                </p>
              ) : (
                <p className="text-xs font-semibold text-[#1c1b1b] flex items-center gap-1.5 uppercase tracking-wide">
                  <span>âœ¨</span> You have unlocked complimentary delivery across Qatar!
                </p>
              )}
              <div className="mt-2.5 h-1 w-full overflow-hidden bg-[#e9e9e9]">
                <motion.div
                  className="h-full bg-[#1c1b1b]"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto px-6 py-4 divide-y divide-[#e9e9e9]">
              {items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center py-16">
                  <div className="h-16 w-16 rounded-full bg-[#faf8f5] flex items-center justify-center text-2xl text-[#8b7355] mb-4">
                    ðŸ›ï¸
                  </div>
                  <h4 className="font-display text-base font-semibold uppercase tracking-wider text-[#1c1b1b]">
                    Your bag is empty
                  </h4>
                  <p className="mt-2 text-xs text-[#6a6a6a] max-w-xs leading-relaxed">
                    Discover our collection of handcrafted luxury Qatari abayas and royal bishts.
                  </p>
                  <button
                    onClick={closeCart}
                    className="mt-6 bg-[#1c1b1b] px-8 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-white hover:bg-[#8b7355] transition-colors"
                  >
                    Explore Collections
                  </button>
                </div>
              ) : (
                items.map((item, idx) => {
                  const image = item.product.images[0] ?? "https://placehold.co/400x600";
                  const displayName = item.product.name;
                  return (
                    <div key={`${item.product.id}-${item.size}-${idx}`} className="flex gap-4 py-4">
                      {/* Thumbnail */}
                      <div className="relative aspect-[3/4] w-20 flex-shrink-0 overflow-hidden bg-[#faf8f5] border border-[#e9e9e9]">
                        <Image
                          src={image}
                          alt={displayName}
                          fill
                          placeholder="blur"
                          blurDataURL={shimmerBlurDataUrl(80, 120)}
                          sizes="80px"
                          className="object-cover"
                        />
                      </div>

                      {/* Details */}
                      <div className="flex flex-1 flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start">
                            <Link
                              href={`/products/${item.product.slug}`}
                              onClick={closeCart}
                              className="text-xs font-semibold text-[#1c1b1b] hover:text-[#8b7355] line-clamp-1 transition-colors uppercase tracking-wide"
                            >
                              {displayName}
                            </Link>
                            <button
                              onClick={() => removeItem(item.product.id, item.size)}
                              className="text-[#888888] hover:text-red-600 text-xs transition-colors ms-2"
                              title="Remove"
                            >
                              âœ•
                            </button>
                          </div>

                          <div className="mt-1 flex flex-wrap gap-2 text-[11px] text-[#6a6a6a]">
                            <span className="border border-[#e9e9e9] bg-[#faf8f5] px-1.5 py-0.5 uppercase tracking-wider font-medium">
                              Size: {item.size}
                            </span>
                            {item.closure && (
                              <span className="border border-[#e9e9e9] bg-white px-1.5 py-0.5 uppercase tracking-wider">
                                {item.closure}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Quantity and Price */}
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center border border-[#e9e9e9] bg-white px-2 py-0.5">
                            <button
                              onClick={() => updateQuantity(item.product.id, item.size, item.quantity - 1)}
                              className="h-5 w-5 text-xs text-[#6a6a6a] hover:text-[#1c1b1b]"
                            >
                              -
                            </button>
                            <span className="px-2 text-xs font-semibold">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.product.id, item.size, item.quantity + 1)}
                              className="h-5 w-5 text-xs text-[#6a6a6a] hover:text-[#1c1b1b]"
                            >
                              +
                            </button>
                          </div>

                          <span className="text-xs font-semibold text-[#1c1b1b]">
                            {item.product.price * item.quantity} {item.product.currency}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer / Summary */}
            {items.length > 0 && (
              <div className="border-t border-[#e9e9e9] bg-[#faf8f5] p-6 space-y-3">
                <div className="space-y-1.5 text-xs text-[#6a6a6a]">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span className="font-medium text-[#1c1b1b]">{subtotal} QAR</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping (Qatar):</span>
                    <span className="font-medium text-[#1c1b1b]">
                      {shippingCost === 0 ? "Complimentary" : `${shippingCost} QAR`}
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-[#e9e9e9] pt-2 text-sm font-semibold text-[#1c1b1b]">
                    <span>Total:</span>
                    <span className="text-[#8b7355]">{total} QAR</span>
                  </div>
                </div>

                <div className="flex flex-col gap-2 pt-2">
                  <Link
                    href="/checkout"
                    onClick={closeCart}
                    className="w-full bg-[#1c1b1b] py-3.5 text-center text-xs font-semibold uppercase tracking-[0.2em] text-white transition-colors hover:bg-[#8b7355]"
                  >
                    Proceed to Checkout
                  </Link>
                  <Link
                    href="/cart"
                    onClick={closeCart}
                    className="w-full border border-[#e9e9e9] bg-white py-2.5 text-center text-xs font-semibold uppercase tracking-wider text-[#1c1b1b] hover:bg-[#faf8f5] transition-colors"
                  >
                    View Shopping Bag
                  </Link>
                </div>

                <p className="text-[10px] text-center text-[#888888] tracking-wider uppercase">
                  ðŸ”’ Secure checkout via Tap Payments Qatar & Apple Pay
                </p>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}


