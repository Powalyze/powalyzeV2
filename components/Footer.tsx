import Link from "next/link";
import { Mail, Phone, MapPin, Linkedin, Twitter, Youtube } from "lucide-react";
import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-300">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div>
            <Logo />
            <p className="mt-6 text-sm text-slate-400 leading-relaxed">
              Le cockpit exécutif intelligent pour piloter vos portefeuilles de projets avec rigueur et agilité.
            </p>
            <div className="flex gap-4 mt-6">
              <a
                href="https://linkedin.com/company/powalyze"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-slate-800 hover:bg-amber-500 flex items-center justify-center transition-all"
                aria-label="LinkedIn"
              >
                <Linkedin size={20} />
              </a>
              <a
                href="https://twitter.com/powalyze"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-slate-800 hover:bg-amber-500 flex items-center justify-center transition-all"
                aria-label="Twitter"
              >
                <Twitter size={20} />
              </a>
              <a
                href="https://youtube.com/@powalyze"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-slate-800 hover:bg-amber-500 flex items-center justify-center transition-all"
                aria-label="YouTube"
              >
                <Youtube size={20} />
              </a>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="font-bold text-white mb-4">Produit</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/le-cockpit" className="hover:text-amber-400 transition-colors">
                  Le Cockpit
                </Link>
              </li>
              <li>
                <Link href="/modules" className="hover:text-amber-400 transition-colors">
                  Modules
                </Link>
              </li>
              <li>
                <Link href="/ia" className="hover:text-amber-400 transition-colors">
                  IA Chief of Staff
                </Link>
              </li>
              <li>
                <Link href="/demo-interactive" className="hover:text-amber-400 transition-colors">
                  Démo interactive
                </Link>
              </li>
              <li>
                <Link href="/tarifs" className="hover:text-amber-400 transition-colors">
                  Tarifs
                </Link>
              </li>
              <li>
                <Link href="/fonctionnalites" className="hover:text-amber-400 transition-colors">
                  Fonctionnalités
                </Link>
              </li>
            </ul>
          </div>

          {/* Expertise Links */}
          <div>
            <h3 className="font-bold text-white mb-4">Expertise</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/expertise/pmo" className="hover:text-amber-400 transition-colors">
                  PMO & Portfolio
                </Link>
              </li>
              <li>
                <Link href="/expertise/data" className="hover:text-amber-400 transition-colors">
                  Data & Analytics
                </Link>
              </li>
              <li>
                <Link href="/expertise/gouvernance" className="hover:text-amber-400 transition-colors">
                  Gouvernance
                </Link>
              </li>
              <li>
                <Link href="/ressources/blog" className="hover:text-amber-400 transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/ressources/documentation/quick-start" className="hover:text-amber-400 transition-colors">
                  Documentation
                </Link>
              </li>
              <li>
                <Link href="/resultats" className="hover:text-amber-400 transition-colors">
                  Cas clients
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-bold text-white mb-4">Contact</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <Mail size={18} className="text-amber-400 mt-0.5 flex-shrink-0" />
                <div>
                  <a href="mailto:contact@powalyze.com" className="hover:text-amber-400 transition-colors block">
                    contact@powalyze.com
                  </a>
                  <a href="mailto:contact@powalyze.ch" className="hover:text-amber-400 transition-colors block mt-1">
                    contact@powalyze.ch
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Phone size={18} className="text-amber-400 mt-0.5 flex-shrink-0" />
                <a href="tel:+33615767067" className="hover:text-amber-400 transition-colors">
                  +33 6 15 76 70 67
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-amber-400 mt-0.5 flex-shrink-0" />
                <div className="space-y-2">
                  <div>
                    <p className="font-semibold text-white">Genève, Suisse</p>
                    <p className="text-xs text-slate-500">Siège social</p>
                  </div>
                  <div>
                    <p className="font-semibold text-white">Paris, France</p>
                    <p className="text-xs text-slate-500">Bureau européen</p>
                  </div>
                  <div>
                    <p className="font-semibold text-white">Oslo, Norvège</p>
                    <p className="text-xs text-slate-500">Bureau nordique</p>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
            <div className="text-slate-500">
              © {new Date().getFullYear()} Powalyze. Tous droits réservés.
            </div>
            <div className="flex flex-wrap gap-6 justify-center">
              <Link href="/mentions-legales" className="hover:text-amber-400 transition-colors">
                Mentions légales
              </Link>
              <Link href="/cgu" className="hover:text-amber-400 transition-colors">
                CGU
              </Link>
              <Link href="/mentions-legales#rgpd" className="hover:text-amber-400 transition-colors">
                Politique de confidentialité
              </Link>
              <Link href="/mentions-legales#cookies" className="hover:text-amber-400 transition-colors">
                Gestion des cookies
              </Link>
              <Link href="/contact" className="hover:text-amber-400 transition-colors">
                Nous contacter
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
