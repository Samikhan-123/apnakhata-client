import { Metadata } from 'next';
import RegisterClient from './RegisterClient';

export const metadata: Metadata = {
  title: 'Create Account | Start Your Financial Journey with Apna Khata',
  description: 'Join thousands of users who trust Apna Khata for financial clarity. Create your secure personal ledger in seconds and start tracking your wealth growth.',
  openGraph: {
    title: 'Join Apna Khata - Financial Clarity Starts Here',
    description: 'Create your secure personal ledger and take back control of your financial story.',
  }
};

export default function RegisterPage() {
  return <RegisterClient />;
}
