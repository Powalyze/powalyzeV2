import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import Footer from '@/components/Footer';
import CookieBanner from '@/components/CookieBanner';
import { ModeProvider } from '@/lib/ModeContext';
import { Toaster } from 'sonner';
import { ToastProvider } from '@/components/ui/ToastProvider';
import { CockpitProvider } from '@/components/providers/CockpitProvider';
import { ConditionalFooter } from '@/components/ConditionalFooter';
import { FetchPolyfill } from '@/components/FetchPolyfill';

export const metadata: Metadata = {
  title: 'Powalyze – Cockpit Exécutif & Gouvernance IA',
  description: 'Cockpit IA pour piloter portefeuilles, risques et décisions. Tableau de bord exécutif premium avec IA méthodologique pour la gouvernance de projets et programmes.',
  metadataBase: new URL('https://www.powalyze.com'),
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' }
    ],
    shortcut: '/favicon.svg',
    apple: '/favicon.svg'
  },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: 'https://www.powalyze.com',
    siteName: 'Powalyze',
    title: 'Powalyze – Cockpit Exécutif & Gouvernance IA',
    description: 'Cockpit IA pour piloter portefeuilles, risques et décisions. Tableau de bord exécutif premium avec IA méthodologique pour la gouvernance de projets et programmes.',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'Powalyze - Cockpit Exécutif Premium'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Powalyze – Cockpit Exécutif & Gouvernance IA',
    description: 'Cockpit IA pour piloter portefeuilles, risques et décisions avec IA méthodologique intégrée.',
    images: ['/opengraph-image'],
    creator: '@powalyze',
    site: '@powalyze'
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    }
  },
  verification: {
    google: 'verification_token',
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className="bg-slate-950 text-slate-50 antialiased" suppressHydrationWarning>
        <FetchPolyfill />
        <ModeProvider>
          <CockpitProvider>
            <ToastProvider>
              <Navbar />
              <div className="pt-14">{children}</div>
              <ConditionalFooter />
              <CookieBanner />
              <Toaster position="top-center" richColors closeButton />
            </ToastProvider>
          </CockpitProvider>
        </ModeProvider>
      </body>
    </html>
  );
}

