"use client";

import Link from "next/link";

export function Navbar() {
  return (
    <header className="fixed top-0 inset-x-0 z-40 border-b border-slate-800/70 bg-slate-950/80 backdrop-blur">
      <div className="px-[7vw] h-14 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-sm font-semibold tracking-tight">
            Powalyze
          </Link>
          <nav className="hidden md:flex items-center gap-4 text-xs text-slate-400">
            <Link href="/a-propos">Produit</Link>
            <Link href="/cas-usage">Cas d'usage</Link>
            <Link href="/services">Services</Link>
            <Link href="/temoignages">Clients</Link>
            <Link href="/faq">FAQ</Link>
            <Link href="/contact">Contact</Link>
          </nav>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <Link href="/login" className="text-slate-400">
            Connexion
          </Link>
          <Link
            href="/cockpit"
            className="px-3 py-1.5 rounded-full bg-slate-100 text-slate-900 font-semibold"
          >
            Accéder au cockpit
          </Link>
        </div>
      </div>
    </header>
  );
}
