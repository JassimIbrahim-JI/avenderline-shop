// API client for AvenderLine backend (.NET 8 defaults to port 5246 in local dev)
const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5246/api";

export interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  description?: string;
  price: number;
  compareAtPrice?: number;
  currency: string;
  stockQuantity: number;
  isAvailable: boolean;
  isFeatured: boolean;
  categoryId: string;
  categoryName?: string;
  images: string[];
  sizes?: string[];
  fabric?: string;
  cut?: string;
  sheilaIncluded?: boolean;
  tag?: string;
}

export interface ProductList {
  items: Product[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  imageUrl?: string;
  description?: string;
}

export interface StoreSettings {
  storeName: string;
  logoUrl?: string;
  tagline?: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  themeMode: string;
  defaultLanguage: string;
  currency: string;
  shippingCost?: number;
  freeShippingThreshold?: number;
}

export interface AuthResponse {
  token: string;
  email: string;
  roles: string[];
}

export interface OrderItem {
  productId: string;
  productName: string;
  sku: string;
  variantName?: string;
  imageUrl?: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  status: string;
  subtotal: number;
  shippingCost: number;
  discount: number;
  tax: number;
  total: number;
  currency: string;
  createdAt: string;
  items: OrderItem[];
  shippingAddress?: {
    fullName: string;
    phone: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    country: string;
    postalCode?: string;
  };
}

export interface CheckoutPayload {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  postalCode?: string;
  notes?: string;
  paymentMethod?: string;
}

async function request<T>(path: string, init?: RequestInit, token?: string): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(init?.headers as Record<string, string> || {}),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers,
    cache: "no-store",
  });

  if (!res.ok) {
    let message = `API error ${res.status}`;
    try {
      const err = await res.json();
      message = typeof err === "string" ? err : JSON.stringify(err);
    } catch {
      // Ignore text parse errors
    }
    throw new Error(message);
  }

  return res.json();
}

export const api = {
  // Catalog
  getProducts: (params?: Record<string, string | number | boolean | undefined>) => {
    const qs = new URLSearchParams();
    Object.entries(params ?? {}).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== "") qs.set(k, String(v));
    });
    const s = qs.toString();
    return request<ProductList>(`/products${s ? `?${s}` : ""}`);
  },

  getProductBySlug: (slug: string) => request<Product>(`/products/slug/${slug}`),
  getCategories: () => request<Category[]>("/categories"),
  getSettings: () => request<StoreSettings>("/settings"),

  // AI Concierge
  askConcierge: (
    message: string,
    customerContext?: any,
    token?: string
  ) =>
    request<{ reply: string; suggestedProducts?: Product[] }>(
      "/concierge/ask",
      {
        method: "POST",
        body: JSON.stringify({ message, customerContext }),
      },
      token
    ),

  // Auth
  login: (credentials: { email: string; password: string }) =>
    request<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    }),

  register: (data: { email: string; password: string; fullName: string }) =>
    request<AuthResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // Orders
  checkout: (payload: CheckoutPayload, token?: string) =>
    request<Order>("/orders/checkout", {
      method: "POST",
      body: JSON.stringify(payload),
    }, token),

  getMyOrders: (token: string) => request<Order[]>("/orders", {}, token),
  getOrderByNumber: (orderNumber: string) => request<Order>(`/orders/${orderNumber}`),

  // Admin
  getAllOrdersAdmin: (token: string) => request<Order[]>("/orders/admin/all", {}, token),
  updateOrderStatusAdmin: (orderId: string, status: string, note?: string, token?: string) =>
    request<Order>(`/orders/${orderId}/status`, {
      method: "PUT",
      body: JSON.stringify({ status, note }),
    }, token),

  createProductAdmin: (data: Partial<Product>, token: string) =>
    request<Product>("/products", {
      method: "POST",
      body: JSON.stringify(data),
    }, token),

  updateProductAdmin: (id: string, data: Partial<Product>, token: string) =>
    request<Product>(`/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }, token),

  deleteProductAdmin: (id: string, token: string) =>
    request<void>(`/products/${id}`, {
      method: "DELETE",
    }, token),

  updateSettingsAdmin: (data: Partial<StoreSettings>, token: string) =>
    request<StoreSettings>("/settings", {
      method: "PUT",
      body: JSON.stringify(data),
    }, token),
};

