import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Powalyze - Vue 360° Pilotage Stratégique',
  description: 'Plateforme SaaS premium pour le pilotage stratégique des projets, gestion des risques, et prise de décision COMEX',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <div className="min-h-screen bg-gradient-to-br from-brand-blue-dark via-brand-blue to-brand-blue-light">
          {children}
        </div>
      </body>
    </html>
  );
}
