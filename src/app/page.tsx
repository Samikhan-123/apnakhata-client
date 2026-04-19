import { Metadata } from 'next';
import LandingPageClient from './LandingClient';

export const metadata: Metadata = {
  title: 'Apna Khata - Elegant & Secure Money Management',
  description: 'Experience financial clarity with Apna Khata. A sophisticated, secure haven for your daily records, income tracking, and expense management.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Apna Khata - Financial Clarity & Secure Mastery',
    description: 'Ditch the spreadsheets. Master your money with a premium personal ledger experience.',
    images: ['/og-image.png'],
  }
};

export default function LandingPage() {
  return <LandingPageClient />;
}
