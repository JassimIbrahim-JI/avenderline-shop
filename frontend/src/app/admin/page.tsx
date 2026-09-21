"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { demoProducts } from "@/lib/demo";

export default function AdminDashboardPage() {
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("avenderline_orders") ?? "[]");
      if (saved.length > 0) {
        setOrders(saved);
      } else {
        // Sample orders for demo display
        const sampleOrders = [
          {
            orderNumber: "ORD-948201",
            fullName: "Client Mariam",
            phone: "+974 5511 2233",
            city: "Al Rayyan",
            total: 1900,
            status: "Processing",
            createdAt: new Date().toISOString(),
          },
          {
            orderNumber: "ORD-839212",
            fullName: "Client Nouf",
            phone: "+974 6622 3344",
            city: "The Pearl",
            total: 820,
            status: "Shipped",
            createdAt: new Date(Date.now() - 86400000).toISOString(),
          },
          {
            orderNumber: "ORD-719302",
            fullName: "Client Sara",
            phone: "+974 3344 5566",
            city: "Lusail",
            total: 1150,
            status: "Delivered",
            createdAt: new Date(Date.now() - 172800000).toISOString(),
          },
        ];
        setOrders(sampleOrders);
      }
    } catch {
      // Ignore
    }
  }, []);

  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const totalOrdersCount = orders.length;
  const averageOrderValue = totalOrdersCount > 0 ? Math.round(totalRevenue / totalOrdersCount) : 0;
  const activeProductsCount = demoProducts.length;

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

  return (
    <div className="space-y-8">
      {/* Header and Quick Action */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-semibold uppercase tracking-wider text-[#1c1b1b]">
            Atelier Executive Overview
          </h1>
          <p className="text-xs text-[#6a6a6a] mt-1">
            Real-time monitoring of revenue, tailoring pipeline, and couture inventory.
          </p>
        </div>

        <div className="flex gap-3">
          <Link
            href="/admin/products"
            className="bg-[#1c1b1b] px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-white hover:bg-[#8b7355] transition-colors shadow-xs"
          >
            + Add New Creation
          </Link>
          <Link
            href="/admin/orders"
            className="border border-[#e9e9e9] bg-white px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#1c1b1b] hover:bg-[#faf8f5] transition-colors"
          >
            Manage All Orders
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="border border-[#e9e9e9] bg-white p-6 shadow-xs space-y-2">
          <span className="text-xs text-[#888888] font-semibold uppercase tracking-wider block">Total Revenue</span>
          <p className="font-display text-2xl sm:text-3xl font-semibold text-[#1c1b1b]">
            {totalRevenue.toLocaleString()} <span className="text-sm font-sans text-[#8b7355]">QAR</span>
          </p>
          <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 inline-block font-medium">
            â†‘ +18% vs previous month
          </span>
        </div>

        <div className="border border-[#e9e9e9] bg-white p-6 shadow-xs space-y-2">
          <span className="text-xs text-[#888888] font-semibold uppercase tracking-wider block">Atelier Orders</span>
          <p className="font-display text-2xl sm:text-3xl font-semibold text-[#1c1b1b]">
            {totalOrdersCount} <span className="text-sm font-sans text-[#888888]">Orders</span>
          </p>
          <span className="text-[11px] text-[#6a6a6a] bg-[#faf8f5] px-2 py-0.5 inline-block font-medium">
            ðŸ‡¶ðŸ‡¦ 100% Qatar Deliveries
          </span>
        </div>

        <div className="border border-[#e9e9e9] bg-white p-6 shadow-xs space-y-2">
          <span className="text-xs text-[#888888] font-semibold uppercase tracking-wider block">Average Order Value (AOV)</span>
          <p className="font-display text-2xl sm:text-3xl font-semibold text-[#1c1b1b]">
            {averageOrderValue} <span className="text-sm font-sans text-[#8b7355]">QAR</span>
          </p>
          <span className="text-[11px] text-[#888888]">Luxury haute couture tier</span>
        </div>

        <div className="border border-[#e9e9e9] bg-white p-6 shadow-xs space-y-2">
          <span className="text-xs text-[#888888] font-semibold uppercase tracking-wider block">Active Catalog Silhouettes</span>
          <p className="font-display text-2xl sm:text-3xl font-semibold text-[#1c1b1b]">
            {activeProductsCount} <span className="text-sm font-sans text-[#888888]">Pieces</span>
          </p>
          <span className="text-[11px] text-[#888888]">Live in public showcase</span>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="border border-[#e9e9e9] bg-white shadow-xs overflow-hidden">
        <div className="p-6 border-b border-[#e9e9e9] flex items-center justify-between">
          <div>
            <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-[#1c1b1b]">
              Recent Client Orders
            </h3>
            <p className="text-xs text-[#6a6a6a]">Update live crafting stages instantly with one click</p>
          </div>
          <Link href="/admin/orders" className="text-xs text-[#8b7355] font-semibold uppercase tracking-wider hover:underline">
            View All â†’
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-start border-collapse">
            <thead>
              <tr className="bg-[#faf8f5] text-[#1c1b1b] border-b border-[#e9e9e9]">
                <th className="p-4 font-semibold text-start uppercase tracking-wider">Order No</th>
                <th className="p-4 font-semibold text-start uppercase tracking-wider">Client</th>
                <th className="p-4 font-semibold text-start uppercase tracking-wider">Zone</th>
                <th className="p-4 font-semibold text-start uppercase tracking-wider">Total</th>
                <th className="p-4 font-semibold text-start uppercase tracking-wider">Atelier Stage</th>
                <th className="p-4 font-semibold text-start uppercase tracking-wider">Update Stage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e9e9e9]">
              {orders.slice(0, 5).map((order) => (
                <tr key={order.orderNumber} className="hover:bg-[#faf8f5]">
                  <td className="p-4 font-mono font-bold text-[#1c1b1b]">
                    <Link href={`/orders/${order.orderNumber}`} className="hover:text-[#8b7355]">
                      {order.orderNumber}
                    </Link>
                  </td>
                  <td className="p-4">
                    <span className="font-semibold block text-[#1c1b1b]">{order.fullName}</span>
                    <span className="text-[11px] text-[#888888] font-mono">{order.phone}</span>
                  </td>
                  <td className="p-4 text-[#6a6a6a]">{order.city}</td>
                  <td className="p-4 font-semibold text-[#1c1b1b]">{order.total} QAR</td>
                  <td className="p-4">
                    <span
                      className={`inline-block px-2.5 py-1 text-[11px] uppercase tracking-wider font-semibold border ${
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
                        ? "In Atelier (Tailoring)"
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
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

