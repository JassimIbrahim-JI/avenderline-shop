"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { demoProducts, demoCategories } from "@/lib/demo";
import type { Product } from "@/lib/api";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>(demoProducts);
  const [search, setSearch] = useState("");
  const [addModalOpen, setAddModalOpen] = useState(false);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [comparePrice, setComparePrice] = useState("");
  const [categoryId, setCategoryId] = useState("cat-women");
  const [fabric, setFabric] = useState("Korean Royal Super-Black Crepe");
  const [cut, setCut] = useState("Royal Fluid Cloche");
  const [imageUrl, setImageUrl] = useState("");
  const [stock, setStock] = useState("20");

  const filtered = products.filter(
    (p) =>
      p.name.includes(search) ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase())
  );

  const handleToggleAvailable = (id: string) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isAvailable: !p.isAvailable } : p))
    );
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to remove this creation from the active catalog?")) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
    }
  };

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const newProduct: Product = {
      id: `p-${Date.now()}`,
      name: name || "Untitled Abaya",
      slug: (name || "abaya").toLowerCase().replace(/\s+/g, "-") + `-${Date.now().toString().slice(-4)}`,
      sku: `AVL-${Math.floor(100 + Math.random() * 900)}`,
      description: `Haute couture creation tailored from ${fabric} with an elegant ${cut}.`,
      price: parseFloat(price) || 500,
      compareAtPrice: comparePrice ? parseFloat(comparePrice) : undefined,
      currency: "QAR",
      stockQuantity: parseInt(stock) || 10,
      isAvailable: true,
      isFeatured: true,
      categoryId,
      categoryName: demoCategories.find((c) => c.id === categoryId)?.name ?? "Women",
      fabric,
      cut,
      sizes: ["52", "54", "56", "58"],
      images: [
        imageUrl.trim() ||
          "https://images.unsplash.com/photo-1772474500365-c2c520545f44?auto=format&fit=crop&w=1000&q=85",
      ],
      tag: "Atelier New Arrival",
    };

    setProducts([newProduct, ...products]);
    setAddModalOpen(false);
    setName("");
    setPrice("");
    setComparePrice("");
    setImageUrl("");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-semibold uppercase tracking-wider text-[#1c1b1b]">
            Creations & Catalog Management
          </h1>
          <p className="text-xs text-[#6a6a6a] mt-1">
            Add new designs, adjust pricing in QAR, manage inventory levels and showcase visibility.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setAddModalOpen(true)}
            className="bg-[#1c1b1b] text-white px-5 py-2.5 text-xs uppercase tracking-wider font-semibold hover:bg-[#3a3a3a] transition-colors"
          >
            + Add New Creation
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <input
          type="text"
          placeholder="Search by name or SKU..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-80 border border-[#e9e9e9] bg-white p-2.5 text-xs outline-none focus:border-[#1c1b1b]"
        />
        <div className="text-xs text-[#6a6a6a]">
          Showing {filtered.length} of {products.length} creations
        </div>
      </div>

      <div className="border border-[#e9e9e9] bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-[#faf8f5] text-[#6a6a6a] uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">Creation</th>
                <th className="px-4 py-3 text-left font-semibold">Category</th>
                <th className="px-4 py-3 text-left font-semibold">Price</th>
                <th className="px-4 py-3 text-left font-semibold">Stock</th>
                <th className="px-4 py-3 text-left font-semibold">Status</th>
                <th className="px-4 py-3 text-left font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e9e9e9]">
              {filtered.map((product) => (
                <tr key={product.id} className="hover:bg-[#faf8f5] transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-12 flex-shrink-0 overflow-hidden bg-[#faf8f5]">
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          fill
                          className="object-cover"
                          sizes="40px"
                        />
                      </div>
                      <div>
                        <div className="font-semibold text-[#1c1b1b]">{product.name}</div>
                        <div className="text-[#6a6a6a] mt-0.5">{product.sku}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[#6a6a6a]">{product.categoryName}</td>
                  <td className="px-4 py-3 font-semibold">
                    {product.price.toLocaleString()} {product.currency}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex px-2 py-0.5 text-[10px] uppercase tracking-wider font-semibold ${
                        product.stockQuantity > 10
                          ? "bg-green-50 text-green-700"
                          : product.stockQuantity > 0
                          ? "bg-amber-50 text-amber-700"
                          : "bg-red-50 text-red-700"
                      }`}
                    >
                      {product.stockQuantity} pcs
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleToggleAvailable(product.id)}
                      className={`inline-flex px-2 py-0.5 text-[10px] uppercase tracking-wider font-semibold ${
                        product.isAvailable
                          ? "bg-[#1c1b1b] text-white"
                          : "bg-[#e9e9e9] text-[#6a6a6a]"
                      }`}
                    >
                      {product.isAvailable ? "Visible" : "Hidden"}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Link
                        href={`/products/${product.slug}`}
                        className="text-[#1c1b1b] hover:underline font-semibold"
                      >
                        View
                      </Link>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="text-red-700 hover:underline font-semibold"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {addModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="flex items-center justify-between border-b border-[#e9e9e9] p-6">
              <h3 className="font-display text-lg font-semibold uppercase tracking-wider text-[#1c1b1b]">
                Add New Creation to Catalog
              </h3>
              <button
                onClick={() => setAddModalOpen(false)}
                className="h-8 w-8 flex items-center justify-center text-[#888888] hover:text-[#1c1b1b] text-lg"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleAddProduct} className="space-y-4 text-xs p-6">
              <div>
                <label className="font-semibold uppercase tracking-wider block mb-1.5 text-[#1c1b1b]">Title *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Royal Evening Abaya"
                  className="w-full border border-[#e9e9e9] bg-[#faf8f5] p-2.5 text-xs outline-none focus:border-[#1c1b1b]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="font-semibold uppercase tracking-wider block mb-1.5 text-[#1c1b1b]">Price (QAR) *</label>
                  <input
                    type="number"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="750"
                    className="w-full border border-[#e9e9e9] bg-[#faf8f5] p-2.5 text-xs outline-none focus:border-[#1c1b1b]"
                  />
                </div>
                <div>
                  <label className="font-semibold uppercase tracking-wider block mb-1.5 text-[#1c1b1b]">Compare At Price</label>
                  <input
                    type="number"
                    value={comparePrice}
                    onChange={(e) => setComparePrice(e.target.value)}
                    placeholder="900"
                    className="w-full border border-[#e9e9e9] bg-[#faf8f5] p-2.5 text-xs outline-none focus:border-[#1c1b1b]"
                  />
                </div>
                <div>
                  <label className="font-semibold uppercase tracking-wider block mb-1.5 text-[#1c1b1b]">Initial Inventory</label>
                  <input
                    type="number"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    placeholder="15"
                    className="w-full border border-[#e9e9e9] bg-[#faf8f5] p-2.5 text-xs outline-none focus:border-[#1c1b1b]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="font-semibold uppercase tracking-wider block mb-1.5 text-[#1c1b1b]">Collection</label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full border border-[#e9e9e9] bg-[#faf8f5] p-2.5 text-xs outline-none focus:border-[#1c1b1b]"
                  >
                    {demoCategories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-semibold uppercase tracking-wider block mb-1.5 text-[#1c1b1b]">Fabric Type</label>
                  <input
                    type="text"
                    value={fabric}
                    onChange={(e) => setFabric(e.target.value)}
                    placeholder="Korean Royal Crepe"
                    className="w-full border border-[#e9e9e9] bg-[#faf8f5] p-2.5 text-xs outline-none focus:border-[#1c1b1b]"
                  />
                </div>
                <div>
                  <label className="font-semibold uppercase tracking-wider block mb-1.5 text-[#1c1b1b]">Silhouette / Cut</label>
                  <input
                    type="text"
                    value={cut}
                    onChange={(e) => setCut(e.target.value)}
                    placeholder="Royal Fluid Cloche"
                    className="w-full border border-[#e9e9e9] bg-[#faf8f5] p-2.5 text-xs outline-none focus:border-[#1c1b1b]"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold uppercase tracking-wider block mb-1.5 text-[#1c1b1b]">Editorial Image URL</label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full border border-[#e9e9e9] bg-[#faf8f5] p-2.5 text-xs outline-none focus:border-[#1c1b1b]"
                />
                <p className="text-[10px] text-[#888] mt-1">Leave empty to use the atelier default image.</p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2 border-t border-[#e9e9e9] mt-4">
                <button
                  type="button"
                  onClick={() => setAddModalOpen(false)}
                  className="px-4 py-2 text-xs uppercase tracking-wider font-semibold text-[#6a6a6a] hover:text-[#1c1b1b]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#1c1b1b] text-white px-5 py-2.5 text-xs uppercase tracking-wider font-semibold hover:bg-[#3a3a3a] transition-colors"
                >
                  Save Creation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
