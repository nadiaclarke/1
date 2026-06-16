"use client";
import Link from "next/link";
import { useState } from "react";

export default function Nav() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 bg-[#f5f4f0]/90 backdrop-blur border-b border-[#d4cfc4]">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-semibold tracking-wide text-[#1a2e1c]">
          Terroir
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm">
          <Link href="/listings" className="hover:text-[#3d6b42] transition-colors">Browse Land</Link>
          <Link href="/sell" className="hover:text-[#3d6b42] transition-colors">Sell / Donate</Link>
          <Link href="/buy" className="hover:text-[#3d6b42] transition-colors">Buyer Registry</Link>
          <Link href="/sell" className="bg-[#3d6b42] text-white px-4 py-2 rounded-full text-xs font-medium hover:bg-[#2e5233] transition-colors">
            List a Property
          </Link>
        </nav>
        <button className="md:hidden" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {open ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>
      {open && (
        <div className="md:hidden bg-[#f5f4f0] border-t border-[#d4cfc4] px-6 py-4 flex flex-col gap-4 text-sm">
          <Link href="/listings" onClick={() => setOpen(false)}>Browse Land</Link>
          <Link href="/sell" onClick={() => setOpen(false)}>Sell / Donate</Link>
          <Link href="/buy" onClick={() => setOpen(false)}>Buyer Registry</Link>
        </div>
      )}
    </header>
  );
}
