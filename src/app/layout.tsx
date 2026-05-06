import type { Metadata, Viewport } from "next";
import { Inter, Geist } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { cn } from "@/lib/utils";
import { ServiceWorkerRegistration } from "@/components/ServiceWorkerRegistration";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://apnakhata.online"),
  title: {
    default: "Apna Khata - Personal Finance & Expense Tracker",
    template: "%s | Apna Khata",
  },
  description:
    "Master your money with Apna Khata. The smart, ledger-based personal finance tracker for managing income, expenses, and automated recurring transactions.",
  applicationName: "Apna Khata",
  authors: [{ name: "Apna Khata Team" }],
  generator: "Next.js",
  keywords: [
    "personal finance",
    "expense tracker",
    "ledger",
    "budgeting",
    "money manager",
    "financial goals",
    "recurring transactions",
  ],
  referrer: "origin-when-cross-origin",
  creator: "Apna Khata",
  publisher: "Apna Khata",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  manifest: "/manifest.json",

  openGraph: {
    title: "Apna Khata - Smart Personal Finance Management",
    description:
      "Track income, manage expenses, set budgets, and analyze your financial activity with a powerful ledger-based system.",
    url: "https://apnakhata.online",
    siteName: "Apna Khata",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Apna Khata - Personal Finance Dashboard",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Apna Khata - Personal Finance Manager",
    description:
      "Manage your income, expenses, and budgets with a clean and powerful finance tracking system.",
    images: ["/og-image.png"],
    site: "@apnakhata",
  },

  icons: {
    icon: "/favicon.ico",
    apple: "/apple-icon.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#ffffff",
};

import { PWAInstallPrompt } from "@/components/features/PWAInstallPrompt";
import { ImpersonationBanner } from "@/components/features/ImpersonationBanner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("font-sans", geist.variable)}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                "@context": "https://schema.org",
                "@type": "WebSite",
                name: "Apna Khata",
                alternateName: ["ApnaKhata", "Apna Khata Online"],
                url: "https://apnakhata.online",
              },
              {
                "@context": "https://schema.org",
                "@type": "SoftwareApplication",
                name: "Apna Khata",
                applicationCategory: "FinanceApplication",
                description:
                  "Track income, expenses, budgets, and recurring transactions with a structured finance system.",
                operatingSystem: "Web",
                offers: {
                  "@type": "Offer",
                  price: "0",
                  priceCurrency: "PKR",
                },
                featureList: [
                  "Income & Expense Tracking",
                  "Budget Management",
                  "Recurring Entries",
                  "Financial Reports",
                  "Category Tracking",
                ],
                author: {
                  "@type": "Organization",
                  name: "Apna Khata",
                  url: "https://apnakhata.online",
                },
              },
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
