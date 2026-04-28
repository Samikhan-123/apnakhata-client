"use client";

import React from "react";
import {
  Lock,
  EyeOff,
  Database,
} from "lucide-react";
import { SlideIn, FadeIn } from "@/components/ui/FramerMotion";

export default function PrivacyPage() {
  const sections = [
    {
      title: "Data Collection",
      icon: Database,
      content:
        "We only collect what we absolutely need. This includes your email for authentication and technical metadata (IP & Device info) to protect your account from unauthorized access and prevent platform abuse.",
    },
    {
      title: "No Data Selling",
      icon: EyeOff,
      content:
        "Your financial life is not our business model. We will never sell, rent, or trade your personal information to third parties for marketing purposes.",
    },
    {
      title: "End-to-End Security",
      icon: Lock,
      content:
        "All data is encrypted in transit and at rest using industry-standard protocols (AES-256). We follow best practices to ensure your information stays private.",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-6 py-24">
      <header className="mb-20 text-center">
        <SlideIn duration={0.5}>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">
            Security First
          </p>
          <h1 className="text-6xl font-black tracking-tighter mt-4">
            Privacy <span className="text-primary italic">Policy.</span>
          </h1>
          <p className="text-muted-foreground font-bold mt-6">
            Last Updated: April 2026
          </p>
        </SlideIn>
      </header>

      <div className="space-y-16">
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {sections.map((section, idx) => (
            <FadeIn key={idx} delay={idx * 0.1}>
              <div className="premium-card p-8 rounded-[2.5rem] border-border/40 h-full hover:bg-muted/30 transition-all">
                <div className="w-12 h-12 bg-primary/5 text-primary rounded-2xl flex items-center justify-center mb-6">
                  <section.icon size={24} />
                </div>
                <h3 className="text-xl font-black tracking-tight mb-3 text-foreground">
                  {section.title}
                </h3>
                <p className="text-muted-foreground text-sm font-medium leading-relaxed">
                  {section.content}
                </p>
              </div>
            </FadeIn>
          ))}
        </section>

        <article className="prose prose-emerald dark:prose-invert max-w-none space-y-10 bg-muted/10 p-12 rounded-[3.5rem] border border-border/40">
          <FadeIn delay={0.4}>
            <h3 className="text-2xl font-black tracking-tight text-foreground">
              1. Information We Collect
            </h3>
            <p className="text-muted-foreground font-medium">
              We collect information that you provide directly to us, such as
              when you create an account. This may include your name, email
              address, and any wealth history or configurations you save in the
              application.
            </p>

            <h3 className="text-2xl font-black tracking-tight text-foreground">
              2. How We Use Your Data
            </h3>
            <p className="text-muted-foreground font-medium">
              Your data is used solely to provide and improve the services of
              Apna Khata. This includes processing records, generating reports,
              and sending security-related notifications.
            </p>

            <h3 className="text-2xl font-black tracking-tight text-foreground">
              3. Your Rights
            </h3>
            <p className="text-muted-foreground font-medium">
              You have the right to access, export, or delete your data at any
              time through the "Settings" menu in the dashboard. If you choose
              to delete your account, all your data will be permanently removed
              from our servers within 30 days.
            </p>
          </FadeIn>
        </article>
      </div>
    </div>
  );
}
