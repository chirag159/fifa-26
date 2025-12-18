import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import Layout from "../components/Layout";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: "FIFA World Cup 2026 Companion",
  description: "News, Schedule, Odds, and Stats for FWC26",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${outfit.variable} font-sans`}>
        <Layout>{children}</Layout>
        <SpeedInsights />
      </body>
    </html>
  );
}
