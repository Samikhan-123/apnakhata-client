import { Metadata } from 'next';
import LoginPageClient from './LoginClient';

export const metadata: Metadata = {
  title: 'Login | Apna Khata - Secure Access to Your Personal Ledger',
  description: 'Securely log in to your Apna Khata account. Manage your daily finance records, track spending, and view automated financial reports with industry-grade encryption.',
  alternates: {
    canonical: '/login',
  },
  openGraph: {
    title: 'Login to Apna Khata',
    description: 'Enter your secure sanctuary for financial clarity. Simple, safe, and sovereign.',
    url: 'https://apnakhata.online/login',
    images: ['/og-image.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Login to Apna Khata',
    description: 'Access your secure daily ledger and financial reports.',
    images: ['/og-image.png'],
  }
};

export default function LoginPage() {
  return <LoginPageClient />;
}
