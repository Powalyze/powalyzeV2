// ============================================================================
// Footer - Pied de page avec liens et informations
// ============================================================================

import Link from 'next/link';

export default function Footer() {
  const footerLinks = {
    Produit: [
      { label: 'Fonctionnalités', href: '/#features' },
      { label: 'Mode Demo', href: '/demo' },
      { label: 'Mode Pro', href: '/login' },
      { label: 'Tarifs', href: '/pricing' },
    ],
    Entreprise: [
      { label: 'À propos', href: '/about' },
      { label: 'Contact', href: '/contact' },
      { label: 'Blog', href: '/blog' },
      { label: 'Carrières', href: '/careers' },
    ],
    Ressources: [
      { label: 'Documentation', href: '/docs' },
      { label: 'API', href: '/api-docs' },
      { label: 'Support', href: '/support' },
      { label: 'Status', href: 'https://status.powalyze.com' },
    ],
    Légal: [
      { label: 'CGU', href: '/cgu' },
      { label: 'Confidentialité', href: '/privacy' },
      { label: 'Mentions légales', href: '/mentions-legales' },
      { label: 'Sécurité', href: '/security' },
    ],
  };

  return (
    <footer className="bg-slate-900/50 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Top section */}
        <div className="grid md:grid-cols-5 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl flex items-center justify-center">
                <span className="text-slate-950 font-bold text-xl">P</span>
              </div>
              <span className="text-white font-bold text-xl">Powalyze</span>
            </Link>
            <p className="text-sm text-slate-400 mb-6">
              Le cockpit exécutif piloté par l'IA pour la gouvernance d'entreprise.
            </p>
            <div className="flex gap-4">
              <a
                href="https://twitter.com/powalyze"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg flex items-center justify-center transition-colors"
              >
                <svg className="w-5 h-5 text-slate-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.5 6.507a.809.809 0 0 0-.098-.307.835.835 0 0 0-.197-.245.833.833 0 0 0-.291-.161.818.818 0 0 0-.319-.036c-.218.014-.421.101-.586.249a8.13 8.13 0 0 1-2.063 1.106c-.698-1.024-1.853-1.697-3.164-1.697-2.092 0-3.793 1.701-3.793 3.793 0 .297.033.586.094.865-3.154-.151-5.943-1.671-7.814-3.964a.831.831 0 0 0-.676-.327c-.179 0-.355.062-.495.178a.837.837 0 0 0-.291.497c-.065.291-.176.569-.329.826a3.75 3.75 0 0 0-.396.848 3.793 3.793 0 0 0-.2 1.183c0 1.09.462 2.075 1.202 2.765a2.46 2.46 0 0 1-.482-.119.832.832 0 0 0-.65.094.826.826 0 0 0-.391.541c0 .036 0 .072.006.108 0 1.543.871 2.885 2.148 3.563-.202.022-.408.008-.607-.043a.83.83 0 0 0-.625.146.834.834 0 0 0-.356.557c.422 1.332 1.597 2.312 3.016 2.581-1.301.946-2.853 1.455-4.489 1.455-.293 0-.586-.016-.879-.047a.832.832 0 0 0-.595 1.404c1.873 1.245 4.062 1.901 6.335 1.901 7.602 0 11.762-6.297 11.762-11.762 0-.179-.004-.357-.011-.535.81-.586 1.512-1.314 2.083-2.158a.831.831 0 0 0-.041-.997z" />
                </svg>
              </a>
              <a
                href="https://linkedin.com/company/powalyze"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg flex items-center justify-center transition-colors"
              >
                <svg className="w-5 h-5 text-slate-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0 000 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Links columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-sm font-semibold text-white mb-4">{category}</h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-400 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom section */}
        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} Powalyze. Tous droits réservés.
          </p>
          <div className="flex gap-6">
            <span className="text-xs text-slate-600">
              Made with ❤️ in France
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
