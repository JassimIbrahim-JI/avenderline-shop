"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import SearchModal from "@/components/SearchModal";
import CartDrawer from "@/components/CartDrawer";
import {
  SearchIcon,
  UserIcon,
  BagIcon,
  MenuIcon,
  CloseIcon,
  SparklesIcon,
} from "@/components/Icons";

const announcements = [
  "Complimentary express delivery across Qatar on orders over 500 QAR",
  "Complimentary bespoke tailoring and alterations at our Doha atelier",
  "Chat with our AI concierge in English or Arabic for personal size advice",
];

const links = [
  { href: "/collections/women", label: "ALL ABAYAS" },
  { href: "/collections/classics", label: "BLACK ABAYAS" },
  { href: "/collections/occasions", label: "HAUTE COUTURE" },
  { href: "/concierge", label: "AI CONCIERGE" },
];

export default function Navbar() {
  const [announcementIdx, setAnnouncementIdx] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const pathname = usePathname();
  const { openCart, itemsCount } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    const timer = setInterval(() => {
      setAnnouncementIdx((prev) => (prev + 1) % announcements.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock background scrolling when mobile drawer is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      <header className="sticky top-0 z-40 w-full transition-all duration-300">
        {/* Luxury Top Announcement Bar (Prestige Theme Style) */}
        <div className="bg-[#1c1b1b] text-[#f5f5f5] py-2 px-4 sm:px-6 text-xs tracking-wider border-b border-black/10">
          <div className="mx-auto max-w-7xl flex items-center justify-between">
            <span className="hidden md:inline-block text-[10px] text-[#b39265] tracking-[0.25em] uppercase font-mono">
              Doha Â· Qatar
            </span>

            <AnimatePresence mode="wait">
              <motion.p
                key={announcementIdx}
                initial={{ opacity: 0, y: 3 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -3 }}
                transition={{ duration: 0.25 }}
                className="font-normal text-[10.5px] sm:text-xs flex-1 text-center tracking-wide truncate px-2"
              >
                {announcements[announcementIdx]}
              </motion.p>
            </AnimatePresence>

            <div className="hidden md:flex items-center gap-3 text-[11px] tracking-wider text-[#a0a0a0]">
              <span className="text-[#b39265] font-medium">QAR</span>
              <span>Â·</span>
              <Link
                href="/contact"
                className="hover:text-white uppercase font-mono tracking-widest text-[10px] transition-colors"
              >
                Customer Care
              </Link>
            </div>
          </div>
        </div>

        {/* Main Navbar (Prestige Style: 64px on mobile, 80px on desktop) */}
        <nav
          className={`border-b transition-all duration-300 ${
            scrolled
              ? "bg-[#ffffff]/95 backdrop-blur-md shadow-xs border-[#e9e9e9]"
              : "bg-[#ffffff] border-[#e9e9e9]"
          }`}
        >
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 h-16 sm:h-20">
            {/* Left Item: Mobile Hamburger & Search */}
            <div className="flex items-center gap-2.5 sm:gap-3.5 md:hidden">
              <button
                onClick={() => setMobileOpen(true)}
                className="text-[#1c1b1b] p-1.5 focus:outline-none hover:opacity-75 transition-opacity"
                aria-label="Open Navigation"
              >
                <MenuIcon className="w-5 h-5 text-[#1c1b1b]" />
              </button>

              <button
                onClick={() => setSearchOpen(true)}
                className="text-[#1c1b1b] p-1.5 hover:text-[#8b7355] transition-colors"
                aria-label="Search"
              >
                <SearchIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Desktop Navigation Links (Left on desktop) */}
            <div className="hidden md:flex items-center gap-8 lg:gap-10">
              {links.map((l) => {
                const isActive = pathname === l.href;
                const isConcierge = l.href === "/concierge";
                return (
                  <Link
                    key={l.href}
                    href={l.href}
                    className={`relative text-[12px] uppercase font-medium tracking-[0.14em] transition-colors duration-200 py-1 inline-flex items-center gap-1.5 ${
                      isActive
                        ? "text-[#1c1b1b] font-semibold"
                        : "text-[#4a4a4a] hover:text-[#1c1b1b]"
                    }`}
                  >
                    {isConcierge && <SparklesIcon className="w-3.5 h-3.5 text-[#b39265]" />}
                    <span>{l.label}</span>
                    {isActive && (
                      <motion.span
                        layoutId="nav-underline"
                        className="absolute inset-x-0 bottom-0 h-[1.5px] bg-[#1c1b1b]"
                      />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Brand Logo / Wordmark */}
            <div className="text-center flex items-center justify-center">
              <Link href="/" className="inline-flex items-center justify-center group py-1" aria-label="Avender Line Home">
                <Image
                  src="/brand/logo.png"
                  alt="Avender Line"
                  width={220}
                  height={34}
                  priority
                  className="h-6 sm:h-7 md:h-8 w-auto object-contain transition-opacity duration-300 group-hover:opacity-75"
                />
              </Link>
            </div>

            {/* Right Action Icons (Vector SVGs) */}
            <div className="flex items-center gap-2.5 sm:gap-4">
              {/* Desktop Search */}
              <button
                onClick={() => setSearchOpen(true)}
                className="hidden md:block text-[#1c1b1b] hover:text-[#8b7355] transition-colors p-1"
                aria-label="Search"
              >
                <SearchIcon className="w-5 h-5" />
              </button>

              {/* User Account */}
              <Link
                href={user ? "/account" : "/auth/login"}
                className="text-[#1c1b1b] hover:text-[#8b7355] transition-colors p-1.5"
                aria-label="Account"
                title={user?.email}
              >
                <UserIcon className="w-5 h-5" />
              </Link>

              {/* Cart Bag Icon with Counter */}
              <button
                onClick={openCart}
                aria-label="Shopping Bag"
                className="relative text-[#1c1b1b] hover:text-[#8b7355] transition-colors p-1.5"
              >
                <BagIcon className="w-5 h-5" />
                {itemsCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#1c1b1b] text-[9px] font-bold text-white">
                    {itemsCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* Prestige-Style Mobile Sliding Drawer (Slides from Left with Backdrop) */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs md:hidden"
              aria-hidden="true"
            />

            {/* Left Sliding Drawer */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="fixed top-0 left-0 bottom-0 z-50 w-[calc(100vw-65px)] max-w-[340px] bg-[#ffffff] flex flex-col justify-between shadow-2xl md:hidden overflow-y-auto"
              role="dialog"
              aria-modal="true"
              aria-label="Navigation Menu"
            >
              {/* Drawer Top Header with Brand & Close Button */}
              <div>
                <div className="flex items-center justify-between px-6 h-16 border-b border-[#e9e9e9]">
                  <Link href="/" onClick={() => setMobileOpen(false)} className="inline-flex items-center" aria-label="Avender Line Home">
                    <Image
                      src="/brand/logo.png"
                      alt="Avender Line"
                      width={140}
                      height={22}
                      className="h-5 w-auto object-contain"
                    />
                  </Link>
                  <button
                    onClick={() => setMobileOpen(false)}
                    className="p-1.5 text-[#1c1b1b] hover:opacity-70 transition-opacity"
                    aria-label="Close Navigation"
                  >
                    <CloseIcon className="w-5 h-5" />
                  </button>
                </div>

                {/* Main Navigation Links */}
                <div className="px-6 py-4 divide-y divide-[#f0ede6]">
                  {links.map((l) => {
                    const isConcierge = l.href === "/concierge";
                    return (
                      <Link
                        key={l.href}
                        href={l.href}
                        onClick={() => setMobileOpen(false)}
                        className="py-3.5 flex items-center justify-between text-[13px] uppercase font-medium tracking-[0.16em] text-[#1c1b1b] hover:text-[#8b7355] transition-colors"
                      >
                        <span className="flex items-center gap-2">
                          {isConcierge && <SparklesIcon className="w-4 h-4 text-[#b39265]" />}
                          {l.label}
                        </span>
                        <svg className="w-3.5 h-3.5 text-[#b0a99f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    );
                  })}

                  <Link
                    href="/about"
                    onClick={() => setMobileOpen(false)}
                    className="py-3.5 flex items-center justify-between text-[13px] uppercase font-medium tracking-[0.16em] text-[#555555] hover:text-[#1c1b1b] transition-colors"
                  >
                    <span>ABOUT THE MAISON</span>
                    <svg className="w-3.5 h-3.5 text-[#b0a99f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>

                  <Link
                    href="/contact"
                    onClick={() => setMobileOpen(false)}
                    className="py-3.5 flex items-center justify-between text-[13px] uppercase font-medium tracking-[0.16em] text-[#555555] hover:text-[#1c1b1b] transition-colors"
                  >
                    <span>CONTACT & ATELIER</span>
                    <svg className="w-3.5 h-3.5 text-[#b0a99f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>

              {/* Drawer Footer Details (Currency, Account, Care) */}
              <div className="p-6 bg-[#faf8f5] border-t border-[#e9e9e9] space-y-4">
                <div className="flex items-center justify-between text-xs text-[#555555]">
                  <span className="uppercase tracking-wider">Currency</span>
                  <span className="font-semibold text-[#1c1b1b] bg-white px-2.5 py-1 rounded border border-[#e2dbcd]">
                    QAR (Qatari Riyal)
                  </span>
                </div>

                <div className="pt-1">
                  <Link
                    href={user ? "/account" : "/auth/login"}
                    onClick={() => setMobileOpen(false)}
                    className="block text-center w-full py-2.5 text-xs uppercase font-semibold tracking-[0.16em] bg-[#1c1b1b] text-white hover:bg-[#333333] transition-colors rounded-xs"
                  >
                    {user ? "MY ACCOUNT" : "SIGN IN / REGISTER"}
                  </Link>
                </div>

                <div className="text-center pt-2 text-[11px] text-[#777777] font-mono space-y-1">
                  <p>Doha Atelier Â· Qatar</p>
                  <p className="text-[#999999]">Customer Care: +974 5555 1234</p>
                  <a
                    href="https://instagram.com/avender_line"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-[#8b7355] hover:text-[#1c1b1b] transition-colors pt-1"
                  >
                    <span>Instagram: @avender_line</span>
                  </a>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Slide-out Cart Drawer and Search Modal Mounted Globally */}
      <CartDrawer />
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}

