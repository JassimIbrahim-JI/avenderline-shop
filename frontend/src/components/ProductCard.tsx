"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/lib/api";
import { useCart } from "@/context/CartContext";
import { shimmerBlurDataUrl } from "@/components/ShimmerImage";

export default function ProductCard({
  product,
}: {
  product: Product;
}) {
  const [hovered, setHovered] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string>("54");
  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const [primaryLoaded, setPrimaryLoaded] = useState(false);
  const [secondaryLoaded, setSecondaryLoaded] = useState(false);
  const { addItem } = useCart();

  const name = product.name;
  const primaryImage = product.images[0] ?? "https://placehold.co/600x900";
  const secondaryImage = product.images[1] ?? primaryImage;
  const sizes = product.sizes && product.sizes.length > 0 ? product.sizes : ["52", "54", "56", "58"];

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, selectedSize, 1);
    setQuickAddOpen(false);
  };

  return (
    <div
      className="group relative flex flex-col"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
        setQuickAddOpen(false);
      }}
    >
      {/* Image Frame with Shimmer Skeleton */}
      <Link
        href={`/products/${product.slug}`}
        className="relative aspect-[3/4] w-full overflow-hidden bg-[#f4f2ee] transition-all duration-500"
      >
        {/* Shimmer Skeleton placeholder while downloading image */}
        {!primaryLoaded && (
          <div
            className="absolute inset-0 z-0 bg-gradient-to-r from-[#f5f2ec] via-[#ebe5da] to-[#f5f2ec] bg-[length:200%_100%] animate-shimmer pointer-events-none"
            aria-hidden="true"
          />
        )}

        {/* Primary Image with smooth fade-in */}
        <Image
          src={primaryImage}
          alt={name}
          fill
          placeholder="blur"
          blurDataURL={shimmerBlurDataUrl(600, 800)}
          onLoad={() => setPrimaryLoaded(true)}
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className={`object-cover transition-all duration-700 ease-out ${
            !primaryLoaded
              ? "opacity-0 scale-95"
              : hovered && secondaryImage !== primaryImage
              ? "opacity-0 scale-105"
              : "opacity-100 group-hover:scale-105"
          }`}
        />

        {/* Secondary Hover Image Flip */}
        {secondaryImage !== primaryImage && (
          <Image
            src={secondaryImage}
            alt={`${name} - Detail`}
            fill
            placeholder="blur"
            blurDataURL={shimmerBlurDataUrl(600, 800)}
            onLoad={() => setSecondaryLoaded(true)}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className={`object-cover transition-all duration-700 ease-out ${
              hovered && secondaryLoaded ? "opacity-100 scale-100" : "opacity-0 scale-105"
            }`}
          />
        )}

        {/* Luxury Couture Tag */}
        {product.tag ? (
          <span className="absolute top-2.5 start-2.5 bg-white/95 text-[#1c1b1b] px-2 py-0.5 text-[9px] font-mono tracking-widest uppercase border border-black/10">
            {product.tag}
          </span>
        ) : product.compareAtPrice ? (
          <span className="absolute top-2.5 start-2.5 bg-[#1c1b1b] text-white px-2 py-0.5 text-[9px] font-mono tracking-widest uppercase">
            Sale
          </span>
        ) : null}

        {/* Floating Quick Action Overlay on Desktop */}
        <div className="absolute inset-x-3 bottom-3 hidden sm:flex flex-col gap-2 transition-all duration-300 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0">
          {!quickAddOpen ? (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setQuickAddOpen(true);
              }}
              className="w-full bg-[#1c1b1b]/90 backdrop-blur-md py-2.5 text-xs font-semibold uppercase tracking-wider text-white hover:bg-[#1c1b1b] transition shadow-md"
            >
              + Quick Add
            </button>
          ) : (
            <div
              onClick={(e) => e.stopPropagation()}
              className="bg-white/95 backdrop-blur-md p-3 shadow-xl border border-[#e9e9e9]"
            >
              <p className="text-[10px] uppercase tracking-wider text-[#6a6a6a] mb-2 font-medium text-center">
                Select Qatari Length:
              </p>
              <div className="flex justify-center gap-1.5 mb-2.5">
                {sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    className={`h-7 w-7 text-xs font-medium transition ${
                      selectedSize === s
                        ? "bg-[#1c1b1b] text-white"
                        : "bg-white text-[#1c1b1b] border border-[#e9e9e9] hover:border-[#1c1b1b]"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
              <button
                onClick={handleQuickAdd}
                className="w-full bg-[#1c1b1b] py-2 text-xs font-semibold uppercase tracking-wider text-white hover:bg-[#8b7355] transition-colors"
              >
                Add to Bag Â· {selectedSize}
              </button>
            </div>
          )}
        </div>
      </Link>

      {/* Product Metadata */}
      <div className="mt-3 flex flex-col items-center text-center">
        <Link
          href={`/products/${product.slug}`}
          className="hover:text-[#8b7355] transition-colors"
        >
          <h3 className="font-display text-xs sm:text-sm font-medium text-[#1c1b1b] tracking-wide line-clamp-1">
            {name}
          </h3>
        </Link>

        {product.fabric && (
          <p className="mt-0.5 text-[11px] text-[#6a6a6a] line-clamp-1 font-light">
            {product.fabric}
          </p>
        )}

        <div className="mt-1.5 flex items-center justify-center gap-2 text-xs">
          <span className="font-normal text-[#1c1b1b]">
            {product.price} {product.currency}
          </span>
          {product.compareAtPrice && (
            <span className="text-[11px] text-[#a0a0a0] line-through">
              {product.compareAtPrice} {product.currency}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

