import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";
import FixedNav from "@/components/FixedNav";
import FloatingActionBtn from "@/components/FloatingActionBtn";

const fraunces = Fraunces({
  subsets: ["latin"],
  axes: ["opsz"],
  weight: "variable",
  variable: "--font-fraunces",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Rajat Caterers | The Art of the Banquet",
  description: "Forty years of culinary excellence, composed for the few.",
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
};

import BackgroundWaves from "@/components/BackgroundWaves";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable}`}>
      <body className="antialiased">
        <BackgroundWaves />
        <FixedNav />
        <FloatingActionBtn />
        {children}
      </body>
    </html>
  );
}
