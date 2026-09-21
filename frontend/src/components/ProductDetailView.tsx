"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import type { Product } from "@/lib/api";
import { useCart } from "@/context/CartContext";
import ProductCard from "@/components/ProductCard";
import { shimmerBlurDataUrl } from "@/components/ShimmerImage";

interface ProductDetailViewProps {
  product: Product;
  relatedProducts: Product[];
}

export default function ProductDetailView({
  product,
  relatedProducts,
}: ProductDetailViewProps) {
  const router = useRouter();
  const { addItem } = useCart();

  const images = product.images.length > 0 ? product.images : ["https://placehold.co/800x1200"];
  const [selectedImage, setSelectedImage] = useState(images[0]);
  const [mainLoaded, setMainLoaded] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string>("54");
  const [closure, setClosure] = useState<string>("Concealed Snaps");
  const [customNotes, setCustomNotes] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"details" | "care" | "shipping">("details");

  const displayName = product.name;
  const description = product.description || product.description;

  const sizes = product.sizes && product.sizes.length > 0
    ? product.sizes
    : ["50", "52", "54", "56", "58", "60"];

  const handleAddToCart = () => {
    addItem(product, selectedSize, quantity, {
      closure,
      customNotes: customNotes.trim() ? customNotes : undefined,
    });
  };

  const handleBuyNow = () => {
    addItem(product, selectedSize, quantity, {
      closure,
      customNotes: customNotes.trim() ? customNotes : undefined,
    });
    router.push("/checkout");
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-10 sm:py-16">
      {/* Breadcrumb Navigation */}
      <nav className="mb-8 flex items-center gap-2 text-xs text-[#888888] uppercase tracking-wider font-mono">
        <Link href="/" className="hover:text-[#1c1b1b] transition-colors">
          Home
        </Link>
        <span>/</span>
        <Link href="/collections/women" className="hover:text-[#1c1b1b] transition-colors">
          {product.categoryName ?? "Collections"}
        </Link>
        <span>/</span>
        <span className="text-[#1c1b1b] font-semibold">{displayName}</span>
      </nav>

      {/* Main Grid: Gallery & Product Info */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
        {/* Left Column: Gallery (7 Cols on desktop) */}
        <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-4">
          {/* Thumbnail Rail */}
          {images.length > 1 && (
            <div className="flex md:flex-col gap-3 overflow-x-auto pb-2 md:pb-0 scrollbar-none flex-shrink-0">
              {images.map((imgUrl, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    if (selectedImage !== imgUrl) {
                      setMainLoaded(false);
                      setSelectedImage(imgUrl);
                    }
                  }}
                  className={`relative aspect-[3/4] w-16 sm:w-20 overflow-hidden border transition-all ${
                    selectedImage === imgUrl
                      ? "border-[#1c1b1b] scale-105"
                      : "border-[#e9e9e9] opacity-70 hover:opacity-100"
                  }`}
                >
                  <Image
                    src={imgUrl}
                    alt={`${displayName} thumbnail ${idx + 1}`}
                    fill
                    placeholder="blur"
                    blurDataURL={shimmerBlurDataUrl(80, 120)}
                    sizes="80px"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}

          {/* Main Large Image Display with Shimmer Skeleton */}
          <div className="relative aspect-[3/4] w-full flex-1 overflow-hidden bg-[#faf8f5] border border-[#e9e9e9] shadow-xs">
            {!mainLoaded && (
              <div
                className="absolute inset-0 z-0 bg-gradient-to-r from-[#f5f2ec] via-[#ebe5da] to-[#f5f2ec] bg-[length:200%_100%] animate-shimmer pointer-events-none"
                aria-hidden="true"
              />
            )}
            <Image
              src={selectedImage}
              alt={displayName}
              fill
              priority
              placeholder="blur"
              blurDataURL={shimmerBlurDataUrl(800, 1200)}
              onLoad={() => setMainLoaded(true)}
              sizes="(max-width: 1024px) 100vw, 55vw"
              className={`object-cover object-center transition-all duration-700 ease-out ${
                mainLoaded ? "opacity-100 scale-100 blur-0" : "opacity-0 scale-[0.98] blur-xs"
              }`}
            />
            {product.tag && (
              <span className="absolute top-4 start-4 bg-white/95 border border-black/10 px-3.5 py-1 text-[10px] font-mono tracking-widest uppercase text-[#1c1b1b] shadow-xs">
                {product.tag}
              </span>
            )}
          </div>
        </div>

        {/* Right Column: Details & Bespoke Controls (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Header */}
          <div>
            <span className="text-[10px] font-mono tracking-[0.25em] text-[#8b7355] uppercase block font-semibold mb-1">
              {product.sku} Â· {product.categoryName ?? "ATELIER DOHA"}
            </span>
            <h1 className="font-display text-2xl sm:text-3xl font-semibold uppercase tracking-wider text-[#1c1b1b] leading-tight">
              {displayName}
            </h1>
          </div>

          {/* Price & Stock status */}
          <div className="flex items-baseline gap-3 border-y border-[#e9e9e9] py-4">
            <span className="text-2xl sm:text-3xl font-normal text-[#1c1b1b]">
              {product.price} {product.currency}
            </span>
            {product.compareAtPrice && (
              <span className="text-base text-[#888888] line-through">
                {product.compareAtPrice} {product.currency}
              </span>
            )}
            <span className="ms-auto inline-flex items-center gap-1.5 border border-[#e9e9e9] bg-[#faf8f5] px-3 py-1 text-[11px] font-medium text-[#8b7355] uppercase tracking-wider">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Bespoke Tailoring Ready
            </span>
          </div>

          {/* Description */}
          {description && (
            <p className="text-xs sm:text-sm text-[#6a6a6a] leading-relaxed font-light">
              {description}
            </p>
          )}

          {/* Fabric & Silhouette Highlights */}
          <div className="grid grid-cols-2 gap-3 bg-[#faf8f5] p-4 border border-[#e9e9e9] text-xs">
            <div>
              <span className="text-[#888888] block text-[10px] uppercase tracking-wider">Fabric:</span>
              <span className="font-medium text-[#1c1b1b]">{product.fabric ?? "Korean Royal Super-Black Crepe"}</span>
            </div>
            <div>
              <span className="text-[#888888] block text-[10px] uppercase tracking-wider">Cut:</span>
              <span className="font-medium text-[#1c1b1b]">{product.cut ?? "Royal Fluid Cloche"}</span>
            </div>
            <div className="col-span-2 pt-2 border-t border-[#e9e9e9] flex items-center gap-2 text-[#8b7355] text-[11px]">
              <span>âœ¨</span>
              <span>Matching complimentary sheila scarf included with creation</span>
            </div>
          </div>

          {/* Size Selection */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#1c1b1b]">
                Length: <span className="text-[#8b7355]">{selectedSize}</span>
              </label>
              <button
                type="button"
                onClick={() => setSizeGuideOpen(true)}
                className="text-xs text-[#8b7355] font-semibold underline underline-offset-4 hover:text-[#1c1b1b] transition-colors uppercase tracking-wider"
              >
                ðŸ“ Size Guide
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {sizes.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSelectedSize(s)}
                  className={`h-10 min-w-[3rem] px-3 text-xs font-semibold transition-all ${
                    selectedSize === s
                      ? "bg-[#1c1b1b] text-white"
                      : "bg-white text-[#1c1b1b] border border-[#e9e9e9] hover:border-[#1c1b1b]"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Closure Preferences */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-[#1c1b1b] block mb-2">
              Closure Style:
            </label>
            <div className="grid grid-cols-3 gap-2">
              {["Concealed Snaps", "Wrap Style", "Open Front"].map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setClosure(opt)}
                  className={`py-2.5 px-3 text-xs font-medium transition border uppercase tracking-wider ${
                    closure === opt
                      ? "bg-[#1c1b1b] border-[#1c1b1b] text-white font-semibold"
                      : "bg-white border-[#e9e9e9] text-[#6a6a6a] hover:border-[#1c1b1b]"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* Bespoke / Custom Tailoring Notes */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-[#1c1b1b] block mb-1.5">
              Bespoke Atelier Notes (Optional):
            </label>
            <input
              type="text"
              value={customNotes}
              onChange={(e) => setCustomNotes(e.target.value)}
              placeholder="e.g. Shorten length by 1 inch, customize sleeve width..."
              className="w-full border border-[#e9e9e9] bg-white px-4 py-2.5 text-xs text-[#1c1b1b] placeholder:text-[#888888] focus:outline-none focus:border-[#1c1b1b]"
            />
          </div>

          {/* Quantity & CTA Buttons */}
          <div className="space-y-3 pt-2">
            <div className="flex gap-3">
              {/* Quantity Stepper */}
              <div className="flex items-center border border-[#e9e9e9] bg-white px-3 py-1">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="h-8 w-8 text-sm font-semibold text-[#6a6a6a] hover:text-[#1c1b1b]"
                >
                  -
                </button>
                <span className="w-8 text-center text-xs font-semibold">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="h-8 w-8 text-sm font-semibold text-[#6a6a6a] hover:text-[#1c1b1b]"
                >
                  +
                </button>
              </div>

              {/* Add to Cart */}
              <button
                type="button"
                onClick={handleAddToCart}
                className="flex-1 bg-[#1c1b1b] py-3.5 text-xs font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-[#8b7355] shadow-xs"
              >
                Add to Bag
              </button>
            </div>

            {/* Buy Now Direct */}
            <button
              type="button"
              onClick={handleBuyNow}
              className="w-full border border-[#1c1b1b] bg-white py-3.5 text-xs font-semibold uppercase tracking-[0.2em] text-[#1c1b1b] transition hover:bg-[#1c1b1b] hover:text-white"
            >
              Buy It Now â†’
            </button>
          </div>

          {/* Trust Guarantees */}
          <div className="border-t border-[#e9e9e9] pt-4 space-y-2 text-[11px] text-[#6a6a6a]">
            <div className="flex items-center gap-2">
              <span>ðŸ‡¶ðŸ‡¦</span>
              <span>Complimentary express delivery across Qatar on orders above 500 QAR</span>
            </div>
            <div className="flex items-center gap-2">
              <span>âœ‚ï¸</span>
              <span>Complimentary bespoke size alterations at our Doha atelier</span>
            </div>
            <div className="flex items-center gap-2">
              <span>ðŸ”’</span>
              <span>Encrypted checkout via Tap Payments Qatar & Apple Pay</span>
            </div>
          </div>

          {/* Collapsible Tabs: Details / Care / Shipping */}
          <div className="border-t border-[#e9e9e9] pt-4">
            <div className="flex border-b border-[#e9e9e9] text-xs font-semibold uppercase tracking-wider">
              <button
                type="button"
                onClick={() => setActiveTab("details")}
                className={`py-2 px-4 transition border-b-2 ${
                  activeTab === "details"
                    ? "border-[#1c1b1b] text-[#1c1b1b]"
                    : "border-transparent text-[#888888] hover:text-[#1c1b1b]"
                }`}
              >
                Details
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("care")}
                className={`py-2 px-4 transition border-b-2 ${
                  activeTab === "care"
                    ? "border-[#1c1b1b] text-[#1c1b1b]"
                    : "border-transparent text-[#888888] hover:text-[#1c1b1b]"
                }`}
              >
                Care
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("shipping")}
                className={`py-2 px-4 transition border-b-2 ${
                  activeTab === "shipping"
                    ? "border-[#1c1b1b] text-[#1c1b1b]"
                    : "border-transparent text-[#888888] hover:text-[#1c1b1b]"
                }`}
              >
                Delivery
              </button>
            </div>

            <div className="p-4 text-xs text-[#6a6a6a] leading-relaxed bg-[#faf8f5] border-b border-[#e9e9e9]">
              {activeTab === "details" && (
                <ul className="space-y-1 list-disc list-inside">
                  <li>Color: Super Jet Black with high color retention.</li>
                  <li>Inclusions: Matching Korean laser-trimmed sheila scarf (2 meters).</li>
                  <li>Origin: Exclusively designed and hand-tailored in Doha, Qatar.</li>
                </ul>
              )}
              {activeTab === "care" && (
                <ul className="space-y-1 list-disc list-inside">
                  <li>Professional dry cleaning recommended to preserve embellishments.</li>
                  <li>Steam iron only on low-to-medium heat setting.</li>
                  <li>Avoid bleach, tumble drying, and direct prolonged sun exposure.</li>
                </ul>
              )}
              {activeTab === "shipping" && (
                <ul className="space-y-1 list-disc list-inside">
                  <li>Atelier Crafting Time: 2 to 4 business days.</li>
                  <li>Qatar Delivery: Hand-delivered within 24-48 hours via private climate-controlled courier.</li>
                  <li>GCC Delivery: 3 to 5 business days via DHL/FedEx Express.</li>
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Size Guide Modal */}
      <AnimatePresence>
        {sizeGuideOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setSizeGuideOpen(false)}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-xl bg-white p-6 shadow-2xl border border-[#e9e9e9] z-10"
            >
              <div className="flex items-center justify-between border-b border-[#e9e9e9] pb-4 mb-4">
                <div>
                  <h3 className="font-display text-lg font-semibold uppercase tracking-wider text-[#1c1b1b]">
                    Qatari Abaya Size Guide
                  </h3>
                  <p className="text-xs text-[#6a6a6a]">Standard atelier measurements in inches and cm</p>
                </div>
                <button
                  onClick={() => setSizeGuideOpen(false)}
                  className="h-8 w-8 flex items-center justify-center text-[#888888] hover:text-[#1c1b1b]"
                >
                  âœ•
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-start border-collapse">
                  <thead>
                    <tr className="bg-[#faf8f5] text-[#1c1b1b] border-b border-[#e9e9e9]">
                      <th className="p-2.5 font-semibold text-start">Size</th>
                      <th className="p-2.5 font-semibold text-start">Client Height</th>
                      <th className="p-2.5 font-semibold text-start">Garment Length</th>
                      <th className="p-2.5 font-semibold text-start">Bust Width</th>
                      <th className="p-2.5 font-semibold text-start">Sleeve Length</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e9e9e9]">
                    {[
                      { size: "50", height: "150 - 153 cm", length: '50"', bust: '21"', sleeve: '26"' },
                      { size: "52", height: "154 - 158 cm", length: '52"', bust: '22"', sleeve: '27"' },
                      { size: "54", height: "159 - 163 cm", length: '54"', bust: '23"', sleeve: '28"' },
                      { size: "56", height: "164 - 168 cm", length: '56"', bust: '24"', sleeve: '28"' },
                      { size: "58", height: "169 - 173 cm", length: '58"', bust: '25"', sleeve: '29"' },
                      { size: "60", height: "174 cm & above", length: '60"', bust: '26"', sleeve: '30"' },
                    ].map((row) => (
                      <tr key={row.size} className="hover:bg-[#faf8f5]">
                        <td className="p-2.5 font-semibold text-[#8b7355]">{row.size}</td>
                        <td className="p-2.5 text-[#1c1b1b]">{row.height}</td>
                        <td className="p-2.5 text-[#6a6a6a]">{row.length}</td>
                        <td className="p-2.5 text-[#6a6a6a]">{row.bust}</td>
                        <td className="p-2.5 text-[#6a6a6a]">{row.sleeve}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-4 border border-[#e9e9e9] bg-[#faf8f5] p-3 text-[11px] text-[#6a6a6a]">
                ðŸ’¡ <span className="font-semibold text-[#1c1b1b]">Atelier Advice:</span> If you wear heels regularly with your abaya, we recommend ordering one size longer (e.g., if you wear size 54 with flats, size 56 gives graceful pooling over heels).
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Related Products Carousel/Grid */}
      {relatedProducts.length > 0 && (
        <div className="mt-24 border-t border-[#e9e9e9] pt-16">
          <div className="text-center mb-10">
            <span className="text-[10px] font-mono tracking-[0.25em] text-[#8b7355] uppercase block font-semibold mb-1">
              COMPLETE THE LOOK
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-semibold uppercase tracking-wider text-[#1c1b1b]">
              You May Also Admire
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {relatedProducts.slice(0, 4).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

