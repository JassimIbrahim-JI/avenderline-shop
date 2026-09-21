"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function AccountPage() {
  const router = useRouter();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("avenderline_orders");
      if (saved) {
        setOrders(JSON.parse(saved));
      }
    } catch {
      // Ignore storage errors
    }
  }, []);

  if (!isAuthenticated && !user) {
    return (
      <main className="mx-auto max-w-md px-6 py-20 text-center">
        <div className="h-16 w-16 rounded-full bg-[#f4f2ee] flex items-center justify-center text-2xl mx-auto mb-4 text-[#1c1b1b]">
          ðŸ‘¤
        </div>
        <h2 className="font-display text-2xl font-semibold uppercase tracking-wider text-[#1c1b1b]">
          Please Sign In
        </h2>
        <p className="mt-2 text-xs text-[#6a6a6a]">
          Please log in to view your order history, tracking updates, and atelier tailoring details.
        </p>
        <Link
          href="/auth/login"
          className="mt-6 inline-block bg-[#1c1b1b] px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.2em] text-white hover:bg-[#8b7355] transition-colors"
        >
          Sign In
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-6 py-12 sm:py-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#e9e9e9] pb-8 mb-10">
        <div>
          <span className="text-[10px] font-mono tracking-[0.25em] text-[#8b7355] uppercase block font-semibold mb-1">
            CLIENT PORTAL
          </span>
          <h1 className="font-display text-2xl sm:text-3xl font-semibold uppercase tracking-wider text-[#1c1b1b]">
            Welcome back, {user?.fullName || user?.email}
          </h1>
          <p className="text-xs text-[#6a6a6a] mt-1">{user?.email}</p>
        </div>

        <div className="flex items-center gap-3">
          {isAdmin && (
            <Link
              href="/admin"
              className="border border-[#1c1b1b] bg-[#1c1b1b] px-5 py-2.5 text-xs font-semibold uppercase tracking-widest text-white hover:bg-[#8b7355] hover:border-[#8b7355] transition-colors shadow-xs"
            >
              Admin Console
            </Link>
          )}
          <button
            onClick={() => {
              logout();
              router.push("/");
            }}
            className="border border-[#e9e9e9] bg-white px-5 py-2.5 text-xs font-semibold uppercase tracking-widest text-red-600 hover:bg-red-50 transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Main: Orders List (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold uppercase tracking-wider text-[#1c1b1b]">
              Order History & Atelier Tracking
            </h2>
            <Link
              href="/track"
              className="text-xs text-[#8b7355] font-semibold underline hover:text-[#1c1b1b] transition-colors uppercase tracking-wider"
            >
              Track by Waybill â†’
            </Link>
          </div>

          {orders.length === 0 ? (
            <div className="border border-dashed border-[#e9e9e9] bg-[#faf8f5] p-10 text-center">
              <p className="font-display text-base font-semibold uppercase tracking-wider text-[#1c1b1b]">
                No previous orders yet
              </p>
              <p className="mt-1.5 text-xs text-[#6a6a6a]">
                When you place an order, live tailoring stages and courier dispatch updates will appear here.
              </p>
              <Link
                href="/collections/women"
                className="mt-6 inline-block bg-[#1c1b1b] px-7 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-white hover:bg-[#8b7355] transition-colors"
              >
                Explore Collection
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order, idx) => (
                <div
                  key={idx}
                  className="border border-[#e9e9e9] bg-white p-6 shadow-xs space-y-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#e9e9e9] pb-3 text-xs">
                    <div>
                      <span className="font-mono font-bold text-[#1c1b1b] block text-sm">
                        {order.orderNumber}
                      </span>
                      <span className="text-[#888888] text-[11px]">
                        {new Date(order.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="border border-[#e9e9e9] bg-[#faf8f5] px-3 py-1 text-xs font-medium text-[#8b7355] uppercase tracking-wider">
                        {order.status === "Pending" ? "In Atelier Tailoring" : order.status}
                      </span>
                      <Link
                        href={`/orders/${order.orderNumber}`}
                        className="bg-[#1c1b1b] px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-white hover:bg-[#8b7355] transition-colors"
                      >
                        View Order
                      </Link>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs">
                    <p className="text-[#6a6a6a]">
                      <span className="font-semibold text-[#1c1b1b]">Delivery Address:</span> {order.address || order.city}
                    </p>
                    <p className="text-[#6a6a6a]">
                      <span className="font-semibold text-[#1c1b1b]">Payment Method:</span> {order.paymentMethod}
                    </p>
                    <div className="pt-2 flex justify-between font-semibold text-[#1c1b1b] text-sm border-t border-[#e9e9e9]">
                      <span>Total:</span>
                      <span className="text-[#8b7355]">{order.total} QAR</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar: Profile Info (4 Cols) */}
        <div className="lg:col-span-4 border border-[#e9e9e9] bg-[#faf8f5] p-6 space-y-4 h-fit">
          <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-[#1c1b1b] border-b border-[#e9e9e9] pb-3">
            Membership Privileges
          </h3>
          <div className="space-y-3 text-xs text-[#6a6a6a]">
            <div>
              <span className="text-[#888888] block text-[10px] uppercase tracking-wider">Full Name:</span>
              <span className="font-semibold text-[#1c1b1b]">{user?.fullName || "Distinguished Client"}</span>
            </div>
            <div>
              <span className="text-[#888888] block text-[10px] uppercase tracking-wider">Email Address:</span>
              <span className="font-medium text-[#1c1b1b]">{user?.email}</span>
            </div>
            <div>
              <span className="text-[#888888] block text-[10px] uppercase tracking-wider">Client Tier:</span>
              <span className="inline-block border border-[#8b7355]/30 bg-white px-2.5 py-1 text-[#8b7355] font-semibold text-[11px] tracking-wider uppercase mt-1">
                AvenderLine Couture Circle ðŸŒŸ
              </span>
            </div>
          </div>

          <div className="pt-4 border-t border-[#e9e9e9] text-[11px] text-[#6a6a6a] space-y-1.5">
            <p>âœ‚ï¸ Complimentary bespoke length alterations on all purchases.</p>
            <p>ðŸ’¬ Dedicated Atelier concierge support for styling inquiries.</p>
          </div>
        </div>
      </div>
    </main>
  );
}


