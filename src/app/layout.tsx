'use client';

import type { Metadata } from "next";
import { Inter, Geist } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { cn } from "@/lib/utils";
import { useEffect } from "react";

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' });
const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  useEffect(() => {
    // Only register Service Worker in production to avoid stalling and white screen issues in dev
    if (process.env.NODE_ENV === 'production' && "serviceWorker" in navigator) {
      window.addEventListener("load", function () {
        navigator.serviceWorker.register("/sw.js").then(
          function (registration) {
            // console.log("Service Worker registration successful with scope: ", registration.scope);
          },
          function (err) {
            // console.log("Service Worker registration failed: ", err);
          }
        );
      });
    }
  }, []);

  return (
    <html lang="en" suppressHydrationWarning className={cn("font-sans", geist.variable)}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0, viewport-fit=cover" />
        <meta name="theme-color" content="#10b981" />
        <link rel="manifest" href="/manifest.json" />
        <title>Apna Khata - Your Personal Money Tracker</title>
        <meta name="description" content="Effortlessly track your expenses, manage budgets, and achieve financial peace of mind." />
      </head>
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
