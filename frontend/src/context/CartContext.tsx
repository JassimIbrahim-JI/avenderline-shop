"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import type { Product } from "@/lib/api";

export interface CartItem {
  product: Product;
  quantity: number;
  size: string;
  closure?: string; // "Concealed Snaps" | "Wrap" | "Open Front"
  customNotes?: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, size?: string, quantity?: number, options?: { closure?: string; customNotes?: string }) => void;
  removeItem: (productId: string, size: string) => void;
  updateQuantity: (productId: string, size: string, quantity: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  itemsCount: number;
  subtotal: number;
  freeShippingThreshold: number;
  amountToFreeShipping: number;
  shippingCost: number;
  total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // Free shipping threshold in QAR
  const freeShippingThreshold = 500;
  const standardShippingCost = 30;

  // Load cart from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("avenderline_cart");
      if (saved) {
        setItems(JSON.parse(saved));
      }
    } catch {
      // Ignore localStorage errors
    }
    setLoaded(true);
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    if (loaded) {
      try {
        localStorage.setItem("avenderline_cart", JSON.stringify(items));
      } catch {
        // Ignore localStorage errors
      }
    }
  }, [items, loaded]);

  const addItem = (
    product: Product,
    size: string = "54",
    quantity: number = 1,
    options?: { closure?: string; customNotes?: string }
  ) => {
    setItems((prev) => {
      const existingIdx = prev.findIndex(
        (i) => i.product.id === product.id && i.size === size
      );
      if (existingIdx > -1) {
        const updated = [...prev];
        updated[existingIdx].quantity += quantity;
        if (options?.closure) updated[existingIdx].closure = options.closure;
        if (options?.customNotes) updated[existingIdx].customNotes = options.customNotes;
        return updated;
      }
      return [
        ...prev,
        {
          product,
          quantity,
          size,
          closure: options?.closure ?? "Concealed Snaps",
          customNotes: options?.customNotes,
        },
      ];
    });
    setIsCartOpen(true);
  };

  const removeItem = (productId: string, size: string) => {
    setItems((prev) => prev.filter((i) => !(i.product.id === productId && i.size === size)));
  };

  const updateQuantity = (productId: string, size: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId, size);
      return;
    }
    setItems((prev) =>
      prev.map((i) => {
        if (i.product.id === productId && i.size === size) {
          return { ...i, quantity };
        }
        return i;
      })
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);
  const toggleCart = () => setIsCartOpen((v) => !v);

  const itemsCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const amountToFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const shippingCost = subtotal >= freeShippingThreshold || itemsCount === 0 ? 0 : standardShippingCost;
  const total = subtotal + shippingCost;

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        isCartOpen,
        openCart,
        closeCart,
        toggleCart,
        itemsCount,
        subtotal,
        freeShippingThreshold,
        amountToFreeShipping,
        shippingCost,
        total,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}


