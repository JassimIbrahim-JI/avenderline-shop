"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, type Variants } from "framer-motion";
import type { Category, Product } from "@/lib/api";
import ProductCard from "@/components/ProductCard";
import HeroCarousel from "@/components/HeroCarousel";
import { shimmerBlurDataUrl } from "@/lib/shimmer";

interface HomeContentProps {
  products: Product[];
  categories: Category[];
}

const categoryFallbackImages: Record<string, string> = {
  women: "https://images.unsplash.com/photo-1760083545495-b297b1690672?auto=format&fit=crop&w=1000&q=85",
  classics: "https://images.unsplash.com/photo-1772474500365-c2c520545f44?auto=format&fit=crop&w=1000&q=85",
  occasions: "https://images.unsplash.com/photo-1724412665971-114bd351a42d?auto=format&fit=crop&w=1000&q=85",
  kids: "https://images.unsplash.com/photo-1762605135326-5c4bcc5ef006?auto=format&fit=crop&w=1000&q=85",
};

export default function HomeContent({ products, categories }: HomeContentProps) {

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <main className="overflow-hidden bg-[#ffffff]">
      {/* 1. Cinematic Editorial Hero Carousel */}
      <HeroCarousel />

      {/* 2. Curated Collections / Shop By Category (Prestige Layout) */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        variants={containerVariants}
        className="mx-auto max-w-7xl px-6 py-16 sm:py-20"
      >
        <div className="text-center mb-10 sm:mb-14">
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-semibold text-[#1c1b1b] tracking-wider uppercase">
            Maison Collections
          </h2>
          <div className="mt-2.5 h-[1px] w-12 bg-[#1c1b1b]/20 mx-auto" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {categories.map((c) => {
            const imgSrc =
              c.imageUrl ||
              categoryFallbackImages[c.slug] ||
              "https://images.unsplash.com/photo-1772474500365-c2c520545f44?auto=format&fit=crop&w=1000&q=85";

            return (
              <motion.div key={c.id} variants={itemVariants}>
                <Link
                  href={`/collections/${c.slug}`}
                  className="group relative aspect-[3/4] block overflow-hidden bg-[#f4f2ee]"
                >
                  {/* Shimmer Skeleton Placeholder */}
                  <div
                    className="absolute inset-0 z-0 bg-gradient-to-r from-[#f5f2ec] via-[#ebe5da] to-[#f5f2ec] bg-[length:200%_100%] animate-shimmer pointer-events-none"
                    aria-hidden="true"
                  />
                  <Image
                    src={imgSrc}
                    alt={c.name}
                    fill
                    placeholder="blur"
                    blurDataURL={shimmerBlurDataUrl(600, 800)}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6 text-center text-white">
                  <h3 className="font-display text-lg sm:text-xl font-medium tracking-wide uppercase">
                    {c.name}
                  </h3>
                  <span className="mt-2 inline-flex items-center gap-1 text-[11px] font-medium tracking-widest text-[#e5e5e5] uppercase group-hover:text-white transition-colors border-b border-white/40 pb-0.5">
                    <span>Shop Now</span>
                    <span>â†’</span>
                  </span>
                </div>
              </Link>
            </motion.div>
          );
        })}
        </div>
      </motion.section>

      {/* 3. Featured / Best Selling Products (4-Column Clean Fashion Grid) */}
      <motion.section
        id="featured"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        variants={containerVariants}
        className="border-t border-[#e9e9e9] bg-[#ffffff] py-16 sm:py-20"
      >
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10 sm:mb-14">
            <div className="text-center sm:text-start">
              <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[#1c1b1b] tracking-wider uppercase">
                Curated Couture Editions
              </h2>
            </div>
            <Link
              href="/collections/women"
              className="text-[11px] font-semibold uppercase tracking-widest text-[#1c1b1b] hover:text-[#8b7355] transition pb-0.5 border-b border-[#1c1b1b] hover:border-[#8b7355] inline-flex items-center gap-1.5"
            >
              <span>View All Creations ({products.length})</span>
              <span>â†’</span>
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {products.slice(0, 8).map((p) => (
              <motion.div key={p.id} variants={itemVariants}>
                <ProductCard product={p} />
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* 4. Client Services Ribbon (Clean, quiet luxury assurance like Prestige Theme) */}
      <section className="border-t border-[#e9e9e9] bg-[#faf8f5] py-12">
        <div className="mx-auto max-w-7xl px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="space-y-1">
            <h4 className="font-display text-xs sm:text-sm font-semibold text-[#1c1b1b] uppercase tracking-wider">
              Express Atelier Delivery
            </h4>
            <p className="text-[11px] text-[#6a6a6a] font-light">
              Private courier across all Qatar zones in 24-48h
            </p>
          </div>
          <div className="space-y-1">
            <h4 className="font-display text-xs sm:text-sm font-semibold text-[#1c1b1b] uppercase tracking-wider">
              Handcrafted in Doha
            </h4>
            <p className="text-[11px] text-[#6a6a6a] font-light">
              Private atelier with dedicated master couturiers
            </p>
          </div>
          <div className="space-y-1">
            <h4 className="font-display text-xs sm:text-sm font-semibold text-[#1c1b1b] uppercase tracking-wider">
              Bespoke Sizing
            </h4>
            <p className="text-[11px] text-[#6a6a6a] font-light">
              Custom alterations for length and sleeves upon request
            </p>
          </div>
          <div className="space-y-1">
            <h4 className="font-display text-xs sm:text-sm font-semibold text-[#1c1b1b] uppercase tracking-wider">
              Premier Fabrics
            </h4>
            <p className="text-[11px] text-[#6a6a6a] font-light">
              First-grade Korean super-black crepe & Japanese silk
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

