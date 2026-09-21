import type { Metadata, Viewport } from "next";
import { Montserrat, Nunito_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

const nunitoSans = Nunito_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#0d0d0d",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "AvenderLine | Luxury Qatari Abayas & Haute Couture Maison",
  description:
    "Discover handcrafted luxury Qatari abayas and royal bishts tailored with pristine Korean crepe and Japanese silk at our Doha atelier. Complimentary bespoke tailoring and express delivery.",
  keywords: [
    "Qatari abayas",
    "Luxury abayas Doha",
    "Haute couture abayas",
    "Qatari bisht",
    "Bespoke abaya tailoring",
    "AvenderLine",
    "Luxury modest fashion",
  ],
  authors: [{ name: "AvenderLine Atelier Doha" }],
  creator: "AvenderLine",
  publisher: "AvenderLine",
  metadataBase: new URL("https://avenderline.com"),
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png", sizes: "32x32" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://avenderline.com",
    title: "AvenderLine | Luxury Qatari Abayas & Haute Couture",
    description: "Discover handcrafted luxury Qatari abayas and royal bishts tailored with pristine Korean crepe and Japanese silk.",
    siteName: "AvenderLine",
    images: [
      {
        url: "https://images.unsplash.com/photo-1772474500365-c2c520545f44?auto=format&fit=crop&w=1200&q=80",
        width: 1200,
        height: 630,
        alt: "AvenderLine Luxury Qatari Abayas",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AvenderLine | Haute Couture Maison",
    description: "Handcrafted luxury Qatari abayas and royal bishts from Doha.",
    images: [
      "https://images.unsplash.com/photo-1772474500365-c2c520545f44?auto=format&fit=crop&w=1200&q=80",
    ],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ClothingStore",
    name: "AvenderLine",
    url: "https://avenderline.com",
    logo: "https://avenderline.com/logo.png",
    description: "Luxury Qatari haute couture abaya and bisht maison in Doha.",
    priceRange: "$$$",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Doha",
      addressLocality: "Doha",
      addressCountry: "QA",
    },
    currenciesAccepted: "QAR",
    paymentAccepted: "Credit Card, Apple Pay, Cash on Delivery",
  };

  return (
    <html lang="en" dir="ltr">
      <body className={`${montserrat.variable} ${nunitoSans.variable} font-sans antialiased bg-[#ffffff] text-[#1c1b1b]`}>
        <script
          id="schema-clothing-store"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <AuthProvider>
          <CartProvider>
            <div className="flex min-h-screen flex-col">
              <Navbar />
              <div className="flex-1">{children}</div>
              <Footer />
            </div>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

