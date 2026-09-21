"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import type { Category, Product } from "@/lib/api";
import ProductCard from "@/components/ProductCard";

interface CollectionFilterViewProps {
  category: Category | null;
  slug: string;
  initialProducts: Product[];
}

export default function CollectionFilterView({
  category,
  slug,
  initialProducts,
}: CollectionFilterViewProps) {
  const [selectedSize, setSelectedSize] = useState<string>("all");
  const [priceRange, setPriceRange] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("featured");

  const title = slug.replace(/-/g, " ").toUpperCase();
  const description =
    category?.description ||
    "Discover handcrafted luxury Qatari abayas and royal bishts tailored in our Doha atelier.";

  const filteredProducts = useMemo(() => {
    return initialProducts
      .filter((p) => {
        // Size filter
        if (selectedSize !== "all") {
          if (!p.sizes?.includes(selectedSize)) return false;
        }
        // Price filter
        if (priceRange === "under600" && p.price >= 600) return false;
        if (priceRange === "600to900" && (p.price < 600 || p.price > 900)) return false;
        if (priceRange === "over900" && p.price <= 900) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "price-asc") return a.price - b.price;
        if (sortBy === "price-desc") return b.price - a.price;
        if (sortBy === "newest") return b.id.localeCompare(a.id);
        return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
      });
  }, [initialProducts, selectedSize, priceRange, sortBy]);

  const resetFilters = () => {
    setSelectedSize("all");
    setPriceRange("all");
    setSortBy("featured");
  };

  const hasActiveFilters = selectedSize !== "all" || priceRange !== "all" || sortBy !== "featured";

  return (
    <div className="mx-auto max-w-7xl px-6 py-12 sm:py-16">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-2 text-xs text-[#888888] uppercase tracking-wider font-mono">
        <Link href="/" className="hover:text-[#1c1b1b] transition-colors">
          Home
        </Link>
        <span>/</span>
        <span className="text-[#1c1b1b] font-semibold">{title}</span>
      </nav>

      {/* Header Banner */}
      <div className="mb-12 text-center max-w-2xl mx-auto">
        <span className="text-[10px] font-mono tracking-[0.25em] text-[#8b7355] uppercase block font-semibold mb-2">
          COLLECTION
        </span>
        <h1 className="font-display text-3xl sm:text-4xl font-semibold uppercase tracking-wider text-[#1c1b1b]">
          {title}
        </h1>
        <p className="mt-3 text-xs sm:text-sm text-[#6a6a6a] leading-relaxed font-light">
          {description}
        </p>
      </div>

      {/* Desktop Filter & Sort Bar */}
      <div className="mb-8 border border-[#e9e9e9] bg-[#faf8f5] p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left: Quick Filters */}
        <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
          {/* Price Range */}
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-wider text-[#888888]">Price:</span>
            <select
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value)}
              className="border border-[#e9e9e9] bg-white px-3 py-1.5 text-xs text-[#1c1b1b] outline-none focus:border-[#1c1b1b]"
            >
              <option value="all">All Prices</option>
              <option value="under600">Under 600 QAR</option>
              <option value="600to900">600 - 900 QAR</option>
              <option value="over900">Over 900 QAR</option>
            </select>
          </div>

          {/* Size Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-wider text-[#888888]">Length:</span>
            <select
              value={selectedSize}
              onChange={(e) => setSelectedSize(e.target.value)}
              className="border border-[#e9e9e9] bg-white px-3 py-1.5 text-xs text-[#1c1b1b] outline-none focus:border-[#1c1b1b]"
            >
              <option value="all">All Sizes</option>
              <option value="50">50</option>
              <option value="52">52</option>
              <option value="54">54</option>
              <option value="56">56</option>
              <option value="58">58</option>
              <option value="60">60</option>
            </select>
          </div>

          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="text-xs text-[#8b7355] font-semibold underline hover:text-[#1c1b1b] transition-colors uppercase tracking-wider"
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* Right: Sort & Count */}
        <div className="flex items-center justify-between md:justify-end gap-4 w-full md:w-auto text-xs">
          <span className="text-[#888888]">
            ({filteredProducts.length} {filteredProducts.length === 1 ? "creation" : "creations"})
          </span>

          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-wider text-[#888888]">Sort By:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-[#e9e9e9] bg-white px-3 py-1.5 text-xs text-[#1c1b1b] outline-none focus:border-[#1c1b1b]"
            >
              <option value="featured">Featured Editions</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="newest">New Arrivals</option>
            </select>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="py-20 text-center border border-dashed border-[#e9e9e9] bg-[#faf8f5] p-8">
          <div className="h-16 w-16 rounded-full bg-white flex items-center justify-center text-2xl text-[#8b7355] mx-auto mb-3 shadow-xs">
            ðŸ”
          </div>
          <h3 className="font-display text-base font-semibold uppercase tracking-wider text-[#1c1b1b]">
            No creations match your selected filters
          </h3>
          <p className="mt-1.5 text-xs text-[#6a6a6a]">
            Try adjusting your length or price range to explore more styles.
          </p>
          <button
            onClick={resetFilters}
            className="mt-5 bg-[#1c1b1b] px-7 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-white hover:bg-[#8b7355] transition-colors"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {filteredProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}

