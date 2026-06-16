import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });

export const metadata: Metadata = {
  title: "Terroir | Canadian Conservation Land Marketplace",
  description: "Connecting landowners with conservation buyers across Canada.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={geist.variable}>
      <body className="min-h-screen flex flex-col bg-[#f5f4f0] text-[#1a2e1c] font-[family-name:var(--font-geist)]">
        <Nav />
        <main className="flex-1">{children}</main>
        <footer className="bg-[#1a2e1c] text-[#a8bfaa] text-sm py-10 px-6">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between gap-6">
            <div>
              <span className="text-white font-semibold text-lg tracking-wide">Terroir</span>
              <p className="mt-1 text-xs">Canadian Conservation Land Marketplace</p>
            </div>
            <div className="flex gap-10 text-xs">
              <div>
                <p className="text-white font-medium mb-2">Platform</p>
                <ul className="space-y-1">
                  <li><a href="/listings" className="hover:text-white transition-colors">Browse Listings</a></li>
                  <li><a href="/sell" className="hover:text-white transition-colors">List a Property</a></li>
                  <li><a href="/buy" className="hover:text-white transition-colors">Register as Buyer</a></li>
                </ul>
              </div>
              <div>
                <p className="text-white font-medium mb-2">Info</p>
                <ul className="space-y-1">
                  <li><a href="/" className="hover:text-white transition-colors">About</a></li>
                  <li><a href="/" className="hover:text-white transition-colors">Methodology</a></li>
                  <li><a href="/" className="hover:text-white transition-colors">Contact</a></li>
                </ul>
              </div>
            </div>
          </div>
          <p className="text-center mt-8 text-xs text-[#6b8570]">© 2026 Terroir. Operating on the traditional territories of Indigenous Peoples across Canada.</p>
        </footer>
      </body>
    </html>
  );
}
