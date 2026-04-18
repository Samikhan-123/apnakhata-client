import { Metadata } from 'next';
import LoginPageClient from './LoginClient';

export const metadata: Metadata = {
  title: 'Login | Apna Khata - Access Your Sovereign Ledger',
  description: 'Log in to your Apna Khata account to safely manage your daily records, track expenses, and view financial clarity reports.',
  openGraph: {
    title: 'Login to Apna Khata',
    description: 'Secure access to your personal financial peace.',
  }
};

export default function LoginPage() {
  return <LoginPageClient />;
}
