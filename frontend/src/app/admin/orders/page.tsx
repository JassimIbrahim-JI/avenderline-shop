"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("avenderline_orders") ?? "[]");
      if (saved.length > 0) {
        setOrders(saved);
      } else {
        const sampleOrders = [
          {
            orderNumber: "ORD-948201",
            fullName: "Client Mariam",
            phone: "+974 5511 2233",
            city: "Al Rayyan",
            address: "Al Rayyan, Street 950, Villa 14",
            total: 1900,
            status: "Processing",
            createdAt: new Date().toISOString(),
            paymentMethod: "Credit Card (Tap Payments)",
            items: [
              { name: "Royal Sidra Beaded Couture Abaya", size: "54", quantity: 2, price: 950 },
            ],
          },
          {
            orderNumber: "ORD-839212",
            fullName: "Client Nouf",
            phone: "+974 6622 3344",
            city: "The Pearl",
            address: "Porto Arabia, Tower 12, Apt 804",
            total: 820,
            status: "Shipped",
            createdAt: new Date(Date.now() - 86400000).toISOString(),
            paymentMethod: "Apple Pay",
            items: [
              { name: "Doha Pearl Organza Cuff Abaya", size: "56", quantity: 1, price: 820 },
            ],
          },
          {
            orderNumber: "ORD-719302",
            fullName: "Client Sara",
            phone: "+974 3344 5566",
            city: "Lusail",
            address: "Fox Hills, Villa 31",
            total: 1150,
            status: "Delivered",
            createdAt: new Date(Date.now() - 172800000).toISOString(),
            paymentMethod: "Cash / Card on Delivery",
            items: [
              { name: "Heritage Qatari Gold Kasab Bisht", size: "54", quantity: 1, price: 1150 },
            ],
          },
        ];
        setOrders(sampleOrders);
      }
    } catch {
      // Ignore
    }
  }, []);

  const handleUpdateStatus = (orderNumber: string, newStatus: string) => {
    const updated = orders.map((o) =>
      o.orderNumber === orderNumber ? { ...o, status: newStatus } : o
    );
    setOrders(updated);
    try {
      localStorage.setItem("avenderline_orders", JSON.stringify(updated));
    } catch {
      // Ignore
    }
  };

  const filteredOrders = orders.filter((o) => {
    if (filter === "all") return true;
    return o.status === filter;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-semibold uppercase tracking-wider text-[#1c1b1b]">
          Atelier Orders & Dispatch
        </h1>
        <p className="text-xs text-[#6a6a6a] mt-1">
          Monitor crafting progression, courier handoffs, and settlement status.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-[#e9e9e9] pb-3 text-xs font-semibold">
        {[
          { key: "all", label: "All Orders" },
          { key: "Pending", label: "Pending Review" },
          { key: "Processing", label: "In Atelier (Tailoring)" },
          { key: "Shipped", label: "With Courier" },
          { key: "Delivered", label: "Delivered" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`px-4 py-2 text-xs uppercase tracking-wider transition ${
              filter === tab.key
                ? "bg-[#1c1b1b] text-white font-semibold"
                : "bg-white text-[#6a6a6a] border border-[#e9e9e9] hover:border-[#1c1b1b]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Orders Table */}
      <div className="border border-[#e9e9e9] bg-white shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-start border-collapse">
            <thead>
              <tr className="bg-[#faf8f5] text-[#1c1b1b] border-b border-[#e9e9e9]">
                <th className="p-4 font-semibold text-start uppercase tracking-wider">Order No</th>
                <th className="p-4 font-semibold text-start uppercase tracking-wider">Client & Phone</th>
                <th className="p-4 font-semibold text-start uppercase tracking-wider">Qatar Address</th>
                <th className="p-4 font-semibold text-start uppercase tracking-wider">Payment Method</th>
                <th className="p-4 font-semibold text-start uppercase tracking-wider">Total</th>
                <th className="p-4 font-semibold text-start uppercase tracking-wider">Atelier Stage</th>
                <th className="p-4 font-semibold text-start uppercase tracking-wider">Update Stage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e9e9e9]">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-[#888888]">
                    No orders match this classification.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.orderNumber} className="hover:bg-[#faf8f5]">
                    <td className="p-4 font-mono font-bold text-[#1c1b1b]">
                      <Link
                        href={`/orders/${order.orderNumber}`}
                        className="hover:text-[#8b7355] underline"
                      >
                        {order.orderNumber}
                      </Link>
                    </td>
                    <td className="p-4">
                      <span className="font-semibold text-[#1c1b1b] block">{order.fullName}</span>
                      <a
                        href={`https://wa.me/${order.phone?.replace(/[^0-9]/g, "")}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[#25D366] text-[11px] font-mono hover:underline inline-block mt-0.5"
                      >
                        ðŸ’¬ {order.phone}
                      </a>
                    </td>
                    <td className="p-4 text-[#6a6a6a] max-w-[200px] truncate">
                      {order.address || order.city}
                    </td>
                    <td className="p-4 text-[#6a6a6a]">{order.paymentMethod}</td>
                    <td className="p-4 font-semibold text-[#1c1b1b] text-sm">
                      {order.total} QAR
                    </td>
                    <td className="p-4">
                      <span
                        className={`inline-block px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider border ${
                          order.status === "Delivered"
                            ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                            : order.status === "Shipped"
                            ? "bg-blue-50 text-blue-800 border-blue-200"
                            : "bg-amber-50 text-amber-800 border-amber-200"
                        }`}
                      >
                        {order.status === "Pending"
                          ? "Pending Review"
                          : order.status === "Processing"
                          ? "In Atelier Tailoring"
                          : order.status === "Shipped"
                          ? "With Courier"
                          : "Delivered"}
                      </span>
                    </td>
                    <td className="p-4">
                      <select
                        value={order.status}
                        onChange={(e) => handleUpdateStatus(order.orderNumber, e.target.value)}
                        className="border border-[#e9e9e9] bg-white px-2.5 py-1 text-xs outline-none focus:border-[#1c1b1b]"
                      >
                        <option value="Pending">Pending Review</option>
                        <option value="Processing">In Atelier Tailoring</option>
                        <option value="Shipped">With Courier</option>
                        <option value="Delivered">Delivered</option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

