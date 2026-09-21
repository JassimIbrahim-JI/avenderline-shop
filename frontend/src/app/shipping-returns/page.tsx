import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shipping, Delivery & Returns | AvenderLine",
  description: "Delivery policies across the State of Qatar and GCC countries, along with complimentary bespoke alterations and exchange services by AvenderLine.",
};

export default function ShippingReturnsPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-16 sm:py-24">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <span className="text-[10px] font-mono tracking-[0.25em] text-[#8b7355] uppercase block font-semibold mb-2">
          CLIENT POLICIES
        </span>
        <h1 className="font-display text-3xl sm:text-4xl font-semibold uppercase tracking-wider text-[#1c1b1b]">
          Shipping, Delivery & Alterations
        </h1>
        <p className="mt-3 text-xs sm:text-sm text-[#6a6a6a] leading-relaxed">
          At AvenderLine, we ensure an exceptional experience from the initial tailoring stitch at our Doha atelier until your creation arrives at your doorstep.
        </p>
      </div>

      <div className="space-y-8 text-xs sm:text-sm text-[#4a4a4a] leading-relaxed">
        {/* Section 1 */}
        <div className="border border-[#e9e9e9] bg-white p-8 shadow-xs space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-lg">ðŸ‡¶ðŸ‡¦</span>
            <h3 className="font-display text-base font-semibold uppercase tracking-wider text-[#1c1b1b]">
              1. Delivery Across The State of Qatar
            </h3>
          </div>
          <p>
            â€¢ Orders within Doha and across the State of Qatar are hand-delivered via private climate-controlled couriers to protect delicate luxury fabrics.
          </p>
          <p>
            â€¢ <strong className="text-[#1c1b1b]">Delivery Fees:</strong> Complimentary express delivery on all orders of 500 QAR or more. A nominal 30 QAR fee applies to orders below 500 QAR.
          </p>
          <p>
            â€¢ <strong className="text-[#1c1b1b]">Transit Time:</strong> Delivered within 24 to 48 hours once bespoke tailoring at the atelier is complete.
          </p>
        </div>

        {/* Section 2 */}
        <div className="border border-[#e9e9e9] bg-white p-8 shadow-xs space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-lg">âœ‚ï¸</span>
            <h3 className="font-display text-base font-semibold uppercase tracking-wider text-[#1c1b1b]">
              2. Atelier Crafting & Tailoring Lead Time
            </h3>
          </div>
          <p>
            Because each AvenderLine creation is hand-cut and tailored with master artisan precision, atelier crafting typically requires <strong>2 to 4 business days</strong>. During peak festive seasons, lead times may extend slightly to ensure perfection.
          </p>
        </div>

        {/* Section 3 */}
        <div className="border border-[#e9e9e9] bg-white p-8 shadow-xs space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-lg">ðŸ”„</span>
            <h3 className="font-display text-base font-semibold uppercase tracking-wider text-[#1c1b1b]">
              3. Complimentary Size Alterations & Exchanges
            </h3>
          </div>
          <p>
            â€¢ <strong className="text-[#1c1b1b]">Complimentary Alteration:</strong> If your abaya length or sleeve circumference requires adjustments upon delivery, our atelier provides complimentary tailoring adjustments within 7 days of receipt.
          </p>
          <p>
            â€¢ <strong className="text-[#1c1b1b]">Exchange Conditions:</strong> The garment must remain in its original pristine condition with all tags, matching sheila scarf, and signature packaging intact, unworn and unwashed.
          </p>
          <p>
            â€¢ Fully customized bespoke pieces with unique personalized sizing are tailored to your satisfaction rather than refunded.
          </p>
        </div>
      </div>

      <div className="mt-12 text-center">
        <Link
          href="/contact"
          className="inline-block bg-[#1c1b1b] px-9 py-3.5 text-xs font-semibold uppercase tracking-[0.2em] text-white hover:bg-[#8b7355] transition-colors"
        >
          Contact Customer Care
        </Link>
      </div>
    </main>
  );
}


