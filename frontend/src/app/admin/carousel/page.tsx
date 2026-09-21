"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

interface CarouselSlide {
  id: number;
  imageUrl: string;
  tag: string;
  tagAr: string;
  title: string;
  titleAr: string;
  ctaText: string;
  ctaTextAr: string;
  ctaLink: string;
  objectPosition: string;
  active: boolean;
}

export default function AdminCarouselPage() {
  const [slides, setSlides] = useState<CarouselSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadingId, setUploadingId] = useState<number | null>(null);

  // Upload image from user's device
  const handleFileUpload = async (slideId: number, file: File) => {
    if (!file) return;
    setUploadingId(slideId);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.url) {
        handleUpdateSlide(slideId, "imageUrl", data.url);
      } else {
        alert(`Failed to upload: ${data.error || "Unknown error"}`);
      }
    } catch (err: any) {
      alert(`Upload error: ${err.message}`);
    } finally {
      setUploadingId(null);
    }
  };

  // Fetch slides from API
  const loadSlides = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/carousel?all=true");
      const data = await res.json();
      if (res.ok && data.slides) {
        setSlides(data.slides);
      } else {
        setError(data.error || "Failed to load carousel slides.");
      }
    } catch {
      setError("Network error connecting to carousel service.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSlides();
  }, []);

  // Update specific field on a slide
  const handleUpdateSlide = (id: number, field: keyof CarouselSlide, value: any) => {
    setSlides((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    );
  };

  // Move slide up / down
  const moveSlide = (index: number, direction: "up" | "down") => {
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= slides.length) return;

    const newSlides = [...slides];
    const [moved] = newSlides.splice(index, 1);
    newSlides.splice(targetIdx, 0, moved);
    setSlides(newSlides);
  };

  // Add new slide
  const handleAddSlide = () => {
    const newId = Math.max(0, ...slides.map((s) => s.id)) + 1;
    const newSlide: CarouselSlide = {
      id: newId,
      imageUrl: "https://images.unsplash.com/photo-1724412665971-114bd351a42d?auto=format&fit=crop&w=2400&q=90",
      tag: "NEW SEASON CAPSULE",
      tagAr: "ÙƒÙˆÙ„ÙƒØ´Ù† Ø§Ù„Ù…ÙˆØ³Ù… Ø§Ù„Ø¬Ø¯ÙŠØ¯",
      title: "LUXURY QATARI COUTURE",
      titleAr: "ÙƒÙˆØªÙˆØ± Ù‚Ø·Ø±ÙŠ ÙØ§Ø®Ø±",
      ctaText: "EXPLORE CREATIONS",
      ctaTextAr: "Ø§ÙƒØªØ´ÙÙŠ Ø§Ù„ØªØµØ§Ù…ÙŠÙ…",
      ctaLink: "/collections/occasions",
      objectPosition: "center top",
      active: true,
    };
    setSlides([...slides, newSlide]);
  };

  // Delete slide
  const handleDeleteSlide = (id: number) => {
    if (slides.length <= 1) {
      alert("At least one slide must remain in the hero carousel.");
      return;
    }
    if (!confirm("Are you sure you want to remove this slide from the storefront?")) return;
    setSlides((prev) => prev.filter((s) => s.id !== id));
  };

  // Save all changes to API
  const handleSaveAll = async () => {
    setSaving(true);
    setSaveSuccess(false);
    setError(null);

    try {
      const res = await fetch("/api/carousel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slides }),
      });

      const data = await res.json();
      if (res.ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 4000);
      } else {
        setError(data.error || "Failed to save changes.");
      }
    } catch (err: any) {
      setError(err.message || "Error saving carousel configuration.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-6xl pb-16">
      {/* Header & Main Save Action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#e9e9e9] pb-6">
        <div>
          <h1 className="font-display text-2xl font-bold uppercase tracking-wider text-[#1c1b1b]">
            Hero Carousel & Banners Manager
          </h1>
          <p className="mt-1 text-xs text-[#6a6a6a]">
            Ø¥Ø¯Ø§Ø±Ø© ØµÙˆØ± Ø§Ù„ÙˆØ§Ø¬Ù‡Ø© Ø§Ù„Ø±Ø¦ÙŠØ³ÙŠØ©ØŒ Ø¶Ø¨Ø· Ø²Ø§ÙˆÙŠØ© Ø§Ù„Ø±Ø£Ø³ ÙˆØ§Ù„Ø´ÙŠÙ„Ø©ØŒ ÙˆØªØ­Ø¯ÙŠØ« Ø§Ù„Ø¹Ù†Ø§ÙˆÙŠÙ† ÙˆØ­Ù…Ù„Ø§Øª Ø§Ù„Ù…ÙˆØ§Ø³Ù….
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleAddSlide}
            className="border border-[#1c1b1b] bg-white px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#1c1b1b] hover:bg-[#faf8f5] transition shadow-xs"
          >
            + Add New Slide (Ø¥Ø¶Ø§ÙØ© Ø´Ø±ÙŠØ­Ø©)
          </button>
          <button
            type="button"
            disabled={saving}
            onClick={handleSaveAll}
            className="bg-[#1c1b1b] text-white px-6 py-2 text-xs font-semibold uppercase tracking-wider hover:bg-[#8b7355] transition shadow-xs disabled:opacity-50"
          >
            {saving ? "Saving Changes..." : "Save All Changes (Ø­ÙØ¸ Ø§Ù„ØªØ¹Ø¯ÙŠÙ„Ø§Øª)"}
          </button>
        </div>
      </div>

      {/* Save Notifications */}
      {saveSuccess && (
        <div className="rounded border border-emerald-200 bg-emerald-50 p-4 text-xs font-semibold text-emerald-800 animate-fade-in flex items-center justify-between">
          <span>âœ“ ØªÙ… Ø­ÙØ¸ ÙƒØ§ÙØ© ØªØ¹Ø¯ÙŠÙ„Ø§Øª Ø§Ù„Ø³Ù„Ø§ÙŠØ¯Ø± Ø¨Ù†Ø¬Ø§Ø­ ÙˆØªØ­Ø¯ÙŠØ«Ù‡Ø§ ÙÙŠ Ø§Ù„ØµÙØ­Ø© Ø§Ù„Ø±Ø¦ÙŠØ³ÙŠØ© ÙÙˆØ±Ø§Ù‹!</span>
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="underline text-emerald-900 text-[11px] font-bold"
          >
            View Live Storefront â†—
          </a>
        </div>
      )}

      {error && (
        <div className="rounded border border-red-200 bg-red-50 p-4 text-xs text-red-700">
          âš ï¸ {error}
        </div>
      )}

      {loading ? (
        <div className="p-12 text-center text-xs text-[#888888]">Loading carousel editor...</div>
      ) : (
        <div className="space-y-6">
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className={`border border-[#e9e9e9] bg-white p-6 shadow-xs transition-all ${
                !slide.active ? "opacity-60 bg-gray-50/50" : ""
              }`}
            >
              {/* Slide Header Toolbar */}
              <div className="flex items-center justify-between border-b border-[#e9e9e9] pb-4 mb-6">
                <div className="flex items-center gap-3">
                  <span className="flex h-6 w-6 items-center justify-center bg-[#1c1b1b] text-[11px] font-bold text-white">
                    {index + 1}
                  </span>
                  <div>
                    <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-[#1c1b1b]">
                      Slide {index + 1}: {slide.title || "Untitled Creation"}
                    </h3>
                    <span className="text-[11px] text-[#888888]">
                      {slide.active ? "âœ“ Active on storefront" : "â¸ Hidden / Inactive"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={index === 0}
                    onClick={() => moveSlide(index, "up")}
                    className="p-1.5 text-xs text-[#666666] hover:text-black disabled:opacity-30"
                    title="Move Up"
                  >
                    â–²
                  </button>
                  <button
                    type="button"
                    disabled={index === slides.length - 1}
                    onClick={() => moveSlide(index, "down")}
                    className="p-1.5 text-xs text-[#666666] hover:text-black disabled:opacity-30"
                    title="Move Down"
                  >
                    â–¼
                  </button>
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-[#1c1b1b] ms-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={slide.active}
                      onChange={(e) => handleUpdateSlide(slide.id, "active", e.target.checked)}
                      className="accent-[#1c1b1b] h-3.5 w-3.5"
                    />
                    <span>Active</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => handleDeleteSlide(slide.id)}
                    className="text-xs text-red-600 hover:text-red-800 font-semibold ms-4 uppercase tracking-wider"
                  >
                    Delete
                  </button>
                </div>
              </div>

              {/* Grid: Preview Column & Edit Form */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Visual Live Preview Box (4 Cols) */}
                <div className="lg:col-span-4 space-y-2">
                  <label className="block text-xs uppercase tracking-wider font-semibold text-[#1c1b1b]">
                    Live Visual Preview (Ø§Ù„Ù…Ø¹Ø§ÙŠÙ†Ø© Ø§Ù„Ø­ÙŠØ©)
                  </label>
                  <div
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      const file = e.dataTransfer.files?.[0];
                      if (file) handleFileUpload(slide.id, file);
                    }}
                    className="relative h-64 sm:h-72 w-full rounded border border-[#e2dbcd] bg-[#111111] overflow-hidden shadow-inner group"
                  >
                    {slide.imageUrl ? (
                      <Image
                        src={slide.imageUrl}
                        alt={slide.title || "Preview"}
                        fill
                        unoptimized
                        className="object-cover transition-opacity duration-300"
                        style={{ objectPosition: slide.objectPosition || "center top" }}
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-xs text-[#888888]">
                        No Image
                      </div>
                    )}

                    {/* Drag & Drop overlay prompt */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                      <span className="text-[11px] text-white bg-black/70 px-3 py-1.5 rounded uppercase tracking-wider font-semibold">
                        Drag & Drop image here
                      </span>
                    </div>

                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-4 text-white text-center pointer-events-none">
                      <p className="text-[9px] font-mono tracking-widest text-[#e8dfcf] uppercase">
                        {slide.tag || "TAGLINE"}
                      </p>
                      <p className="text-xs font-display font-medium tracking-wider uppercase truncate mt-0.5">
                        {slide.title || "HEADLINE TITLE"}
                      </p>
                    </div>
                  </div>
                  <span className="text-[10.5px] text-[#888888] block text-center">
                    Focal position: <strong className="font-mono text-[#1c1b1b]">{slide.objectPosition}</strong>
                  </span>
                </div>

                {/* Form Fields (8 Cols) */}
                <div className="lg:col-span-8 space-y-4 text-xs">
                  {/* Image Upload & Focal Position Controls */}
                  <div className="rounded border border-[#ede7dc] bg-[#fdfbf7] p-4 space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                      <div>
                        <label className="block font-semibold text-[#1c1b1b] uppercase tracking-wider mb-1.5">
                          Slide Imagery (ØµÙˆØ±Ø© Ø§Ù„Ø¹Ø¨Ø§ÙŠØ©) <span className="text-red-500">*</span>
                        </label>

                        {/* Hidden native file input */}
                        <input
                          type="file"
                          id={`slide-file-${slide.id}`}
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleFileUpload(slide.id, file);
                          }}
                        />

                        {/* Luxury Upload Button */}
                        <button
                          type="button"
                          disabled={uploadingId === slide.id}
                          onClick={() => document.getElementById(`slide-file-${slide.id}`)?.click()}
                          className="flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-[#1c1b1b] text-white rounded text-xs font-semibold uppercase tracking-wider hover:bg-[#8b7355] transition disabled:opacity-50 shadow-xs"
                        >
                          {uploadingId === slide.id ? (
                            <>
                              <span className="h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              <span>Ø¬Ø§Ø±ÙŠ Ø±ÙØ¹ Ø§Ù„ØµÙˆØ±Ø© Ù…Ù† Ø§Ù„Ø¬Ù‡Ø§Ø²...</span>
                            </>
                          ) : (
                            <>
                              <span>ðŸ“¸</span>
                              <span>Ø±ÙØ¹ ØµÙˆØ±Ø© Ù…Ù† Ø¬Ù‡Ø§Ø²Ùƒ (Upload Image)</span>
                            </>
                          )}
                        </button>
                      </div>

                      <div>
                        <label className="block font-semibold text-[#1c1b1b] uppercase tracking-wider mb-1.5">
                          Head & Focal Position (Ø²Ø§ÙˆÙŠØ© Ø§Ù„Ø±Ø£Ø³)
                        </label>
                        <select
                          value={slide.objectPosition}
                          onChange={(e) => handleUpdateSlide(slide.id, "objectPosition", e.target.value)}
                          className="w-full border border-[#e9e9e9] bg-white px-3 py-2.5 text-xs text-[#1c1b1b] outline-none focus:border-[#1c1b1b] font-medium"
                        >
                          <option value="center top">Center Top (Ø§Ù„Ø±Ø£Ø³ ÙˆØ§Ù„Ø´ÙŠÙ„Ø© Ø¨Ø§Ù„Ø£Ø¹Ù„Ù‰ - Ù…ÙˆØµÙ‰ Ø¨Ù‡)</option>
                          <option value="center 10%">Center 10% (Ù‚Ø±ÙŠØ¨ Ø¬Ø¯Ø§Ù‹ Ù…Ù† Ø§Ù„Ù‚Ù…Ø©)</option>
                          <option value="center 20%">Center 20% (Ù…Ù†Ø·Ù‚Ø© Ø§Ù„ÙˆØ¬Ù‡ ÙˆØ§Ù„ØµØ¯Ø±)</option>
                          <option value="center center">Center Center (Ù…Ù†ØªØµÙ Ø§Ù„ØµÙˆØ±Ø©)</option>
                          <option value="center 70%">Center 70% (ØªØ±ÙƒÙŠØ² Ø¹Ù„Ù‰ Ù‚ØµØ© Ø§Ù„Ø¹Ø¨Ø§ÙŠØ© Ø§Ù„Ø³ÙÙ„ÙŠØ©)</option>
                        </select>
                      </div>
                    </div>

                    {/* Alternative: Image URL Input */}
                    <div>
                      <label className="block text-[11px] text-[#777777] mb-1">
                        Ø£Ùˆ Ø±Ø§Ø¨Ø· ØµÙˆØ±Ø© Ù…Ø¨Ø§Ø´Ø± (Or paste external image URL):
                      </label>
                      <input
                        type="url"
                        value={slide.imageUrl}
                        onChange={(e) => handleUpdateSlide(slide.id, "imageUrl", e.target.value)}
                        placeholder="https://... or /uploads/..."
                        className="w-full border border-[#e9e9e9] bg-white px-3 py-1.5 text-xs text-[#1c1b1b] outline-none focus:border-[#1c1b1b] font-mono"
                      />
                    </div>
                  </div>

                  {/* Eyebrows / Taglines */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold text-[#1c1b1b] uppercase tracking-wider mb-1">
                        Eyebrow Tag (English)
                      </label>
                      <input
                        type="text"
                        value={slide.tag}
                        onChange={(e) => handleUpdateSlide(slide.id, "tag", e.target.value)}
                        placeholder="e.g. HAUTE COUTURE Â· SUMMER 2026"
                        className="w-full border border-[#e9e9e9] bg-[#faf8f5] px-3.5 py-2 text-xs text-[#1c1b1b] outline-none focus:border-[#1c1b1b]"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-[#1c1b1b] uppercase tracking-wider mb-1">
                        Ø§Ù„Ù†Øµ Ø§Ù„ØªØ¹Ø±ÙŠÙÙŠ Ø§Ù„Ø¹Ù„ÙˆÙŠ (Ø¹Ø±Ø¨ÙŠ)
                      </label>
                      <input
                        type="text"
                        dir="rtl"
                        value={slide.tagAr}
                        onChange={(e) => handleUpdateSlide(slide.id, "tagAr", e.target.value)}
                        placeholder="Ù…Ø«Ø§Ù„: Ù‡ÙˆØª ÙƒÙˆØªÙˆØ± Â· ØµÙŠÙ 2026"
                        className="w-full border border-[#e9e9e9] bg-[#faf8f5] px-3.5 py-2 text-xs text-[#1c1b1b] outline-none focus:border-[#1c1b1b]"
                      />
                    </div>
                  </div>

                  {/* Main Headlines */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold text-[#1c1b1b] uppercase tracking-wider mb-1">
                        Main Headline (English)
                      </label>
                      <input
                        type="text"
                        value={slide.title}
                        onChange={(e) => handleUpdateSlide(slide.id, "title", e.target.value)}
                        placeholder="e.g. TIMELESS COUTURE ELEGANCE"
                        className="w-full border border-[#e9e9e9] bg-[#faf8f5] px-3.5 py-2 text-xs text-[#1c1b1b] outline-none focus:border-[#1c1b1b] font-semibold"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-[#1c1b1b] uppercase tracking-wider mb-1">
                        Ø§Ù„Ø¹Ù†ÙˆØ§Ù† Ø§Ù„Ø±Ø¦ÙŠØ³ÙŠ (Ø¹Ø±Ø¨ÙŠ)
                      </label>
                      <input
                        type="text"
                        dir="rtl"
                        value={slide.titleAr}
                        onChange={(e) => handleUpdateSlide(slide.id, "titleAr", e.target.value)}
                        placeholder="Ù…Ø«Ø§Ù„: Ø£Ù†Ø§Ù‚Ø© Ø§Ù„ÙƒÙˆØªÙˆØ± Ø§Ù„Ø®Ø§Ù„Ø¯Ø©"
                        className="w-full border border-[#e9e9e9] bg-[#faf8f5] px-3.5 py-2 text-xs text-[#1c1b1b] outline-none focus:border-[#1c1b1b] font-semibold"
                      />
                    </div>
                  </div>

                  {/* CTA Text & Destination Link */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block font-semibold text-[#1c1b1b] uppercase tracking-wider mb-1">
                        Button Label (English)
                      </label>
                      <input
                        type="text"
                        value={slide.ctaText}
                        onChange={(e) => handleUpdateSlide(slide.id, "ctaText", e.target.value)}
                        placeholder="e.g. EXPLORE COLLECTION"
                        className="w-full border border-[#e9e9e9] bg-[#faf8f5] px-3.5 py-2 text-xs text-[#1c1b1b] outline-none focus:border-[#1c1b1b]"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-[#1c1b1b] uppercase tracking-wider mb-1">
                        Ù†Øµ Ø§Ù„Ø²Ø± (Ø¹Ø±Ø¨ÙŠ)
                      </label>
                      <input
                        type="text"
                        dir="rtl"
                        value={slide.ctaTextAr}
                        onChange={(e) => handleUpdateSlide(slide.id, "ctaTextAr", e.target.value)}
                        placeholder="Ù…Ø«Ø§Ù„: Ø§ÙƒØªØ´ÙÙŠ Ø§Ù„ØªØ´ÙƒÙŠÙ„Ø©"
                        className="w-full border border-[#e9e9e9] bg-[#faf8f5] px-3.5 py-2 text-xs text-[#1c1b1b] outline-none focus:border-[#1c1b1b]"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-[#1c1b1b] uppercase tracking-wider mb-1">
                        Destination Link (Ø§Ù„Ø±Ø§Ø¨Ø·)
                      </label>
                      <input
                        type="text"
                        value={slide.ctaLink}
                        onChange={(e) => handleUpdateSlide(slide.id, "ctaLink", e.target.value)}
                        placeholder="e.g. /collections/occasions"
                        className="w-full border border-[#e9e9e9] bg-[#faf8f5] px-3.5 py-2 text-xs text-[#1c1b1b] outline-none focus:border-[#1c1b1b] font-mono"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

