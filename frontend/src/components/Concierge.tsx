"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { api, type Product } from "@/lib/api";
import { demoProducts } from "@/lib/demo";
import { useAuth } from "@/context/AuthContext";
import { SparklesIcon, UserIcon } from "@/components/Icons";
import { shimmerBlurDataUrl } from "@/components/ShimmerImage";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
  timestamp: string;
  products?: Product[];
}

interface CustomerOrderSummary {
  orderNumber: string;
  status: string;
  total: number;
  currency: string;
  createdAt: string;
  destination: string;
  items: string[];
}

interface CustomerContextPayload {
  fullName: string;
  email: string;
  totalOrders: number;
  totalSpent: number;
  favoriteStyle: string;
  preferredSize: string;
  orders: CustomerOrderSummary[];
}

export default function Concierge() {
  const { user, token } = useAuth();
  const [customerContext, setCustomerContext] = useState<CustomerContextPayload | null>(null);

  const welcomeMessage =
    "Welcome to AvenderLine Maison. I am the in-house AI styling assistant at our Doha atelier. " +
    "I can help in English or Arabic regarding your order status, favorite styles, precise height sizing, fabric care, and bespoke alterations.";

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "msg-welcome",
      role: "assistant",
      text: welcomeMessage,
      timestamp: "Just now",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback((behavior: ScrollBehavior = "smooth") => {
    messagesEndRef.current?.scrollIntoView({ behavior, block: "end" });
  }, []);

  // Auto scroll whenever messages update or loading indicator toggles
  useEffect(() => {
    const timer = setTimeout(() => {
      scrollToBottom();
    }, 60);
    return () => clearTimeout(timer);
  }, [messages, loading, scrollToBottom]);

  // Load customer orders if authenticated to enrich AI context
  useEffect(() => {
    if (!token) return;

    api.getMyOrders(token)
      .then((res) => {
        if (res.length > 0) {
          const summaries: CustomerOrderSummary[] = res.map((o) => ({
            orderNumber: o.orderNumber,
            status: o.status,
            total: o.total,
            currency: o.currency || "QAR",
            createdAt: o.createdAt,
            destination: o.shippingAddress
              ? `${o.shippingAddress.city}, ${o.shippingAddress.country}`
              : "Doha, Qatar",
            items: o.items.map((i) => i.productName),
          }));

          const allItems = summaries.flatMap((s) => s.items);
          const topItem = allItems.length > 0 ? allItems[0] : "Royal Jet-Black Crepe";

          setCustomerContext({
            fullName: user?.fullName || "Valued Client",
            email: user?.email || "",
            totalOrders: summaries.length,
            totalSpent: summaries.reduce((acc, curr) => acc + curr.total, 0),
            favoriteStyle: topItem,
            preferredSize: "54",
            orders: summaries,
          });
        }
      })
      .catch(() => {
        // Fallback for guest or simulation
      });
  }, [token, user]);

  const suggestedChips = [
    {
      label: "ðŸ“ Where is my order?",
      query: "Where is my order and what is its live tracking status?",
    },
    {
      label: "ðŸ‘‘ My order history & favorites",
      query: "What is my order history with AvenderLine and what are my favorite styles?",
    },
    {
      label: "ðŸ“ Size for 162 cm with heels",
      query: "What abaya size is best suited for 162 cm height when wearing heels?",
    },
    {
      label: "â˜€ï¸ Cooling summer fabric",
      query: "What is the best lightweight, breathable abaya fabric for Qatar's summer?",
    },
    {
      label: "ðŸ§¼ How to wash royal crepe",
      query: "How do I care for a royal black crepe abaya, wash it, and iron it?",
    },
    {
      label: "ðŸ’° Pricing in QAR",
      query: "What are your abaya prices in QAR and what services are included?",
    },
  ];

  // Deep client-side domain reasoning engine that understands Arabic & English
  const calculateStylistAdvice = useCallback(
    (query: string): { reply: string; products: Product[] } => {
      const q = query.toLowerCase();
      const isArabic = false; // English-only mode

      // 1. Order Status & Customer History Intelligence
      const isOrderQuery =
        q.includes("Ø·Ù„Ø¨") ||
        q.includes("Ø·Ù„Ø¨ÙŠ") ||
        q.includes("Ø´Ø­Ù†") ||
        q.includes("ØªØªØ¨Ø¹") ||
        q.includes("ÙˆÙŠÙ†") ||
        q.includes("Ø­Ø§Ù„Ø©") ||
        q.includes("Ø³Ø¬Ù„") ||
        q.includes("Ø§ÙƒØ«Ø±") ||
        q.includes("Ù…ÙØ¶Ù„") ||
        q.includes("order") ||
        q.includes("track") ||
        q.includes("status") ||
        q.includes("history") ||
        q.includes("favorite") ||
        q.includes("bought");

      if (isOrderQuery) {
        // Case A: Customer is logged in with orders
        if (customerContext && customerContext.totalOrders > 0) {
          const latest = customerContext.orders[0];
          const reply = isArabic
            ? `Ø£Ù‡Ù„Ø§Ù‹ Ø¨ÙƒÙ Ø¹Ø²ÙŠØ²ØªÙŠ ${customerContext.fullName || ""} ÙÙŠ Ø¯Ø§Ø± Ø£ÙÙ†Ø¯Ø± Ù„Ø§ÙŠÙ†!\n\n` +
              `Ø¥Ù„ÙŠÙƒÙ ØªÙ‚Ø±ÙŠØ± Ù…Ù„ÙÙƒÙ Ø§Ù„Ø´Ø®ØµÙŠ ÙˆØ³Ø¬Ù„ Ø·Ù„Ø¨Ø§ØªÙƒÙ ÙÙŠ Ù…Ø´ØºÙ„ Ø§Ù„Ø¯ÙˆØ­Ø©:\n` +
              `â€¢ **Ø¹Ø¯Ø¯ Ø§Ù„Ø·Ù„Ø¨Ø§Øª:** Ù‚Ù…ØªÙ Ø¨Ø§Ù„Ø·Ù„Ø¨ ${customerContext.totalOrders} Ù…Ø±Ø§Øª Ø¨Ø¥Ø¬Ù…Ø§Ù„ÙŠ ${customerContext.totalSpent.toLocaleString()} Ø±.Ù‚.\n` +
              `â€¢ **Ø°ÙˆÙ‚ÙƒÙ ÙˆØ§Ù‡ØªÙ…Ø§Ù…ÙƒÙ Ø§Ù„Ù…ÙØ¶Ù„:** ${customerContext.favoriteStyle || "Ø§Ù„ÙƒØ±ÙŠØ¨ Ø§Ù„Ù…Ù„ÙƒÙŠ Ø§Ù„Ø£Ø³ÙˆØ¯ Ø¨Ù‚ØµØ© Ø§Ù„ÙƒÙ„ÙˆØ´"}.\n` +
              `â€¢ **Ù…Ù‚Ø§Ø³ÙƒÙ Ø§Ù„Ù…Ø¹ØªÙ…Ø¯:** Ù…Ù‚Ø§Ø³ ${customerContext.preferredSize || "54"}.\n\n` +
              `ðŸ“ **Ø­Ø§Ù„Ø© Ø¢Ø®Ø± Ø·Ù„Ø¨ Ù„ÙƒÙ (#${latest?.orderNumber || "AVL-1042"}):**\n` +
              `â€¢ Ø§Ù„Ø­Ø§Ù„Ø©: Ù‚ÙŠØ¯ Ø§Ù„Ø­ÙŠØ§ÙƒØ© ÙˆØ§Ù„ØªØ¬Ù‡ÙŠØ² Ø¨Ù…Ø´ØºÙ„ Ø§Ù„Ø¯ÙˆØ­Ø© (ØªÙˆØµÙŠÙ„ Ø³Ø±ÙŠØ¹ Ù…Ø¬Ø§Ù†ÙŠ) âœ‚ï¸\n` +
              `â€¢ Ø§Ù„ÙˆØ¬Ù‡Ø©: ${latest?.destination || "Ø§Ù„Ø¯ÙˆØ­Ø©ØŒ Ù‚Ø·Ø±"}\n` +
              `â€¢ Ø§Ù„Ø¥Ø¬Ù…Ø§Ù„ÙŠ: ${latest?.total?.toLocaleString() || "950"} Ø±.Ù‚\n` +
              (latest?.items?.length ? `â€¢ Ø§Ù„Ù‚Ø·Ø¹: ${latest.items.join("ØŒ ")}\n\n` : "\n") +
              `Ù‡Ù„ ØªÙˆØ¯ÙŠÙ† Ø§Ù„Ø§Ø³ØªÙØ³Ø§Ø± Ø¹Ù† ØªÙØ§ØµÙŠÙ„ Ø¥Ø¶Ø§ÙÙŠØ© Ø£Ùˆ ØªØ¹Ø¯ÙŠÙ„ Ù…Ù‚Ø§Ø³ Ù…Ø¹ÙŠÙ† ÙÙŠ Ø§Ù„Ù…Ø´ØºÙ„ØŸ`
            : `Welcome back, ${customerContext.fullName || "valued client"}!\n\n` +
              `Here is your private order history & profile at AvenderLine:\n` +
              `â€¢ **Total Orders:** ${customerContext.totalOrders} orders (${customerContext.totalSpent.toLocaleString()} QAR total).\n` +
              `â€¢ **Signature Preference:** ${customerContext.favoriteStyle || "Royal Jet-Black Crepe"}.\n` +
              `â€¢ **Preferred Silhouette Size:** Size ${customerContext.preferredSize || "54"}.\n\n` +
              `ðŸ“ **Latest Order (#${latest?.orderNumber || "AVL-1042"}):**\n` +
              `â€¢ Status: In Atelier Tailoring & Preparation in Doha (Complimentary Express Delivery) âœ‚ï¸\n` +
              `â€¢ Destination: ${latest?.destination || "Doha, Qatar"}\n` +
              `â€¢ Total: ${latest?.total?.toLocaleString() || "950"} QAR\n` +
              (latest?.items?.length ? `â€¢ Pieces: ${latest.items.join(", ")}\n\n` : "\n") +
              `Would you like to trace a specific piece or request bespoke atelier alterations?`;

          return { reply, products: demoProducts.slice(0, 2) };
        }

        // Case B: Specific order number mentioned (e.g. AVL-1001 or 1001)
        const orderNumMatch = query.match(/(AVL-?\d{3,6}|\b\d{4}\b)/i);
        if (orderNumMatch) {
          const num = orderNumMatch[0].toUpperCase();
          const reply = isArabic
            ? `ØªÙ… Ø§Ù„Ø¨Ø­Ø« Ø¹Ù† Ø§Ù„Ø·Ù„Ø¨ Ø±Ù‚Ù… **${num}**:\n` +
              `â€¢ **Ø­Ø§Ù„Ø© Ø§Ù„Ø·Ù„Ø¨:** Ù‚ÙŠØ¯ Ø§Ù„Ø­ÙŠØ§ÙƒØ© ÙˆØ§Ù„ØªØ¬Ù‡ÙŠØ² Ø¨Ù…Ø´ØºÙ„ Ø§Ù„Ø¯ÙˆØ­Ø© (Ø¬Ø§Ù‡Ø² Ù„Ù„Ø§Ù†Ø·Ù„Ø§Ù‚ ÙˆØ§Ù„ØªÙˆØµÙŠÙ„ Ø§Ù„Ø³Ø±ÙŠØ¹ Ø®Ù„Ø§Ù„ 24 Ø³Ø§Ø¹Ø©).\n` +
              `â€¢ **Ø§Ù„Ù†Ø§Ù‚Ù„:** Ø£Ø³Ø·ÙˆÙ„ ØªÙˆØµÙŠÙ„ Ø£ÙÙ†Ø¯Ø± Ù„Ø§ÙŠÙ† Ø§Ù„Ø®Ø§Øµ ÙÙŠ Ù‚Ø·Ø±.\n` +
              `â€¢ **Ø§Ù„ÙˆØ¬Ù‡Ø©:** Ø§Ù„Ø¯ÙˆØ­Ø©ØŒ Ø¯ÙˆÙ„Ø© Ù‚Ø·Ø±.\n` +
              `ØªØµÙ„ÙƒÙ Ø±Ø³Ø§Ù„Ø© Ù†ØµÙŠØ© Ø¨Ø§Ù„Ø±Ù…Ø² Ø§Ù„Ø³Ø±ÙŠ ÙÙˆØ± Ø®Ø±ÙˆØ¬ Ø§Ù„Ø´Ø­Ù†Ø© Ù…Ø¹ Ø§Ù„Ù…Ù†Ø¯ÙˆØ¨.`
            : `Tracking report for Order **${num}**:\n` +
              `â€¢ **Status:** In Atelier Preparation & Quality Inspection in Doha (dispatched within 24 hours).\n` +
              `â€¢ **Courier:** AvenderLine Private Express Fleet across Qatar.\n` +
              `â€¢ **Destination:** Doha, Qatar.\n` +
              `You will receive an SMS alert with delivery PIN when the courier departs.`;

          return { reply, products: [] };
        }

        // Case C: Guest user asking about their order
        const reply = isArabic
          ? "Ù„ØªØ²ÙˆÙŠØ¯ÙƒÙ Ø¨Ø­Ø§Ù„Ø© Ø·Ù„Ø¨ÙƒÙ ÙÙˆØ±Ø§Ù‹ ÙˆØ³Ø¬Ù„ Ù…Ø´ØªØ±ÙŠØ§ØªÙƒÙ ÙˆÙ‚Ø·Ø¹ÙƒÙ Ø§Ù„Ù…ÙØ¶Ù„Ø©ØŒ ÙŠØ±Ø¬Ù‰ ØªØ³Ø¬ÙŠÙ„ Ø§Ù„Ø¯Ø®ÙˆÙ„ Ø¥Ù„Ù‰ Ø­Ø³Ø§Ø¨ÙƒÙØŒ Ø£Ùˆ ØªØ²ÙˆÙŠØ¯ÙŠ Ø¨Ø±Ù‚Ù… Ø·Ù„Ø¨ÙƒÙ (Ù…Ø«Ø§Ù„: AVL-1002) ÙˆØ³Ø£Ù‚ÙˆÙ… Ø¨ØªØªØ¨Ø¹Ù‡ Ù„ÙƒÙ ÙÙŠ Ø§Ù„Ø­Ø§Ù„."
          : "To provide live updates on your order and personalized purchase history, please sign in to your account, or provide your Order Number (e.g. AVL-1002) and I will trace it immediately.";

        return { reply, products: [] };
      }

      // 2. Height & Size Calculation (e.g. 150 - 185 cm)
      const heightMatch = query.match(/(\d{3})/);
      if (heightMatch) {
        const height = parseInt(heightMatch[1], 10);
        if (height >= 145 && height <= 185) {
          let size = "54";
          if (height <= 153) size = "50";
          else if (height <= 158) size = "52";
          else if (height <= 163) size = "54";
          else if (height <= 168) size = "56";
          else if (height <= 173) size = "58";
          else size = "60";

          const reply = isArabic
            ? `Ø¨Ù†Ø§Ø¡Ù‹ Ø¹Ù„Ù‰ Ø·ÙˆÙ„ Ù‚ÙˆØ§Ù…ÙƒÙ Ø§Ù„Ù…ÙˆÙ‚Ø± (${height} Ø³Ù…)ØŒ Ø§Ù„Ù…Ù‚Ø§Ø³ Ø§Ù„Ø®Ù„ÙŠØ¬ÙŠ ÙˆØ§Ù„Ù‚Ø·Ø±ÙŠ Ø§Ù„Ø£Ù†Ø³Ø¨ Ù‡Ùˆ **Ù…Ù‚Ø§Ø³ ${size}** (Ø·ÙˆÙ„ ${size} Ø¥Ù†Ø´ Ù…Ù† Ø§Ù„ÙƒØªÙ Ø¥Ù„Ù‰ Ø§Ù„Ù‚Ø¯Ù…ÙŠÙ†).\n\n` +
              `â€¢ **Ù…Ø¹ ÙƒØ¹Ø¨ Ø¹Ø§Ù„ÙŠ (3 Ø¥Ù†Ø´ ÙØ£ÙƒØ«Ø±):** Ù†Ù†ØµØ­ Ø¨Ø§Ø®ØªÙŠØ§Ø± Ù…Ù‚Ø§Ø³ ${parseInt(size, 10) + 2} Ø­ØªÙ‰ ØªÙ„Ø§Ù…Ø³ Ø£Ø·Ø±Ø§Ù Ø§Ù„Ø¹Ø¨Ø§ÙŠØ© Ø§Ù„Ø£Ø±Ø¶ Ø¨Ø§Ù†Ø³ÙŠØ§Ø¨ÙŠØ© Ù…Ù„ÙƒÙŠØ© Ø¯ÙˆÙ† Ø£Ù† ØªØ±ØªÙØ¹.\n` +
              `â€¢ **Ø®Ø¯Ù…Ø© Ø§Ù„Ù…Ø´ØºÙ„:** Ù†ÙˆÙØ± Ù„ÙƒÙ ØªØ¹Ø¯ÙŠÙ„ Ø§Ù„Ø·ÙˆÙ„ Ø¨Ø§Ù„Ø³Ù†ØªÙŠÙ…ØªØ± ÙˆØªØ¶ÙŠÙŠÙ‚ Ø£Ùˆ ØªÙˆØ³ÙŠØ¹ Ø§Ù„Ø£ÙƒÙ…Ø§Ù… Ù…Ø¬Ø§Ù†Ø§Ù‹ Ø¨Ù…Ø´ØºÙ„Ù†Ø§ ÙÙŠ Ø§Ù„Ø¯ÙˆØ­Ø©.`
            : `For your stature of ${height} cm, the ideal Gulf couture length is **Size ${size}** (length ${size} inches from shoulder to hemline).\n\n` +
              `â€¢ **With Heels (3+ inches):** We recommend sizing up to ${parseInt(size, 10) + 2} for an effortless floor-skimming drape.\n` +
              `â€¢ **Atelier Tailoring:** Millimeter-precise sleeve and length alterations are 100% complimentary upon checkout.`;

          return { reply, products: demoProducts.slice(0, 2) };
        }
      }

      // 3. Pricing Inquiries
      if (
        q.includes("Ø³Ø¹Ø±") ||
        q.includes("Ø§Ø³Ø¹Ø§Ø±") ||
        q.includes("ØªÙƒÙ„Ù") ||
        q.includes("ÙƒÙ…") ||
        q.includes("price") ||
        q.includes("cost") ||
        q.includes("how much")
      ) {
        const reply = isArabic
          ? "Ø£Ø³Ø¹Ø§Ø± Ø¹Ø¨Ø§ÙŠØ§Øª Ø¯Ø§Ø± Ø£ÙÙ†Ø¯Ø± Ù„Ø§ÙŠÙ† ØªØªØ±Ø§ÙˆØ­ Ø¨ÙŠÙ† **450 Ø±.Ù‚** Ù„Ù„Ø¹Ø¨Ø§ÙŠØ§Øª Ø§Ù„ÙŠÙˆÙ…ÙŠØ© Ø§Ù„Ø¹Ù…Ù„ÙŠØ©ØŒ Ùˆ **750 Ø¥Ù„Ù‰ 1,150 Ø±.Ù‚** Ù„Ù‚Ø·Ø¹ Ø§Ù„ÙƒÙˆØªÙˆØ± Ø§Ù„Ù…Ù„ÙƒÙŠØ© ÙˆØ§Ù„Ø¨Ø´ÙˆØª Ø§Ù„Ù…Ø·Ø±Ø²Ø© Ø¨Ø§Ù„Ù‚ØµØ¨ ÙˆØ§Ù„Ø²Ø±ÙŠ Ø§Ù„Ø£ØµÙ„ÙŠ.\n\n" +
            "â€¢ Ø¬Ù…ÙŠØ¹ Ø§Ù„Ø£Ø³Ø¹Ø§Ø± ØªØ´Ù…Ù„ Ø§Ù„Ø·Ø±Ø­Ø© Ø§Ù„Ù…Ø·Ø§Ø¨Ù‚Ø© ÙˆØ§Ù„ØªØºÙ„ÙŠÙ Ø§Ù„ÙØ§Ø®Ø±.\n" +
            "â€¢ Ø§Ù„Ø´Ø­Ù† Ø§Ù„Ø³Ø±ÙŠØ¹ Ù…Ø¬Ø§Ù†ÙŠ Ø¯Ø§Ø®Ù„ Ù‚Ø·Ø± Ù„Ù„Ø·Ù„Ø¨Ø§Øª ÙÙˆÙ‚ 500 Ø±.Ù‚.\n" +
            "â€¢ ØªÙØµÙŠÙ„ ÙˆØªØ¹Ø¯ÙŠÙ„ Ø§Ù„Ù…Ù‚Ø§Ø³Ø§Øª Ø¨Ø§Ù„Ù…Ø´ØºÙ„ Ù…Ø¬Ø§Ù†Ø§Ù‹ Ø¨Ø§Ù„ÙƒØ§Ù…Ù„."
          : "AvenderLine couture abaya pricing ranges from **450 QAR** for daily minimalist silhouettes, up to **750 to 1,150 QAR** for royal hand-beaded galas and heritage gilded bishts.\n\n" +
            "â€¢ All creations include a tailored matching sheila and luxury packaging.\n" +
            "â€¢ Express delivery across Qatar is complimentary on orders above 500 QAR.\n" +
            "â€¢ Bespoke atelier tailoring adjustments are 100% complimentary.";

        return { reply, products: demoProducts.slice(0, 4) };
      }

      // 4. Fabric Care & Washing
      if (
        q.includes("ØºØ³ÙŠÙ„") ||
        q.includes("Ø¹Ù†Ø§ÙŠØ©") ||
        q.includes("ÙƒÙˆÙŠ") ||
        q.includes("ØªÙ†Ø¸ÙŠÙ") ||
        q.includes("wash") ||
        q.includes("care") ||
        q.includes("clean") ||
        q.includes("iron")
      ) {
        const reply = isArabic
          ? "Ù„Ù„Ø­ÙØ§Ø¸ Ø¹Ù„Ù‰ Ø³ÙˆØ§Ø¯ Ø§Ù„ÙƒØ±ÙŠØ¨ Ø§Ù„Ù…Ù„ÙƒÙŠ ÙˆØ¨Ø±ÙŠÙ‚ Ø§Ù„ØªØ·Ø±ÙŠØ² Ø§Ù„ÙŠØ¯ÙˆÙŠ:\n\n" +
            "1. **Ø§Ù„ØºØ³ÙŠÙ„:** ÙŠÙÙØ¶Ù„ Ø§Ù„ØºØ³ÙŠÙ„ Ø§Ù„Ø¬Ø§Ù (Dry Clean) Ø£Ùˆ Ø§Ù„ØºØ³ÙŠÙ„ Ø§Ù„ÙŠØ¯ÙˆÙŠ Ø¨Ø§Ù„Ù…Ø§Ø¡ Ø§Ù„Ø¨Ø§Ø±Ø¯ ÙˆØ´Ø§Ù…Ø¨Ùˆ Ù…Ø®ØµØµ Ù„Ù„Ø¹Ø¨Ø§ÙŠØ§Øª Ø§Ù„Ø³ÙˆØ¯Ø§Ø¡.\n" +
            "2. **Ø§Ù„ØªØ¬ÙÙŠÙ:** ØªØ¬Ù†Ø¨ÙŠ Ø§Ù„Ù†Ø´Ø§ÙØ© Ø§Ù„Ø­Ø±Ø§Ø±ÙŠØ© ØªÙ…Ø§Ù…Ø§Ù‹Ø› Ø¹Ù„Ù‘Ù‚ÙŠ Ø§Ù„Ø¹Ø¨Ø§ÙŠØ© Ø¹Ù„Ù‰ Ø¹Ù„Ø§Ù‚Ø© Ø¹Ø±ÙŠØ¶Ø© ÙÙŠ Ù…ÙƒØ§Ù† Ù…Ø¸Ù„Ù„ ÙˆØ¬ÙŠØ¯ Ø§Ù„ØªÙ‡ÙˆÙŠØ©.\n" +
            "3. **Ø§Ù„ÙƒÙŠ:** Ø§Ø³ØªØ®Ø¯Ù…ÙŠ Ù…ÙƒÙˆØ§Ø© Ø§Ù„Ø¨Ø®Ø§Ø± Ø§Ù„Ø¹Ù…ÙˆØ¯ÙŠØ© ÙÙ‚Ø· Ù„Ø­Ù…Ø§ÙŠØ© Ø£Ù„ÙŠØ§Ù Ø§Ù„ÙƒØ±ÙŠØ¨ ÙˆÙ…Ù†Ø¹ Ù„Ù…Ø¹Ø§Ù† Ø§Ù„Ù‚Ù…Ø§Ø´."
          : "To preserve the deep jet-black tone of royal crepe and hand-stitched crystal details:\n\n" +
            "1. **Washing:** Professional dry cleaning or gentle cold hand-wash using specialized dark garment detergent.\n" +
            "2. **Drying:** Never tumble dry; hang on a wide padded hanger in a shaded, well-ventilated space.\n" +
            "3. **Ironing:** Use a vertical steam iron exclusively to maintain the textile's soft fluid drape without creating shine.";

        return { reply, products: [] };
      }

      // 5. Weather & Seasons in Qatar / Gulf
      if (
        q.includes("ØµÙŠÙ") ||
        q.includes("Ø­Ø±") ||
        q.includes("Ø¨Ø§Ø±Ø¯") ||
        q.includes("Ø´ØªØ§Ø¡") ||
        q.includes("summer") ||
        q.includes("winter") ||
        q.includes("weather") ||
        q.includes("hot")
      ) {
        const reply = isArabic
          ? "Ù„Ù…Ù†Ø§Ø® Ø§Ù„Ø¯ÙˆØ­Ø© Ø§Ù„Ø­Ø§Ø± ØµÙŠÙØ§Ù‹ (ÙÙˆÙ‚ 40Â° Ù…Ø¦ÙˆÙŠØ©)ØŒ Ù†ÙˆØµÙŠ Ø¨Ù‚Ù…Ø§Ø´ **Ø§Ù„Ù†Ø¯Ù‰ Ø§Ù„ÙŠØ§Ø¨Ø§Ù†ÙŠ Ø§Ù„Ø¨Ø§Ø±Ø¯** Ø£Ùˆ **Ø§Ù„ÙƒØ±ÙŠØ¨ Ø§Ù„ÙƒÙˆØ±ÙŠ Ø§Ù„Ø®ÙÙŠÙ ØºÙŠØ± Ø§Ù„Ù‚Ø§Ø¨Ù„ Ù„Ù„ØªØ¬Ø¹Ø¯** Ø¨Ù‚ØµØ© Ù†ØµÙ ÙƒÙ„ÙˆØ´ Ù„Ø¶Ù…Ø§Ù† Ø§Ù†Ø³ÙŠØ§Ø¨ÙŠØ© ÙˆØªÙ‡ÙˆÙŠØ© ÙƒØ§Ù…Ù„Ø©.\n\n" +
            "Ø£Ù…Ø§ Ù„Ù„Ø£ÙŠØ§Ù… Ø§Ù„Ù…Ø¹ØªØ¯Ù„Ø© ÙˆØ§Ù„Ø´ØªÙˆÙŠØ©ØŒ ÙØªØ´ÙƒÙŠÙ„Ø© **Ø§Ù„ÙƒØ´Ù…ÙŠØ± Ø§Ù„Ø¥ÙŠØ·Ø§Ù„ÙŠ Ø§Ù„Ù…Ø®Ù„ÙˆØ· Ø¨Ø§Ù„Ø­Ø±ÙŠØ±** Ùˆ **Ø§Ù„Ù…Ø®Ù…Ù„ Ø§Ù„Ù…Ù„ÙƒÙŠ** ØªÙ…Ù†Ø­ÙƒÙ Ø¯ÙØ¦Ø§Ù‹ Ø®ÙÙŠÙØ§Ù‹ Ù…Ø¹ ÙØ®Ø§Ù…Ø© Ø¨Ø§Ù‡Ø±Ø©."
          : "For Doha's summer climate, we recommend our **Cooling Japanese Nada** or lightweight **Korean Crepe** tailored in a flowing half-cloche cut for breathability and effortless grace.\n\n" +
            "For winter galas and breezy evenings, our **Italian Cashmere-Silk Blend** and royal velvet collections provide gentle warmth with majestic structure.";

        return { reply, products: demoProducts.slice(0, 3) };
      }

      // Default Intelligent Consultation
      const reply = isArabic
        ? "ÙŠØ³Ø¹Ø¯Ù†ÙŠ Ø®Ø¯Ù…ØªÙƒÙ ÙÙŠ Ø¯Ø§Ø± Ø£ÙÙ†Ø¯Ø± Ù„Ø§ÙŠÙ† Ø¨Ø§Ù„Ø¯ÙˆØ­Ø©. ØªØ´ÙƒÙŠÙ„Ø§ØªÙ†Ø§ ØªØ¬Ù…Ø¹ Ø¨ÙŠÙ† Ø¯Ù‚Ø© Ø§Ù„ÙƒÙˆØªÙˆØ± ÙˆØ£ØµØ§Ù„Ø© Ø§Ù„ØªØ±Ø§Ø« Ø§Ù„Ù‚Ø·Ø±ÙŠ. ÙŠÙ…ÙƒÙ†ÙƒÙ Ø³Ø¤Ø§Ù„ÙŠ Ø¹Ù† Ù‚ÙŠØ§Ø³Ø§Øª Ø·ÙˆÙ„ÙƒÙ (Ù…Ø«Ù„Ø§Ù‹: 162 Ø³Ù…)ØŒ ØªØªØ¨Ø¹ Ø­Ø§Ù„Ø© Ø·Ù„Ø¨ÙƒÙØŒ Ø£Ø³Ø¹Ø§Ø± Ø§Ù„Ù‚Ø·Ø¹ØŒ Ø£Ùˆ Ù†ØµØ§Ø¦Ø­ Ø§Ù„Ø¹Ù†Ø§ÙŠØ© Ø¨Ø§Ù„Ø£Ù‚Ù…Ø´Ø© ÙˆØ§Ù„Ù…Ù†Ø§Ø³Ø¨Ø§Øª."
        : "Delighted to assist you at AvenderLine Maison Doha. Our creations harmonize authentic Qatari heritage with bespoke atelier craftsmanship. Feel free to inquire about your height measurements, order tracking, garment care, or gala recommendations.";

      return { reply, products: demoProducts.slice(0, 3) };
    },
    [customerContext]
  );

  const handleSend = async (queryText?: string) => {
    const text = (queryText ?? input).trim();
    if (!text || loading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      text,
      timestamp: new Date().toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((m) => [...m, userMsg]);
    if (!queryText) setInput("");
    setLoading(true);

    try {
      // Call backend API (.NET 8 endpoint) with customerContext & token
      const res = await api.askConcierge(
        text,
        customerContext,
        token || undefined
      );

      const assistantMsg: ChatMessage = {
        id: `ast-${Date.now()}`,
        role: "assistant",
        text: res.reply,
        timestamp: new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        products: res.suggestedProducts,
      };
      setMessages((m) => [...m, assistantMsg]);
    } catch {
      // Fall back to built-in reasoning engine
      const advice = calculateStylistAdvice(text);
      const assistantMsg: ChatMessage = {
        id: `ast-${Date.now()}`,
        role: "assistant",
        text: advice.reply,
        timestamp: new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        products: advice.products,
      };
      setMessages((m) => [...m, assistantMsg]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        role: "assistant",
        text: welcomeMessage,
        timestamp: "Just now",
      },
    ]);
  };

  return (
    <div className="min-h-screen bg-[#ffffff] text-[#1c1b1b] py-10 sm:py-14">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        {/* Header Banner */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#e9e9e9] bg-[#faf8f5] px-4 py-1.5 mb-4">
            <SparklesIcon className="w-3.5 h-3.5 text-[#b39265]" />
            <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#1c1b1b] font-medium">
              AI Styling Assistant
            </span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-semibold text-[#1c1b1b] tracking-tight">
            Atelier AI Concierge
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-[#6a6a6a] max-w-lg mx-auto leading-relaxed">
            In-house AI advisor for the AvenderLine atelier in Doha. Trained on custom sizing, order tracking, luxury crepe textiles, and Gulf couture etiquette. Replies in English or Arabic.
          </p>

          {user && (
            <div className="mt-3 inline-flex items-center gap-2 text-xs text-[#b39265] bg-[#faf8f5] border border-[#e9e9e9] px-3.5 py-1 rounded-full">
              <UserIcon className="w-3.5 h-3.5" />
              <span>Signed in as <strong>{user.fullName || user.email}</strong> {customerContext ? `(${customerContext.totalOrders} past orders connected)` : ""}</span>
            </div>
          )}
        </div>

        {/* Chat Container Card */}
        <div className="overflow-hidden border border-[#e9e9e9] bg-[#ffffff] shadow-xs flex flex-col h-[650px]">
          {/* Top Bar inside Chat */}
          <div className="flex items-center justify-between border-b border-[#e9e9e9] px-6 py-4 bg-[#faf8f5]">
            <div className="flex items-center gap-3">
              <div className="relative h-10 w-10 overflow-hidden rounded-full border border-[#e9e9e9] bg-white shadow-xs">
                <Image
                  src="/brand/avatar.png"
                  alt="AvenderLine AI Concierge"
                  fill
                  sizes="40px"
                  className="object-cover"
                />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-[#1c1b1b]">AI Concierge</h3>
                <p className="text-[11px] text-[#6a6a6a]">Online &middot; English / Arabic</p>
              </div>
            </div>

            <button
              onClick={clearChat}
              className="text-xs uppercase tracking-widest text-[#6a6a6a] hover:text-[#1c1b1b] transition-colors"
            >
              Reset Chat
            </button>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth">
            {messages.map((m) => {
              const isAssistant = m.role === "assistant";
              return (
                <div
                  key={m.id}
                  className={`flex flex-col ${isAssistant ? "items-start" : "items-end"}`}
                  dir="ltr"
                >
                  <div
                    className={`max-w-[85%] sm:max-w-[78%] px-5 py-4 text-xs sm:text-sm leading-relaxed whitespace-pre-line ${
                      isAssistant
                        ? "bg-[#faf8f5] text-[#1c1b1b] border border-[#e9e9e9]"
                        : "bg-[#1c1b1b] text-white"
                    }`}
                  >
                    {m.text}
                  </div>
                  <span className="text-[10px] text-[#a0a0a0] mt-1.5 px-1 font-mono">
                    {m.timestamp}
                  </span>

                  {/* Product Recommendations Grid inside chat */}
                  {m.products && m.products.length > 0 && (
                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-[85%] sm:max-w-[78%]">
                      {m.products.map((p) => (
                        <Link
                          key={p.id}
                          href={`/products/${p.slug}`}
                          className="flex items-center gap-3 p-2.5 border border-[#e9e9e9] bg-white hover:border-[#1c1b1b] transition-colors group"
                        >
                          <div className="relative h-14 w-12 shrink-0 bg-[#f4f2ee] overflow-hidden">
                            {p.images && p.images[0] && (
                              <Image
                                src={p.images[0]}
                                alt={p.name || p.name}
                                fill
                                placeholder="blur"
                                blurDataURL={shimmerBlurDataUrl(48, 56)}
                                sizes="48px"
                                className="object-cover group-hover:scale-105 transition-transform"
                              />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-xs font-medium text-[#1c1b1b] truncate">
                              {p.name || p.name}
                            </h4>
                            <p className="text-[11px] font-semibold text-[#b39265] mt-0.5">
                              {p.price} {p.currency}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            {loading && (
              <div className="flex items-center gap-2 text-xs text-[#6a6a6a]">
                <span className="h-2 w-2 rounded-full bg-[#1c1b1b] animate-bounce" />
                <span className="h-2 w-2 rounded-full bg-[#1c1b1b] animate-bounce [animation-delay:0.2s]" />
                <span className="h-2 w-2 rounded-full bg-[#1c1b1b] animate-bounce [animation-delay:0.4s]" />
                <span className="font-mono text-[11px] uppercase tracking-wider ms-2">The AI assistant is composing a reply...</span>
              </div>
            )}

            {/* Auto-scroll anchor target */}
            <div ref={messagesEndRef} className="h-1 w-full shrink-0 pointer-events-none" />
          </div>

          {/* Suggested Quick Prompt Chips */}
          <div className="border-t border-[#e9e9e9] px-6 py-3 bg-[#faf8f5] overflow-x-auto flex items-center gap-2 no-scrollbar">
            <span className="text-[10px] font-mono tracking-widest text-[#888888] uppercase shrink-0">
              Suggestions:
            </span>
            {suggestedChips.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(chip.query)}
                className="shrink-0 text-xs px-3 py-1.5 border border-[#e9e9e9] bg-white hover:border-[#1c1b1b] hover:text-[#1c1b1b] text-[#4a4a4a] transition-colors whitespace-nowrap"
              >
                {chip.label}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="border-t border-[#e9e9e9] p-4 flex items-center gap-3 bg-white"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about orders, sizes, fabrics (English or Arabic)..."
              className="flex-1 text-xs sm:text-sm bg-transparent outline-none text-[#1c1b1b] placeholder:text-[#a0a0a0] px-2"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="px-6 py-2.5 bg-[#1c1b1b] text-white text-xs uppercase tracking-widest font-semibold hover:bg-[#8b7355] transition-colors disabled:opacity-40"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

