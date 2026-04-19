import { Metadata } from 'next';
import RegisterClient from './RegisterClient';

export const metadata: Metadata = {
  title: 'Create Account | Start Your Financial Journey with Apna Khata',
  description: 'Join thousands of users who trust Apna Khata for financial clarity. Create your secure personal ledger in seconds, track your wealth growth, and master your money.',
  alternates: {
    canonical: '/register',
  },
  openGraph: {
    title: 'Start Your Journey with Apna Khata',
    description: 'Create your secure personal ledger and take back control of your financial story. Joining is simple and free.',
    url: 'https://apnakhata.online/register',
    images: ['/og-image.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Join Apna Khata Today',
    description: 'Start tracking your finances with security and clarity.',
    images: ['/og-image.png'],
  }
};

export default function RegisterPage() {
  return <RegisterClient />;
}
