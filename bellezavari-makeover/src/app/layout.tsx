import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Bellezavari | Premium Hair Styling in London",
  description: "Experience luxury hair styling with Bellezavari. Specializing in braids, locs, weaves, and natural hair care. Book your transformation today.",
  keywords: ["hair styling", "braids", "locs", "weaves", "London", "hair salon", "knotless braids", "faux locs"],
  authors: [{ name: "Bellezavari" }],
  openGraph: {
    title: "Bellezavari | Premium Hair Styling in London",
    description: "Experience luxury hair styling with Bellezavari. Specializing in braids, locs, weaves, and natural hair care.",
    url: "https://bellezavari.com",
    siteName: "Bellezavari",
    locale: "en_GB",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bellezavari | Premium Hair Styling in London",
    description: "Experience luxury hair styling with Bellezavari.",
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
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${cormorant.variable} ${dmSans.variable} antialiased min-h-screen flex flex-col`}
      >
        <Navigation />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
