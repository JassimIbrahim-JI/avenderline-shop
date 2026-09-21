import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { shimmerBlurDataUrl } from "@/lib/shimmer";

export const metadata: Metadata = {
  title: "About The Maison | AvenderLine Atelier Doha",
  description: "The story of AvenderLine Maison in Doha â€” our journey in crafting luxury Qatari abayas with master couture artisanship.",
};

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-16 sm:py-24">
      {/* Top Tagline */}
      <div className="text-center max-w-2xl mx-auto mb-16">
        <span className="text-[10px] font-mono tracking-[0.25em] text-[#8b7355] uppercase block font-semibold mb-2">
          THE MAISON STORY
        </span>
        <h1 className="font-display text-3xl sm:text-5xl md:text-6xl font-semibold uppercase tracking-wider text-[#1c1b1b] leading-tight">
          The AvenderLine Maison
        </h1>
        <p className="mt-4 text-xs sm:text-sm text-[#6a6a6a] leading-relaxed font-light">
          Where Gulf regal heritage meets contemporary haute couture drapes in the heart of Doha.
        </p>
      </div>

      {/* Hero Editorial Image with Shimmer Skeleton */}
      <div className="relative aspect-[16/9] w-full overflow-hidden border border-[#e9e9e9] shadow-xs mb-16 bg-[#f4f2ee]">
        <div
          className="absolute inset-0 z-0 bg-gradient-to-r from-[#f5f2ec] via-[#ebe5da] to-[#f5f2ec] bg-[length:200%_100%] animate-shimmer pointer-events-none"
          aria-hidden="true"
        />
        <Image
          src="https://images.unsplash.com/photo-1762605135376-ae5af70a5628?auto=format&fit=crop&w=1600&q=85"
          alt="AvenderLine Atelier Doha"
          fill
          priority
          placeholder="blur"
          blurDataURL={shimmerBlurDataUrl(1600, 900)}
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute bottom-6 start-6 text-white">
          <p className="font-display text-lg font-semibold uppercase tracking-wider">AvenderLine Atelier â€” Doha, Qatar</p>
          <p className="text-xs text-[#e5e5e5] font-light">Master bespoke hand-tailoring for every creation</p>
        </div>
      </div>

      {/* Story Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
        <div className="space-y-4 text-xs sm:text-sm text-[#4a4a4a] leading-relaxed font-light">
          <h2 className="font-display text-xl sm:text-2xl font-semibold uppercase tracking-wider text-[#1c1b1b]">
            Design Philosophy & Poise
          </h2>
          <p>
            Founded in Doha, <span className="font-semibold text-[#1c1b1b]">AvenderLine</span> celebrates the discerning Qatari and Gulf woman seeking quiet luxury and understated distinction. We believe the abaya is far more than a garment; it is an enduring expression of grace, royalty, and independent poise.
          </p>
          <p>
            Every silhouette in our seasonal collections originates from hand sketches echoing the fluid geometry of desert dunes and contemporary Doha architecture, striking an exquisite balance between modest tradition and timeless luxury.
          </p>
        </div>

        <div className="bg-[#faf8f5] p-8 border border-[#e9e9e9] space-y-4">
          <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-[#1c1b1b] border-b border-[#e9e9e9] pb-3">
            Our Hallmarks of Craftsmanship
          </h3>
          <ul className="space-y-4 text-xs text-[#4a4a4a]">
            <li className="flex items-start gap-3">
              <span className="text-[#8b7355] text-base">ðŸ’Ž</span>
              <div>
                <strong className="block text-[#1c1b1b] uppercase tracking-wider font-semibold text-[11px] mb-0.5">
                  Premier Global Silks & Crepes:
                </strong>
                Exclusively sourcing Japanese cooling Nada silk, Korean royal super-black crease-resistant crepe, and Italian cashmere-silk blends.
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#8b7355] text-base">âœ‚ï¸</span>
              <div>
                <strong className="block text-[#1c1b1b] uppercase tracking-wider font-semibold text-[11px] mb-0.5">
                  Private Atelier Master Tailoring:
                </strong>
                Our Doha atelier team focuses on meticulous French double-seams, custom lengths, and hand-embroidery with Japanese glass micro-beads.
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#8b7355] text-base">âœ¨</span>
              <div>
                <strong className="block text-[#1c1b1b] uppercase tracking-wider font-semibold text-[11px] mb-0.5">
                  AI Styling Concierge:
                </strong>
                Our in-house AI assistant provides instant personalized guidance in English or Arabic on cuts, seasonal fabrics, and height measurements.
              </div>
            </li>
          </ul>
        </div>
      </div>

      {/* CTA Box */}
      <div className="bg-[#1c1b1b] text-white p-10 sm:p-12 text-center space-y-4 shadow-xs">
        <h3 className="font-display text-xl sm:text-2xl font-semibold uppercase tracking-wider">
          Experience The Maison Collections
        </h3>
        <p className="text-xs sm:text-sm text-[#a0a0a0] max-w-lg mx-auto font-light leading-relaxed">
          Explore our latest ready-to-wear creations or connect with our atelier concierge for bespoke tailoring.
        </p>
        <div className="pt-3 flex flex-wrap justify-center gap-4">
          <Link
            href="/collections/women"
            className="border border-white bg-white px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.2em] text-[#1c1b1b] hover:bg-transparent hover:text-white transition-all duration-300"
          >
            Explore Collections
          </Link>
          <a
            href="https://instagram.com/avender_line"
            target="_blank"
            rel="noreferrer"
            className="border border-[#444444] bg-transparent px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.2em] text-white hover:border-white transition-all duration-300 inline-flex items-center gap-2"
          >
            <span>Follow @avender_line</span>
            <span>â†—</span>
          </a>
        </div>
      </div>
    </main>
  );
}

