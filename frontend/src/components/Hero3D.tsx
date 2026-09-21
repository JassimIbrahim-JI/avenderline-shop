"use client";

import { motion } from "framer-motion";

// Elegant luxury hero background â€” soft layered gradients and subtle light,
// replacing the previous metallic knot that felt out of place for abayas.
export default function Hero3D() {
  return (
    <div className="relative h-full w-full overflow-hidden">
      {/* Soft ambient gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,#fdf6ec_0%,transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,#f5ecdb_0%,transparent_55%)]" />

      {/* Floating silk-like orbs */}
      <motion.div
        className="absolute right-[8%] top-[15%] h-72 w-72 rounded-full opacity-30 blur-3xl"
        style={{ background: "var(--accent)" }}
        animate={{ y: [0, -24, 0], scale: [1, 1.06, 1] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-[12%] left-[10%] h-80 w-80 rounded-full opacity-20 blur-3xl"
        style={{ background: "#d9b98a" }}
        animate={{ y: [0, 20, 0], scale: [1, 1.08, 1] }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Fine decorative rings (subtle, non-intrusive) */}
      <motion.div
        className="absolute left-1/2 top-1/2 h-[34rem] w-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[--accent]/20"
        animate={{ scale: [1, 1.04, 1], opacity: [0.6, 0.9, 0.6] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute left-1/2 top-1/2 h-[46rem] w-[46rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[--accent]/10"
        animate={{ scale: [1.04, 1, 1.04], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

