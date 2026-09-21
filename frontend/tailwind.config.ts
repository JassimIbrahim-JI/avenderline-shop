import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        accent: "var(--accent)",
        muted: "var(--muted)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Nunito Sans", "sans-serif"],
        display: ["var(--font-display)", "Montserrat", "sans-serif"],
      },
      letterSpacing: {
        // Arabic scripts must NOT use letter-spacing (it breaks connected glyphs).
        // This token is kept only for Latin labels/eyebrows.
        eyebrow: "0.3em",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "200% 0" },
          "100%": { backgroundPosition: "-200% 0" },
        },
      },
      animation: {
        shimmer: "shimmer 1.8s infinite ease-in-out",
      },
    },
  },
  plugins: [],
};
export default config;
