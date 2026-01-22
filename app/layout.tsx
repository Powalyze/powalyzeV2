import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'Powalyze – Cockpit Exécutif & Gouvernance IA',
  description: 'Cockpit IA pour piloter portefeuilles, risques et décisions.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className="bg-slate-950 text-slate-50 antialiased">
        <Navbar />
        <div className="pt-14">{children}</div>
      </body>
    </html>
  );
}
