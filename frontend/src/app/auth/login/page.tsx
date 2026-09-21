"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await login(email, password);
      if (email.toLowerCase().includes("admin")) {
        router.push("/admin");
      } else {
        router.push("/account");
      }
    } catch {
      setError("Invalid email address or password. Please verify your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto max-w-md px-6 py-16 sm:py-24">
      <div className="border border-[#e9e9e9] bg-white p-8 sm:p-10 shadow-xs relative">
        <div className="text-center mb-8">
          <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#b39265] block font-semibold mb-2">
            Maison Client Portal
          </span>
          <h1 className="font-display text-2xl sm:text-3xl font-semibold uppercase tracking-wider text-[#1c1b1b]">
            Sign In
          </h1>
          <p className="mt-2.5 text-xs text-[#6a6a6a] leading-relaxed">
            Please enter your e-mail and password to access your atelier account:
          </p>
        </div>

        {error && (
          <div className="mb-6 border border-red-200 bg-red-50 p-3 text-xs text-red-700 animate-fade-in">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email */}
          <div className="relative group">
            {/* Dreamy Luxury Tooltip */}
            <div className="absolute -top-9 start-0 z-20 pointer-events-none opacity-0 translate-y-1 transition-all duration-300 ease-out group-hover:opacity-100 group-hover:translate-y-0 group-focus-within:opacity-100 group-focus-within:translate-y-0">
              <div className="relative bg-[#1c1b1b] text-white text-[11px] font-normal tracking-wide py-1.5 px-3 rounded-xs shadow-[0_10px_25px_-5px_rgba(0,0,0,0.4),0_0_15px_rgba(179,146,101,0.25)] border border-[#b39265]/40 whitespace-nowrap flex items-center gap-1.5 backdrop-blur-md">
                <span className="text-[#b39265] text-xs">âœ¦</span>
                <span>Enter your registered email address</span>
                <div className="absolute -bottom-1 start-4 h-2 w-2 rotate-45 bg-[#1c1b1b] border-b border-r border-[#b39265]/40" />
              </div>
            </div>

            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[11px] uppercase tracking-wider font-semibold text-[#1c1b1b]">
                Email Address
              </label>
              <span className="text-[10px] text-[#b39265] font-mono tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">
                Atelier Client
              </span>
            </div>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@domain.com"
              className="w-full border border-[#e9e9e9] bg-[#faf8f5]/50 px-4 py-3 text-xs outline-none text-[#1c1b1b] transition-all duration-300 hover:border-[#b39265] hover:bg-white hover:shadow-[0_0_15px_rgba(179,146,101,0.12)] focus:border-[#1c1b1b] focus:bg-white"
            />
          </div>

          {/* Password */}
          <div className="relative group">
            {/* Dreamy Luxury Tooltip */}
            <div className="absolute -top-9 start-0 z-20 pointer-events-none opacity-0 translate-y-1 transition-all duration-300 ease-out group-hover:opacity-100 group-hover:translate-y-0 group-focus-within:opacity-100 group-focus-within:translate-y-0">
              <div className="relative bg-[#1c1b1b] text-white text-[11px] font-normal tracking-wide py-1.5 px-3 rounded-xs shadow-[0_10px_25px_-5px_rgba(0,0,0,0.4),0_0_15px_rgba(179,146,101,0.25)] border border-[#b39265]/40 whitespace-nowrap flex items-center gap-1.5 backdrop-blur-md">
                <span className="text-[#b39265] text-xs">âœ¦</span>
                <span>Confidential passkey for your sizing profile</span>
                <div className="absolute -bottom-1 start-4 h-2 w-2 rotate-45 bg-[#1c1b1b] border-b border-r border-[#b39265]/40" />
              </div>
            </div>

            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[11px] uppercase tracking-wider font-semibold text-[#1c1b1b]">
                Password
              </label>
              <Link href="/contact" className="text-[10px] text-[#888888] hover:text-[#b39265] transition-colors underline">
                Forgot password?
              </Link>
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢"
              className="w-full border border-[#e9e9e9] bg-[#faf8f5]/50 px-4 py-3 text-xs outline-none text-[#1c1b1b] transition-all duration-300 hover:border-[#b39265] hover:bg-white hover:shadow-[0_0_15px_rgba(179,146,101,0.12)] focus:border-[#1c1b1b] focus:bg-white"
            />
          </div>

          {/* Submit button with dreamy hover & tooltip */}
          <div className="relative group pt-2">
            {/* Dreamy Luxury Button Tooltip */}
            <div className="absolute -top-7 inset-x-0 z-20 pointer-events-none opacity-0 translate-y-1 transition-all duration-300 ease-out group-hover:opacity-100 group-hover:translate-y-0 flex justify-center">
              <div className="relative bg-[#1c1b1b] text-[#f5f5f5] text-[11px] font-normal tracking-wide py-1 px-3 rounded-xs shadow-[0_10px_25px_-5px_rgba(0,0,0,0.4),0_0_15px_rgba(179,146,101,0.25)] border border-[#b39265]/40 whitespace-nowrap flex items-center gap-1.5 backdrop-blur-md">
                <span className="text-[#b39265]">âœ¦</span>
                <span>Access your bespoke orders, saved measurements & concierge dossier</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="relative overflow-hidden w-full bg-[#1c1b1b] py-3.5 text-xs font-semibold uppercase tracking-[0.2em] text-white border border-transparent transition-all duration-500 hover:bg-[#252322] hover:border-[#b39265] hover:shadow-[0_8px_30px_rgba(179,146,101,0.28)] hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50"
            >
              {/* Shimmer light sweep */}
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none" />
              <span className="relative z-10">
                {loading ? "Accessing Maison..." : "Sign In"}
              </span>
            </button>
          </div>
        </form>

        <div className="mt-8 pt-6 border-t border-[#e9e9e9] text-center text-xs text-[#6a6a6a]">
          Don&apos;t have an account?{" "}
          <Link href="/auth/register" className="font-semibold text-[#1c1b1b] hover:text-[#b39265] underline transition-colors">
            Create an account
          </Link>
        </div>
      </div>
    </main>
  );
}

