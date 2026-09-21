"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { shimmerBlurDataUrl } from "@/components/ShimmerImage";

export interface Slide {
  id: number;
  imageUrl: string;
  tag?: string;
  title?: string;
  ctaText?: string;
  ctaLink: string;
  objectPosition?: string;
}

const defaultSlides: Slide[] = [
  {
    id: 1,
    imageUrl: "https://images.unsplash.com/photo-1762605135376-ae5af70a5628?auto=format&fit=crop&w=2400&q=90",
    tag: "HAUTE COUTURE Â· SUMMER 2026",
    title: "TIMELESS COUTURE ELEGANCE",
    ctaText: "EXPLORE THE NEW COLLECTION",
    ctaLink: "#featured",
    objectPosition: "center top",
  },
  {
    id: 2,
    imageUrl: "https://images.unsplash.com/photo-1724412665971-114bd351a42d?auto=format&fit=crop&w=2400&q=90",
    tag: "HERITAGE ROYALTY Â· MAISON BISHT",
    title: "GILDED WITH PURE GOLD KASAB",
    ctaText: "SHOP THE BISHT EDIT",
    ctaLink: "/collections/classics",
    objectPosition: "center top",
  },
  {
    id: 3,
    imageUrl: "https://images.unsplash.com/photo-1762605135326-5c4bcc5ef006?auto=format&fit=crop&w=2400&q=90",
    tag: "JAPANESE SILK Â· BESPOKE DRAPES",
    title: "FLUID SILHOUETTES CRAFTED IN DOHA",
    ctaText: "DISCOVER THE ATELIER",
    ctaLink: "/collections/women",
    objectPosition: "center top",
  },
];

const AUTOPLAY_DELAY = 6500;

export default function HeroCarousel() {
  const [slideList, setSlideList] = useState<Slide[]>(defaultSlides);
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  // Fetch dynamic slides from API
  useEffect(() => {
    fetch("/api/carousel")
      .then((res) => res.json())
      .then((data) => {
        if (data.slides && Array.isArray(data.slides) && data.slides.length > 0) {
          setSlideList(data.slides);
        }
      })
      .catch((err) => {
        console.warn("[HeroCarousel] Using default slides:", err);
      });
  }, []);

  useEffect(() => {
    if (isPaused || slideList.length <= 1) return;

    timerRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slideList.length);
    }, AUTOPLAY_DELAY);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [current, isPaused, slideList.length]);

  const goToSlide = (idx: number) => {
    setCurrent(idx);
  };

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % slideList.length);
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + slideList.length) % slideList.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;
    const diff = touchStartX.current - touchEndX.current;
    if (diff > 40) {
      nextSlide();
    } else if (diff < -40) {
      prevSlide();
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  const currentSlide = slideList[current] || slideList[0];

  const tagText = currentSlide.tag || "";
  const titleText = currentSlide.title || "";
  const ctaText = currentSlide.ctaText || "Explore Collection";

  return (
    <section
      className="relative h-[72vh] sm:h-[80vh] md:h-[86vh] lg:h-[90vh] flex items-end justify-center overflow-hidden bg-[#111111] text-white select-none touch-pan-y"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      aria-label="Editorial Hero Carousel"
    >
      {/* Visual Slide: 100% Brightness & Clarity, Full Abaya In View */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          className="absolute inset-0 z-0 overflow-hidden"
        >
          <div className="relative h-full w-full opacity-100">
            <Image
              src={currentSlide.imageUrl}
              alt="AvenderLine Haute Couture Qatari Abaya"
              fill
              priority
              placeholder="blur"
              blurDataURL={shimmerBlurDataUrl(1920, 1080)}
              sizes="100vw"
              className="object-cover"
              style={{ objectPosition: currentSlide.objectPosition || "center top" }}
            />
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Subtle Gentle Bottom Vignette (Behind Caption & Indicators Only) */}
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/65 via-black/20 to-transparent pointer-events-none z-10" />

      <div className="relative z-10 w-full px-6 pb-16 sm:pb-20 text-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="space-y-1.5"
          >
            {tagText && (
              <p className="text-[10px] sm:text-[11px] font-mono tracking-[0.25em] text-[#e8dfcf] uppercase font-semibold">
                {tagText}
              </p>
            )}
            {titleText && (
              <h2 className="font-display text-base sm:text-xl md:text-2xl font-medium text-white tracking-[0.2em] uppercase">
                {titleText}
              </h2>
            )}
            <div className="pt-1">
              <Link
                href={currentSlide.ctaLink || "#featured"}
                className="inline-block text-[10.5px] sm:text-xs uppercase tracking-[0.2em] font-semibold text-white/90 border-b border-white/60 hover:text-white hover:border-white transition-colors pb-0.5"
              >
                {ctaText} â†’
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Sleek Minimalist Slide Navigation Arrows (Hidden on Mobile Phones, visible on Desktop) */}
      <button
        onClick={prevSlide}
        aria-label="Previous Slide"
        className="hidden md:flex absolute start-4 sm:start-8 top-1/2 -translate-y-1/2 z-20 h-11 w-11 items-center justify-center rounded-full text-white/75 hover:text-white hover:bg-white/10 transition-all cursor-pointer outline-none focus:outline-none focus:ring-0 active:outline-none select-none"
      >
        <svg
          className="h-6 w-6 stroke-[1.5]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
      </button>

      <button
        onClick={nextSlide}
        aria-label="Next Slide"
        className="hidden md:flex absolute end-4 sm:end-8 top-1/2 -translate-y-1/2 z-20 h-11 w-11 items-center justify-center rounded-full text-white/75 hover:text-white hover:bg-white/10 transition-all cursor-pointer outline-none focus:outline-none focus:ring-0 active:outline-none select-none"
      >
        <svg
          className="h-6 w-6 stroke-[1.5]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
      </button>

      <div className="absolute bottom-5 sm:bottom-7 inset-x-0 z-20 flex items-center justify-center gap-2.5 sm:gap-3.5">
        {slideList.map((s, idx) => (
          <button
            key={s.id}
            onClick={() => goToSlide(idx)}
            aria-label={`Go to slide ${idx + 1}`}
            className="group relative h-[2.5px] sm:h-[3px] w-10 sm:w-14 overflow-hidden rounded-full bg-white/35 hover:bg-white/60 transition-colors p-0 cursor-pointer outline-none focus:outline-none focus:ring-0"
          >
            {idx === current ? (
              <motion.span
                key={`progress-${current}-${isPaused}`}
                initial={{ width: "0%" }}
                animate={{ width: isPaused ? undefined : "100%" }}
                transition={{
                  duration: AUTOPLAY_DELAY / 1000,
                  ease: "linear",
                }}
                className="absolute inset-y-0 start-0 bg-white"
              />
            ) : (
              <span
                className={`absolute inset-0 transition-opacity ${
                  idx < current ? "bg-white/70" : "bg-transparent"
                }`}
              />
            )}
          </button>
        ))}
      </div>
    </section>
  );
}


