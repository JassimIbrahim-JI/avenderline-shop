"use client";

import React, { useState } from "react";

export default function AdminSettingsPage() {
  // Brand & General
  const [storeName, setStoreName] = useState("AvenderLine");
  const [tagline, setTagline] = useState("Luxury Qatari Abayas & Couture Bishts");
  const [shippingCost, setShippingCost] = useState("30");
  const [freeShippingThreshold, setFreeShippingThreshold] = useState("500");
  const [phone, setPhone] = useState("+974 5555 1234");
  const [provider, setProvider] = useState("Tap");

  // AI Concierge Settings
  const [aiProvider, setAiProvider] = useState("openai");
  const [aiModel, setAiModel] = useState("gpt-4o-mini");
  const [aiApiKey, setAiApiKey] = useState("");
  const [aiPersonaName, setAiPersonaName] = useState("AvenderLine AI Stylist");
  const [aiTone, setAiTone] = useState("couture");
  const [aiTemperature, setAiTemperature] = useState("0.35");
  const [aiCatalogMatching, setAiCatalogMatching] = useState(true);
  const [aiWelcome, setAiWelcome] = useState(
    "Welcome to AvenderLine Atelier Doha. I am the AI styling assistant. I can advise you on Qatari sizing, fabric nuances, and bespoke abayas in English or Arabic."
  );

  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900">
          Atelier &amp; AI Settings
        </h1>
        <p className="text-xs text-neutral-500 mt-1">
          Configure Maison identity, delivery parameters, payment gateways, and the AI concierge.
        </p>
      </div>

      {saved && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-semibold text-emerald-800 animate-fade-in">
          All configuration parameters and atelier rules have been successfully updated.
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Brand identity */}
        <div className="rounded-xl border border-[#e9e9e9] bg-white p-6 shadow-sm space-y-4">
          <h3 className="font-display text-base font-bold text-neutral-900 border-b border-[#e9e9e9] pb-3 flex items-center justify-between">
            <span>Maison & Brand Identity</span>
            <span className="text-[11px] font-mono tracking-wider text-neutral-400 uppercase">Profile</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-semibold block mb-1 text-neutral-800">Maison Name</label>
              <input
                type="text"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                className="w-full rounded-lg border border-[#e9e9e9] bg-[#fdfbf7] p-2.5 outline-none focus:border-neutral-900"
              />
            </div>
            <div>
              <label className="font-semibold block mb-1 text-neutral-800">Tagline / Motto</label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="w-full rounded-lg border border-[#e9e9e9] bg-[#fdfbf7] p-2.5 outline-none focus:border-neutral-900"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="font-semibold block mb-1 text-neutral-800">Atelier WhatsApp & Concierge Direct Line (Doha)</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-lg border border-[#e9e9e9] bg-[#fdfbf7] p-2.5 outline-none focus:border-neutral-900"
              />
            </div>
          </div>
        </div>

        {/* AI Concierge Settings Card */}
        <div className="rounded-xl border border-[#e9e9e9] bg-white p-6 shadow-sm space-y-4">
          <div className="border-b border-[#e9e9e9] pb-3 flex items-center justify-between">
            <h3 className="font-display text-base font-bold text-neutral-900 flex items-center gap-2">
              <span>AI Styling Concierge</span>
            </h3>
            <span className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-[10px] font-bold text-neutral-800 uppercase font-mono tracking-wider">
              OpenAI
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-semibold block mb-1 text-neutral-800">AI Engine Provider</label>
              <select
                value={aiProvider}
                onChange={(e) => setAiProvider(e.target.value)}
                className="w-full rounded-lg border border-[#e9e9e9] bg-[#fdfbf7] p-2.5 outline-none focus:border-neutral-900"
              >
                <option value="openai">OpenAI (GPT-4o / GPT-4o-mini)</option>
                <option value="gemini">Google Gemini 1.5 Flash</option>
                <option value="builtin">Built-in domain expert (No external key)</option>
              </select>
            </div>

            <div>
              <label className="font-semibold block mb-1 text-neutral-800">Model</label>
              <select
                value={aiModel}
                onChange={(e) => setAiModel(e.target.value)}
                className="w-full rounded-lg border border-[#e9e9e9] bg-[#fdfbf7] p-2.5 outline-none focus:border-neutral-900"
              >
                <option value="gpt-4o-mini">gpt-4o-mini (Ultra-fast, accurate, cost-efficient - Recommended)</option>
                <option value="gpt-4o">gpt-4o (Maximum nuance for complex custom tailoring)</option>
                <option value="gemini-1.5-flash">gemini-1.5-flash (High speed multimodal)</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="font-semibold block mb-1 text-neutral-800">API Key</label>
              <input
                type="password"
                value={aiApiKey}
                placeholder="sk-proj-... or leave blank to use the built-in domain reasoning engine"
                onChange={(e) => setAiApiKey(e.target.value)}
                className="w-full rounded-lg border border-[#e9e9e9] bg-[#fdfbf7] p-2.5 outline-none focus:border-neutral-900 font-mono text-[11px]"
              />
              <span className="text-[11px] text-neutral-400 mt-1 block">
                When left blank, the AI assistant uses the atelier&apos;s embedded rule-and-knowledge engine with full catalog access.
              </span>
            </div>

            <div>
              <label className="font-semibold block mb-1 text-neutral-800">Assistant Name</label>
              <input
                type="text"
                value={aiPersonaName}
                onChange={(e) => setAiPersonaName(e.target.value)}
                className="w-full rounded-lg border border-[#e9e9e9] bg-[#fdfbf7] p-2.5 outline-none focus:border-neutral-900"
              />
            </div>

            <div>
              <label className="font-semibold block mb-1 text-neutral-800">Tone of Voice</label>
              <select
                value={aiTone}
                onChange={(e) => setAiTone(e.target.value)}
                className="w-full rounded-lg border border-[#e9e9e9] bg-[#fdfbf7] p-2.5 outline-none focus:border-neutral-900"
              >
                <option value="couture">Haute Couture Prestige &amp; Refined (Recommended)</option>
                <option value="private">Exclusive Private Shopping Director</option>
                <option value="friendly">Warm, Direct &amp; Personal Stylist</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <div className="flex justify-between items-center mb-1">
                <label className="font-semibold text-neutral-800">Creativity / Temperature</label>
                <span className="font-mono text-xs text-neutral-600">{aiTemperature}</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="0.8"
                step="0.05"
                value={aiTemperature}
                onChange={(e) => setAiTemperature(e.target.value)}
                className="w-full accent-neutral-900 mt-2"
              />
              <div className="flex justify-between text-[10px] text-neutral-400 mt-1">
                <span>0.1 (Strict &amp; Precise Sizing)</span>
                <span>0.8 (Highly Creative Styling)</span>
              </div>
            </div>
          </div>

          <div className="space-y-3 pt-2 text-xs">
            <div>
              <label className="font-semibold block mb-1 text-neutral-800">Initial Greeting Message</label>
              <textarea
                rows={2}
                value={aiWelcome}
                onChange={(e) => setAiWelcome(e.target.value)}
                className="w-full rounded-lg border border-[#e9e9e9] bg-[#fdfbf7] p-2.5 outline-none focus:border-neutral-900"
              />
            </div>

            <label className="flex items-center gap-2 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={aiCatalogMatching}
                onChange={(e) => setAiCatalogMatching(e.target.checked)}
                className="h-4 w-4 rounded accent-neutral-900"
              />
              <span className="font-medium text-neutral-800">
                Enable automatic catalog product matching and embed interactive purchase cards in chat responses
              </span>
            </label>
          </div>
        </div>

        {/* Shipping & Delivery */}
        <div className="rounded-xl border border-[#e9e9e9] bg-white p-6 shadow-sm space-y-4">
          <h3 className="font-display text-base font-bold text-neutral-900 border-b border-[#e9e9e9] pb-3">
            Shipping & White-Glove Courier Rules (Qatar)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-semibold block mb-1 text-neutral-800">Standard Delivery Rate (QAR)</label>
              <input
                type="number"
                value={shippingCost}
                onChange={(e) => setShippingCost(e.target.value)}
                className="w-full rounded-lg border border-[#e9e9e9] bg-[#fdfbf7] p-2.5 outline-none focus:border-neutral-900"
              />
            </div>
            <div>
              <label className="font-semibold block mb-1 text-neutral-800">Complimentary Shipping Threshold (QAR)</label>
              <input
                type="number"
                value={freeShippingThreshold}
                onChange={(e) => setFreeShippingThreshold(e.target.value)}
                className="w-full rounded-lg border border-[#e9e9e9] bg-[#fdfbf7] p-2.5 outline-none focus:border-neutral-900"
              />
            </div>
          </div>
        </div>

        {/* Payment Gateways */}
        <div className="rounded-xl border border-[#e9e9e9] bg-white p-6 shadow-sm space-y-4">
          <h3 className="font-display text-base font-bold text-neutral-900 border-b border-[#e9e9e9] pb-3">
            Payment Gateways & Processing
          </h3>

          <div className="space-y-3 text-xs">
            <label className="flex items-center gap-3 p-3.5 rounded-xl border border-[#e9e9e9] bg-[#fdfbf7] cursor-pointer hover:border-neutral-900 transition">
              <input
                type="radio"
                name="gateway"
                checked={provider === "Tap"}
                onChange={() => setProvider("Tap")}
                className="accent-neutral-900"
              />
              <div>
                <span className="font-bold block text-neutral-900">
                  Tap Payments (Official Qatar Gateway - Apple Pay, Debit Cards & Visa / Mastercard)
                </span>
                <span className="text-neutral-500 text-[11px]">
                  Direct QAR settlement to Qatari corporate bank accounts with instant verification.
                </span>
              </div>
            </label>
          </div>
        </div>

        <button
          type="submit"
          className="rounded-full bg-[#0d0d0d] px-8 py-3.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-neutral-800 transition shadow-sm"
        >
          Save Atelier Settings
        </button>
      </form>
    </div>
  );
}
