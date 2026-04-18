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
  alternates: {
    canonical: '/',
  },
  description: "Take charge of your financial story again. Apna Khata is a calm and safe place for your daily ledger.",
  keywords: ["financial clarity", "secure money management", "personal ledger", "family wealth", "honest tracking", "modern finance system", "Apna Khata", "expense tracker", "budget planner", "secure ledger"],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
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
    site: "@apnakhata",
    creator: "@apnakhata",
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
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
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                "@context": "https://schema.org",
                "@type": "WebSite",
                "name": "Apna Khata",
                "alternateName": ["ApnaKhata", "Apna Khata Online"],
                "url": "https://apnakhata.online",
              },
              {
                "@context": "https://schema.org",
                "@type": "SoftwareApplication",
                "name": "Apna Khata",
                "operatingSystem": "Web",
                "applicationCategory": "FinancialApplication",
                "applicationSubCategory": "Personal Ledger & Budgeting",
                "description": "Master your personal finances with a secure, elegant, and beautifully simple ledger.",
                "offers": {
                  "@type": "Offer",
                  "price": "0",
                  "priceCurrency": "PKR",
                  "availability": "https://schema.org/InStock"
                },
                "author": {
                  "@type": "Organization",
                  "name": "Apna Khata",
                  "url": "https://apnakhata.online"
                },
                "featureList": "Daily Expense Tracking, PDF Reports, Budget Management, Secure Encryption",
                "genre": "Finance"
              }
            ]),
          }}
        />
      </head>
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
