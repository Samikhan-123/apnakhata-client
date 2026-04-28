"use client";

import React from "react";
import {
  ShieldCheck,
  ShieldAlert,
  Info,
  Zap,
  Fingerprint,
  Globe,
  Activity,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { FadeIn } from "@/components/ui/FramerMotion";

const scoringRules = [
  {
    category: "Trust Signals",
    items: [
      {
        name: "Google OAuth",
        impact: "+15",
        type: "TRUST",
        detail: "Verified identity via Google IDP",
        icon: Zap,
      },
      {
        name: "Email Verified",
        impact: "0",
        type: "TRUST",
        detail: "Baseline requirement for trust",
        icon: ShieldCheck,
      },
    ],
  },
  {
    category: "Risk Signals",
    items: [
      {
        name: "Data Center / VPN",
        impact: "-30",
        type: "RISK",
        detail: "Connection via non-residential node",
        icon: Globe,
      },
      {
        name: "Unverified Email",
        impact: "-20",
        type: "RISK",
        detail: "Identity not confirmed via OTP",
        icon: ShieldAlert,
      },
      {
        name: "Scraper Activity",
        impact: "-20",
        type: "RISK",
        detail: "Anomaly behavior from unverified id",
        icon: Activity,
      },
      {
        name: "Untraceable Session",
        impact: "-15",
        type: "RISK",
        detail: "Location lookup blocked or timed out",
        icon: Fingerprint,
      },
      {
        name: "Limited Metadata",
        impact: "-5",
        type: "INFO",
        detail: "Incomplete connection signature",
        icon: Info,
      },
    ],
  },
];

export const SecurityScoringTable = () => {
  return (
    <FadeIn>
      <div className="premium-card p-8 rounded-[2.5rem] border border-border/10">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 rounded-xl bg-primary/5 border border-primary/20 text-primary">
            <Info className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-xl font-black tracking-tight">
              Scoring Intelligence Reference
            </h2>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              Internal Security Logic
            </p>
          </div>
        </div>

        <div className="space-y-10">
          {scoringRules.map((group) => (
            <div key={group.category}>
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40 mb-4 px-1">
                {group.category}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {group.items.map((item) => (
                  <div
                    key={item.name}
                    className="group p-4 rounded-2xl bg-muted/20 border border-transparent hover:border-primary/20 hover:bg-muted/30 transition-all"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <item.icon
                          className={cn(
                            "h-4 w-4",
                            item.type === "TRUST"
                              ? "text-emerald-500"
                              : item.type === "RISK"
                                ? "text-rose-500"
                                : "text-muted-foreground",
                          )}
                        />
                        <span className="text-sm font-bold text-foreground">
                          {item.name}
                        </span>
                      </div>
                      <span
                        className={cn(
                          "text-[10px] font-black px-2 py-0.5 rounded-full",
                          item.type === "TRUST"
                            ? "bg-emerald-500/10 text-emerald-500"
                            : item.type === "RISK"
                              ? "bg-rose-500/10 text-rose-500"
                              : "bg-muted text-muted-foreground",
                        )}
                      >
                        {item.impact} pts
                      </span>
                    </div>
                    <p className="text-[10px] font-medium text-muted-foreground/60 leading-relaxed px-7">
                      {item.detail}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 pt-6 border-t border-dashed border-border/20 flex items-start gap-3">
          <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
          <p className="text-[10px] font-medium text-muted-foreground/70 leading-relaxed">
            Scores are normalized between{" "}
            <span className="text-foreground font-black">0-100%</span>. Sessions
            below <span className="text-rose-500 font-black">40%</span> are
            automatically flagged as Critical Risk for immediate staff
            intervention.
          </p>
        </div>
      </div>
    </FadeIn>
  );
};
