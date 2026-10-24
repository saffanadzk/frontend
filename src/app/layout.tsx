import type { Metadata } from 'next';
import { Newsreader, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getEditorialConfig } from '@/lib/api';

const serifFont = Newsreader({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
  style: ['normal', 'italic'],
});

const sansFont = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

export async function generateMetadata(): Promise<Metadata> {
  const config = await getEditorialConfig();

  return {
    title: {
      default: `${config.brand_name} — ${config.tagline}`,
      template: `%s | ${config.brand_name}`,
    },
    description: config.description,
    keywords: [
      'architecture journal',
      'spatial design',
      'minimalist interior',
      'monolithic architecture',
      'editorial magazine',
      'tactile craftsmanship',
      'design perspectives',
    ],
    authors: [{ name: `${config.brand_name} Editorial Board` }],
    creator: `${config.brand_name} Editorial`,
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
    openGraph: {
      title: `${config.brand_name} — ${config.tagline}`,
      description: config.description,
      siteName: config.brand_name,
      locale: 'en_US',
      type: 'website',
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const config = await getEditorialConfig();

  return (
    <html lang="en" className={`${serifFont.variable} ${sansFont.variable} scroll-smooth`}>
      <body className="min-h-screen flex flex-col bg-[#FBF9F5] text-[#151413] font-sans selection:bg-[#151413] selection:text-[#FBF9F5]">
        <AuthProvider>
          <Header config={config} />
          <main className="flex-1">{children}</main>
          <Footer config={config} />
        </AuthProvider>
      </body>
    </html>
  );
}
