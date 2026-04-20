import { Metadata } from 'next';
import LoginPageClient from './LoginClient';

export const metadata: Metadata = {
  title: 'Login | Apna Khata - Access Your Finance Dashboard',
  description: 'Log in to Apna Khata to manage your income, expenses, budgets, and financial reports in a secure and structured environment.',
  alternates: {
    canonical: '/login',
  },
  openGraph: {
    title: 'Login to Apna Khata',
    description: 'Access your personal finance dashboard and track your financial activity with ease.',
    url: 'https://apnakhata.online/login',
    images: ['/og-image.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Login to Apna Khata',
    description: 'Securely access your finance dashboard and reports.',
    images: ['/og-image.png'],
  }
};

export default function LoginPage() {
  return <LoginPageClient />;
}
