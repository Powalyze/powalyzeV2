import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import Footer from '@/components/Footer';
import CookieBanner from '@/components/CookieBanner';
import { ModeProvider } from '@/lib/ModeContext';
import { Toaster } from 'sonner';
import { ToastProvider } from '@/components/ui/ToastProvider';
import { CockpitProvider } from '@/components/providers/CockpitProvider';
import { FetchInterceptorProvider } from '@/components/FetchInterceptorProvider';

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
      <body className="bg-slate-950 text-slate-50 antialiased" suppressHydrationWarning>
        <FetchInterceptorProvider>
          <ModeProvider>
            <CockpitProvider>
              <ToastProvider>
                <Navbar />
                <div className="pt-14">{children}</div>
                <Footer />
                <CookieBanner />
                <Toaster position="top-center" richColors closeButton />
              </ToastProvider>
            </CockpitProvider>
          </ModeProvider>
        </FetchInterceptorProvider>
      </body>
    </html>
  );
}

