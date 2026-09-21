"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { api } from "@/lib/api";
import { WhatsAppIcon } from "@/components/Icons";

const statusSteps = [
  { key: "Pending", title: "Order Confirmed", desc: "Order received; bespoke pattern prepared at atelier" },
  { key: "Processing", title: "Atelier Tailoring", desc: "Master cutting and delicate hand-embroidery in progress" },
  { key: "QualityCheck", title: "Quality & Packaging", desc: "Inspection, signature perfume mist, and ribbon presentation" },
  { key: "Shipped", title: "With Private Courier", desc: "En route via climate-controlled private transport across Qatar" },
  { key: "Delivered", title: "Delivered", desc: "Hand-delivered to your designated address" },
];

export default function OrderTrackingPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const orderNumber = (params?.orderNumber as string) ?? "";
  const isNewOrder = searchParams.get("success") === "true";

  const [order, setOrder] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Try to load from localStorage first or api
    try {
      const savedOrders = JSON.parse(localStorage.getItem("avenderline_orders") ?? "[]");
      const found = savedOrders.find((o: any) => o.orderNumber === orderNumber);
      if (found) {
        setOrder(found);
        setLoading(false);
        return;
      }
    } catch {
      // Ignore
    }

    // Try API
    api
      .getOrderByNumber(orderNumber)
      .then((res) => setOrder(res))
      .catch(() => {
        // Fallback placeholder order
        setOrder({
          orderNumber,
          fullName: "Distinguished Client",
          status: "Processing",
          createdAt: new Date().toISOString(),
          total: 950,
          paymentMethod: "Credit / Debit Card (Tap Payments)",
          address: "Doha, State of Qatar",
          items: [
            {
              name: "Royal Sidra Beaded Couture Abaya",
              size: "54",
              quantity: 1,
              price: 950,
            },
          ],
        });
      })
      .finally(() => setLoading(false));
  }, [orderNumber]);

  const currentStepIdx = order?.status === "Delivered" ? 4 : order?.status === "Shipped" ? 3 : 1;

  if (loading) {
    return (
      <main className="mx-auto max-w-2xl px-6 py-24 text-center">
        <div className="h-8 w-8 border-2 border-[#1c1b1b] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-xs text-[#6a6a6a]">Loading atelier order details...</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl px-6 py-12 sm:py-16">
      {/* Success Banner if redirected from checkout */}
      {isNewOrder && (
        <div className="mb-10 border border-[#e9e9e9] bg-[#faf8f5] p-8 text-center space-y-4 shadow-xs">
          <span className="text-3xl block mb-1">🎉</span>
          <h2 className="font-display text-xl sm:text-2xl font-semibold uppercase tracking-wider text-[#1c1b1b]">
            Your Order Has Been Received
          </h2>
          <p className="text-xs text-[#6a6a6a] max-w-md mx-auto leading-relaxed">
            Thank you for choosing AvenderLine Haute Couture Maison. Your order reference is{" "}
            <span className="font-mono font-bold text-[#1c1b1b]">{orderNumber}</span>. Our master couturiers will begin hand-tailoring your creation promptly.
          </p>

          {/* Quick WhatsApp Location Button */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href={`https://wa.me/97455551234?text=${encodeURIComponent(
                order?.mapsUrl
                  ? `مرحباً دار أفندر لاين، تم إتمام الطلب رقم ${orderNumber}. رابط موقع التوصيل على خرائط جوجل: ${order.mapsUrl}`
                  : `مرحباً دار أفندر لاين، تم إتمام الطلب رقم ${orderNumber}. أود مشاركة موقع التوصيل الحالي.`
              )}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2.5 bg-[#25D366] text-white px-7 py-3 text-xs font-semibold uppercase tracking-wider hover:bg-[#20ba59] transition-all duration-300 shadow-sm"
            >
              <WhatsAppIcon className="w-4 h-4" />
              <span>Send Live Location via WhatsApp (إرسال اللوكيشن)</span>
            </a>
          </div>

          <p className="text-[11px] text-[#777777] font-light">
            Our private courier will also connect with you directly on WhatsApp before dispatch to confirm timing.
          </p>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e9e9e9] pb-6 mb-8">
        <div>
          <span className="text-[10px] font-mono tracking-[0.25em] text-[#8b7355] uppercase block font-semibold mb-1">
            ORDER STATUS & ATELIER TRACKING
          </span>
          <h1 className="font-display text-2xl sm:text-3xl font-semibold uppercase tracking-wider text-[#1c1b1b]">
            Order: <span className="font-mono text-[#8b7355]">{orderNumber}</span>
          </h1>
          <p className="text-xs text-[#888888] mt-1">
            Date: {new Date(order?.createdAt ?? Date.now()).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>

        <a
          href={`https://wa.me/97455551234?text=${encodeURIComponent(
            `Hello AvenderLine Maison, I would like to inquire about the status of order ${orderNumber}`
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 border border-[#25D366] bg-white px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#25D366] hover:bg-[#25D366] hover:text-white transition-colors shadow-xs"
        >
          <span>💬 WhatsApp Inquiries</span>
        </a>
      </div>

      {/* Visual Timeline Stepper */}
      <div className="border border-[#e9e9e9] bg-white p-6 sm:p-8 shadow-xs mb-10">
        <h3 className="font-display text-base font-semibold uppercase tracking-wider text-[#1c1b1b] mb-8 text-center sm:text-start">
          Atelier Crafting & Delivery Milestones
        </h3>

        <div className="relative">
          {/* Track line */}
          <div className="hidden sm:block absolute top-5 inset-x-8 h-0.5 bg-[#e9e9e9] z-0">
            <div
              className="h-full bg-[#1c1b1b] transition-all duration-700"
              style={{ width: `${(currentStepIdx / (statusSteps.length - 1)) * 100}%` }}
            />
          </div>

          {/* Steps */}
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-6 sm:gap-2 relative z-10">
            {statusSteps.map((step, idx) => {
              const isPast = idx < currentStepIdx;
              const isCurrent = idx === currentStepIdx;

              return (
                <div key={step.key} className="flex sm:flex-col items-center sm:items-center gap-4 sm:gap-2 text-start sm:text-center">
                  <div
                    className={`flex h-10 w-10 flex-shrink-0 items-center justify-center text-xs font-semibold border transition-all ${
                      isPast
                        ? "bg-[#1c1b1b] border-[#1c1b1b] text-white"
                        : isCurrent
                        ? "bg-white border-[#1c1b1b] text-[#1c1b1b] ring-4 ring-black/5"
                        : "bg-white border-[#e9e9e9] text-[#888888]"
                    }`}
                  >
                    {isPast ? "✓" : idx + 1}
                  </div>

                  <div>
                    <h4
                      className={`text-xs font-semibold uppercase tracking-wide ${
                        isCurrent
                          ? "text-[#1c1b1b]"
                          : isPast
                          ? "text-[#1c1b1b]"
                          : "text-[#888888]"
                      }`}
                    >
                      {step.title}
                    </h4>
                    <p className="text-[11px] text-[#6a6a6a] mt-0.5 max-w-[130px] leading-tight">
                      {step.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Order Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
        {/* Delivery Details */}
        <div className="border border-[#e9e9e9] bg-[#faf8f5] p-6 space-y-3">
          <h4 className="font-display text-xs font-semibold uppercase tracking-wider text-[#1c1b1b] border-b border-[#e9e9e9] pb-2">
            Delivery Destination
          </h4>
          <p>
            <span className="text-[#888888] uppercase tracking-wider text-[10px] block">Client Name:</span>{" "}
            <span className="font-semibold text-[#1c1b1b]">{order?.fullName}</span>
          </p>
          <p>
            <span className="text-[#888888] uppercase tracking-wider text-[10px] block">Address:</span>{" "}
            <span className="font-medium text-[#1c1b1b]">{order?.address || "Doha, Qatar"}</span>
          </p>
          <p>
            <span className="text-[#888888] uppercase tracking-wider text-[10px] block">Payment:</span>{" "}
            <span className="font-medium text-[#1c1b1b]">{order?.paymentMethod}</span>
          </p>
        </div>

        {/* Financial Details */}
        <div className="border border-[#e9e9e9] bg-[#faf8f5] p-6 space-y-3">
          <h4 className="font-display text-xs font-semibold uppercase tracking-wider text-[#1c1b1b] border-b border-[#e9e9e9] pb-2">
            Financial Summary
          </h4>
          <div className="flex justify-between">
            <span className="text-[#6a6a6a]">Qatar Express Delivery:</span>
            <span className="font-medium text-[#1c1b1b]">Complimentary</span>
          </div>
          <div className="flex justify-between border-t border-[#e9e9e9] pt-2 text-sm font-semibold text-[#1c1b1b]">
            <span>Total:</span>
            <span className="text-[#8b7355]">{order?.total ?? 950} QAR</span>
          </div>
        </div>
      </div>

      <div className="mt-10 text-center">
        <Link
          href="/"
          className="inline-block bg-[#1c1b1b] px-9 py-3.5 text-xs font-semibold uppercase tracking-[0.2em] text-white hover:bg-[#8b7355] transition-colors"
        >
          Return to Home
        </Link>
      </div>
    </main>
  );
}
