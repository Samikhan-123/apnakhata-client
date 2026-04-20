import { Metadata } from 'next';
import LandingPageClient from './LandingClient';

export const metadata: Metadata = {
  title: 'Apna Khata - Personal Finance Management & Expense Tracker',
  description: 'Apna Khata is a modern personal finance management app to track income, expenses, budgets, and recurring transactions. Gain complete financial clarity with a secure, ledger-based system.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Apna Khata - Smart Personal Finance Management',
    description: 'Track income, manage expenses, set budgets, and automate recurring entries with a powerful ledger-based system.',
    images: ['/og-image.png'],
  }
};

export default function LandingPage() {
  return <LandingPageClient />;
}
