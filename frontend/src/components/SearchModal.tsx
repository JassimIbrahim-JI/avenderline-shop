"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { demoProducts } from "@/lib/demo";
import { shimmerBlurDataUrl } from "@/components/ShimmerImage";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
      }
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase().trim();
    return demoProducts.filter((p) => {
      const matchText =
        p.name.toLowerCase().includes(q) ||
        p.name.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q) ||
        p.fabric?.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q);
      return matchText;
    });
  }, [query]);

  const quickSearches = [
    "Royal Bisht",
    "Korean Crepe",
    "Hand Beading",
    "Evening Couture",
    "Japanese Silk",
    "Everyday Luxury",
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
          />

          {/* Modal content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-2xl overflow-hidden bg-[#ffffff] shadow-2xl border border-[#e9e9e9] z-10"
          >
            {/* Search Input Bar */}
            <div className="relative border-b border-[#e9e9e9] p-4 sm:p-5 flex items-center gap-3">
              <svg className="w-5 h-5 text-[#8b7355] stroke-[1.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
              <input
                type="text"
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by silhouette, fabric, or style..."
                className="w-full bg-transparent text-sm sm:text-base text-[#1c1b1b] placeholder:text-[#888888] focus:outline-none"
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="p-1 text-xs text-[#888888] hover:text-[#1c1b1b]"
                >
                  âœ•
                </button>
              )}
              <button
                onClick={onClose}
                className="border border-[#e9e9e9] px-2 py-1 text-[10px] font-mono uppercase text-[#6a6a6a] hover:text-[#1c1b1b]"
              >
                ESC
              </button>
            </div>

            {/* Quick searches / Category tags */}
            <div className="flex flex-wrap items-center gap-2 border-b border-[#e9e9e9] bg-[#faf8f5] px-5 py-3">
              <span className="text-[11px] uppercase tracking-wider text-[#888888] font-medium">Popular:</span>
              {quickSearches.map((term) => (
                <button
                  key={term}
                  onClick={() => setQuery(term)}
                  className="border border-[#e9e9e9] bg-white px-3 py-1 text-[11px] uppercase tracking-wider text-[#1c1b1b] hover:border-[#1c1b1b] transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>

            {/* Results container */}
            <div className="max-h-[60vh] overflow-y-auto p-4 sm:p-6">
              {query.trim() === "" ? (
                <div className="py-12 text-center text-[#888888]">
                  <p className="font-display text-base uppercase tracking-wider text-[#1c1b1b] font-semibold">
                    Discover AvenderLine Haute Couture
                  </p>
                  <p className="mt-1.5 text-xs text-[#6a6a6a]">
                    Type a keyword above to find ready-to-wear abayas, custom bishts, and silk creations.
                  </p>
                </div>
              ) : results.length === 0 ? (
                <div className="py-12 text-center text-[#888888]">
                  <p className="text-sm font-medium text-[#1c1b1b]">No creations found for &ldquo;{query}&rdquo;</p>
                  <p className="mt-1.5 text-xs text-[#6a6a6a]">
                    Consult our AI concierge or browse our full collections catalog.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-xs uppercase tracking-wider text-[#888888] font-semibold">
                    Search Results ({results.length})
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {results.map((product) => {
                      const displayName = product.name;
                      return (
                        <Link
                          key={product.id}
                          href={`/products/${product.slug}`}
                          onClick={onClose}
                          className="group flex items-center gap-3 border border-[#e9e9e9] bg-white p-3 transition-colors hover:border-[#1c1b1b]"
                        >
                          <div className="relative aspect-[3/4] w-14 flex-shrink-0 overflow-hidden bg-[#faf8f5]">
                            <Image
                              src={product.images[0] ?? "https://placehold.co/400x600"}
                              alt={displayName}
                              fill
                              placeholder="blur"
                              blurDataURL={shimmerBlurDataUrl(56, 75)}
                              sizes="56px"
                              className="object-cover transition duration-300 group-hover:scale-105"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-xs font-semibold uppercase tracking-wide text-[#1c1b1b] line-clamp-1 group-hover:text-[#8b7355]">
                              {displayName}
                            </h4>
                            <p className="mt-0.5 text-[11px] text-[#6a6a6a] line-clamp-1 font-light">
                              {product.fabric ?? product.categoryName}
                            </p>
                            <div className="mt-1.5 flex items-center gap-2">
                              <span className="text-xs font-medium text-[#1c1b1b]">
                                {product.price} QAR
                              </span>
                              {product.tag && (
                                <span className="border border-[#e9e9e9] bg-[#faf8f5] px-1.5 py-0.5 text-[9px] uppercase tracking-wider text-[#8b7355]">
                                  {product.tag}
                                </span>
                              )}
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

