import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import "./globals.css";
import Background from "@/components/Background";
import Nav from "@/components/Nav";
import Dock from "@/components/Dock";
import SmoothScroll from "@/components/SmoothScroll";
import Providers from "@/components/Providers";
import { BRAND } from "@/lib/content";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

const TITLE = "Rajat Caterers | 40 Years of Delhi Wedding & Event Catering";
const DESCRIPTION =
  "Delhi NCR caterers since 1986, now catering destination weddings and conferences worldwide. Royal buffets, live food stations and plated fine dining in North Indian, Mughlai and Continental, with 10,000+ events served.";

export const metadata: Metadata = {
  metadataBase: new URL(BRAND.websiteUrl),
  title: TITLE,
  description: DESCRIPTION,
  applicationName: BRAND.name,
  keywords: [
    "Delhi caterers",
    "wedding catering Delhi NCR",
    "corporate catering Delhi",
    "Faridabad caterers",
    "live food stations",
    "destination wedding caterers",
    "Rajat Caterers",
  ],
  icons: { icon: "/icon.png", apple: "/icon.png" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: "website",
    siteName: BRAND.name,
    images: [{ url: "/sequence/frame_000_delay-0.05s.webp", width: 1920, height: 1080, alt: "Golden buffet service by Rajat Caterers" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#0a1530",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "FoodEstablishment",
  name: BRAND.name,
  description: DESCRIPTION,
  foundingDate: String(BRAND.founded),
  telephone: BRAND.phones.map((p) => p.tel),
  email: BRAND.email,
  url: BRAND.websiteUrl,
  servesCuisine: ["North Indian", "Continental", "Mughlai"],
  address: {
    "@type": "PostalAddress",
    streetAddress: "F-302, Ibiza Town, Surajkund",
    addressLocality: "Faridabad",
    postalCode: "121010",
    addressCountry: "IN",
  },
  areaServed: ["Delhi NCR", "Worldwide"],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${manrope.variable}`}>
      <body>
        <noscript>
          <style>{`[aria-hidden="true"] > span, [style*="opacity: 0"], [style*="opacity:0"], .scrub-word { opacity: 1 !important; transform: none !important; }`}</style>
        </noscript>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <a
          href="#story"
          className="fixed left-4 top-4 z-[300] -translate-y-24 bg-gold px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-navy transition-transform duration-200 focus:translate-y-0"
        >
          Skip to content
        </a>
        <Providers>
          <SmoothScroll />
          <Background />
          <Nav />
          <Dock />
          {children}
        </Providers>
      </body>
    </html>
  );
}
