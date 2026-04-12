import type { Metadata, Viewport } from "next";
import { Inter, Geist } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { cn } from "@/lib/utils";
import { ServiceWorkerRegistration } from "@/components/ServiceWorkerRegistration";

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' });
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL('https://apnakhata.online'),
  title: {
    default: "Apna Khata - Financial Clarity & Secure Mastery",
    template: "%s | Apna Khata"
  },
  description: "Master your personal finances with a secure, elegant, and beautifully simple ledger. Achieve financial clarity for you and your family with Apna Khata.",
  keywords: ["financial clarity", "secure money management", "personal ledger", "family wealth", "honest tracking", "modern finance sanctuary"],
  manifest: "/manifest.json",
  openGraph: {
    title: "Apna Khata - Elegant & Secure Money Management",
    description: "Experience the safe haven of financial clarity. Simple, secure, and thoughtfully designed for your personal mastery.",
    url: "https://apnakhata.online",
    siteName: "Apna Khata",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Apna Khata - Financial Clarity",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Apna Khata - Financial Clarity & Secure Mastery",
    description: "Your personal financial haven. Simple, secure, and made for clarity.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

import { PWAInstallPrompt } from "@/components/features/PWAInstallPrompt";
import { ImpersonationBanner } from "@/components/features/ImpersonationBanner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={cn("font-sans", geist.variable)}>
      <body className={inter.className}>
        <Providers>
          <ImpersonationBanner />
          <ServiceWorkerRegistration />
          <PWAInstallPrompt />
          {children}
        </Providers>
      </body>
    </html>
  );
}
