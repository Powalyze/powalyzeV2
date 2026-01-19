import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import '../styles/theme.css';
import { ModeProvider } from '@/lib/ModeContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Powalyze - Cockpit Exécutif & Gouvernance IA',
  description: 'Plateforme de gouvernance augmentée par l\'IA - Pilotage portefeuille, risques, et décisions COMEX',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <ModeProvider>
          {children}
        </ModeProvider>
      </body>
    </html>
  );
}
