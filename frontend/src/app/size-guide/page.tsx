import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Abaya Size Guide | AvenderLine Atelier Doha",
  description: "Official Qatari abaya size chart in inches and centimeters with height conversion and master atelier fitting guidelines.",
};

const sizesData = [
  { size: "50", height: "150 - 153 cm", length: '50"', bust: '21" (53 cm)', sleeve: '26" (66 cm)' },
  { size: "52", height: "154 - 158 cm", length: '52"', bust: '22" (56 cm)', sleeve: '27" (68 cm)' },
  { size: "54", height: "159 - 163 cm", length: '54"', bust: '23" (58 cm)', sleeve: '28" (71 cm)' },
  { size: "56", height: "164 - 168 cm", length: '56"', bust: '24" (61 cm)', sleeve: '28" (71 cm)' },
  { size: "58", height: "169 - 173 cm", length: '58"', bust: '25" (63 cm)', sleeve: '29" (74 cm)' },
  { size: "60", height: "174 cm & above", length: '60"', bust: '26" (66 cm)', sleeve: '30" (76 cm)' },
];

export default function SizeGuidePage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-16 sm:py-24">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <span className="text-[10px] font-mono tracking-[0.25em] text-[#8b7355] uppercase block font-semibold mb-2">
          MEASUREMENTS & SIZING
        </span>
        <h1 className="font-display text-3xl sm:text-5xl font-semibold uppercase tracking-wider text-[#1c1b1b]">
          Atelier Size Guide
        </h1>
        <p className="mt-3 text-xs sm:text-sm text-[#6a6a6a] leading-relaxed font-light">
          Standard Qatari abaya measurements ensuring effortless fluidity and bespoke poise.
        </p>
      </div>

      {/* Sizing Table */}
      <div className="border border-[#e9e9e9] bg-white shadow-xs overflow-hidden mb-12">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-start border-collapse">
            <thead>
              <tr className="bg-[#faf8f5] text-[#1c1b1b] border-b border-[#e9e9e9]">
                <th className="p-4 font-semibold text-start uppercase tracking-wider">Size</th>
                <th className="p-4 font-semibold text-start uppercase tracking-wider">Client Height</th>
                <th className="p-4 font-semibold text-start uppercase tracking-wider">Garment Length</th>
                <th className="p-4 font-semibold text-start uppercase tracking-wider">Bust Width</th>
                <th className="p-4 font-semibold text-start uppercase tracking-wider">Sleeve Length</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e9e9e9]">
              {sizesData.map((row) => (
                <tr key={row.size} className="hover:bg-[#faf8f5]">
                  <td className="p-4 font-semibold text-sm text-[#8b7355]">{row.size}</td>
                  <td className="p-4 text-[#1c1b1b] font-medium">{row.height}</td>
                  <td className="p-4 text-[#6a6a6a]">{row.length}</td>
                  <td className="p-4 text-[#6a6a6a]">{row.bust}</td>
                  <td className="p-4 text-[#6a6a6a]">{row.sleeve}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Instructions on how to measure */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-[#faf8f5] p-6 border border-[#e9e9e9] space-y-2">
          <span className="text-xl block">ðŸ“</span>
          <h4 className="font-display text-xs font-semibold uppercase tracking-wider text-[#1c1b1b]">
            1. Measuring Length
          </h4>
          <p className="text-xs text-[#6a6a6a] leading-relaxed font-light">
            Measure from the highest shoulder point, vertically straight down to the ankle or desired hemline.
          </p>
        </div>

        <div className="bg-[#faf8f5] p-6 border border-[#e9e9e9] space-y-2">
          <span className="text-xl block">ðŸ‘—</span>
          <h4 className="font-display text-xs font-semibold uppercase tracking-wider text-[#1c1b1b]">
            2. Measuring Bust Width
          </h4>
          <p className="text-xs text-[#6a6a6a] leading-relaxed font-light">
            Measured horizontally from underarm to underarm across the front with the garment lying flat.
          </p>
        </div>

        <div className="bg-[#faf8f5] p-6 border border-[#e9e9e9] space-y-2">
          <span className="text-xl block">ðŸ‘ </span>
          <h4 className="font-display text-xs font-semibold uppercase tracking-wider text-[#1c1b1b]">
            3. Considering Heels
          </h4>
          <p className="text-xs text-[#6a6a6a] leading-relaxed font-light">
            If you wear heels regularly, we suggest ordering 2 inches longer to maintain an elegant floor graze.
          </p>
        </div>
      </div>

      {/* Bespoke Note & CTA */}
      <div className="bg-[#1c1b1b] text-white p-8 sm:p-10 text-center space-y-3 shadow-xs">
        <h3 className="font-display text-lg sm:text-xl font-semibold uppercase tracking-wider">
          Require Custom Bespoke Measurements?
        </h3>
        <p className="text-xs text-[#a0a0a0] max-w-md mx-auto font-light leading-relaxed">
          Our Doha atelier provides custom tailored sizing. Specify custom lengths in your order notes or reach out to our couture specialists.
        </p>
        <Link
          href="/contact"
          className="mt-3 inline-block bg-white px-8 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#1c1b1b] hover:bg-[#8b7355] hover:text-white transition-colors"
        >
          Request Custom Tailoring
        </Link>
      </div>
    </main>
  );
}

