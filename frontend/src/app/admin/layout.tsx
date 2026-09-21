"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user } = useAuth();

  const navItems = [
    { href: "/admin", label: "Dashboard & Analytics", icon: "ðŸ“Š" },
    { href: "/admin/products", label: "Creations & Catalog", icon: "ðŸ‘—" },
    { href: "/admin/orders", label: "Atelier Orders & Dispatch", icon: "ðŸ“¦" },
    { href: "/admin/carousel", label: "Hero Banners & Slides", icon: "ðŸ–¼ï¸" },
    { href: "/admin/marketing", label: "Newsletter & Marketing", icon: "ðŸ’Œ" },
    { href: "/admin/settings", label: "Store & Shipping Settings", icon: "âš™ï¸" },
  ];

  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#1c1b1b] flex flex-col md:flex-row">
      {/* Admin Sidebar */}
      <aside className="w-full md:w-64 bg-[#1c1b1b] text-white flex-shrink-0 flex flex-col justify-between border-e border-black/20">
        <div>
          {/* Brand */}
          <div className="p-6 border-b border-white/10">
            <Link href="/" className="inline-block">
              <span className="font-display text-xl font-bold tracking-wider text-white">
                AVENDER<span className="text-[#c5a880]">LINE</span>
              </span>
              <span className="text-[9px] tracking-[0.25em] text-[#c5a880] uppercase block font-sans mt-0.5">
                Atelier Admin Console
              </span>
            </Link>
          </div>

          {/* Nav links */}
          <nav className="p-4 space-y-1.5">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 text-xs font-semibold uppercase tracking-wider transition ${
                    isActive
                      ? "bg-white text-[#1c1b1b] shadow-xs font-bold"
                      : "text-neutral-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <span className="text-base">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-white/10 space-y-2">
          <Link
            href="/"
            className="flex items-center gap-2 px-4 py-2.5 text-xs text-neutral-400 hover:text-white transition uppercase tracking-wider"
          >
            <span>ðŸŒ</span>
            <span>View Public Storefront</span>
          </Link>
          <div className="px-4 py-2 text-[11px] text-neutral-400 border-t border-white/10 font-mono">
            Admin: {user?.email ?? "admin@avenderline.com"}
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-y-auto min-h-screen">
        <header className="bg-white border-b border-[#e9e9e9] px-8 py-4 flex items-center justify-between sticky top-0 z-30 shadow-xs">
          <h2 className="font-display text-base font-semibold uppercase tracking-wider text-[#1c1b1b]">
            AvenderLine Atelier Console â€” Doha, Qatar
          </h2>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 border border-[#e9e9e9] bg-[#faf8f5] px-3 py-1 text-xs font-medium text-emerald-800">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              API & Database Online
            </span>
          </div>
        </header>

        <div className="p-6 sm:p-8 flex-1">{children}</div>
      </div>
    </div>
  );
}

