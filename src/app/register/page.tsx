import { Metadata } from 'next';
import RegisterClient from './RegisterClient';

export const metadata: Metadata = {
  title: 'Create Account | Apna Khata - Personal Finance Manager',
  description: 'Create your Apna Khata account to track income, manage expenses, set budgets, and monitor your financial growth with a secure ledger-based system.',
  alternates: {
    canonical: '/register',
  },
  openGraph: {
    title: 'Start Managing Your Finances with Apna Khata',
    description: 'Sign up and take control of your income, expenses, and budgets with a simple and powerful finance management system.',
    url: 'https://apnakhata.online/register',
    images: ['/og-image.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Create Your Apna Khata Account',
    description: 'Start tracking your finances with clarity and control.',
    images: ['/og-image.png'],
  }
};

export default function RegisterPage() {
  return <RegisterClient />;
}
