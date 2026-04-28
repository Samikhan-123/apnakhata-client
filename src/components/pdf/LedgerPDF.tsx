import React from "react";
import {
  Page,
  Text,
  View,
  Document,
} from "@react-pdf/renderer";
import { theme } from "./PDFTheme";
import { format } from "date-fns";

interface Transaction {
  id: string;
  type: "INCOME" | "EXPENSE";
  amount: number;
  category: { name: string };
  description: string;
  date: string;
}

interface Props {
  transactions: Transaction[];
  userName: string;
  filters?: {
    startDate?: string;
    endDate?: string;
  };
}

export const LedgerPDF = ({ transactions, userName, filters }: Props) => {
  const totalIncome = (transactions || [])
    .filter((t) => t?.type === "INCOME")
    .reduce((sum, t) => sum + (Number(t?.amount) || 0), 0);

  const totalExpense = (transactions || [])
    .filter((t) => t?.type === "EXPENSE")
    .reduce((sum, t) => sum + (Number(t?.amount) || 0), 0);

  // Helper for ultra-safe category resolution
  const getCategoryName = (t: any): string => {
    if (!t || !t.category) return "Uncategorized";
    if (typeof t.category === "object" && t.category !== null) {
      return t.category.name || "Uncategorized";
    }
    return t.category || "Uncategorized";
  };

  return (
    <Document title={`Records Export - ${userName}`}>
      <Page size="A4" style={theme.page}>
        <View style={theme.header}>
          <View style={theme.brandSection}>
            <Text style={theme.title}>APNA KHATA</Text>
            <Text style={theme.subtitle}>Records Report</Text>
          </View>
          <View style={theme.metaSection}>
            <Text style={theme.metaText}>Account: {userName}</Text>
            <Text style={theme.metaText}>
              Generated: {format(new Date(), "dd MMM yyyy")}
            </Text>
            {filters?.startDate && (
              <Text style={theme.metaText}>
                Period: {format(new Date(filters.startDate), "dd MMM")} -{" "}
                {format(new Date(filters.endDate || new Date()), "dd MMM yyyy")}
              </Text>
            )}
          </View>
        </View>

        <View style={{ flexDirection: "row", gap: 20, marginBottom: 20 }}>
          <View>
            <Text
              style={{
                fontSize: 8,
                color: "#64748b",
                textTransform: "uppercase",
              }}
            >
              Total Income
            </Text>
            <Text
              style={{ fontSize: 16, fontWeight: "bold", color: "#059669" }}
            >
              {(totalIncome || 0).toLocaleString("en-US", {
                style: "currency",
                currency: "PKR",
              })}
            </Text>
          </View>
          <View>
            <Text
              style={{
                fontSize: 8,
                color: "#64748b",
                textTransform: "uppercase",
              }}
            >
              Total Expenses
            </Text>
            <Text
              style={{ fontSize: 16, fontWeight: "bold", color: "#dc2626" }}
            >
              {(totalExpense || 0).toLocaleString("en-US", {
                style: "currency",
                currency: "PKR",
              })}
            </Text>
          </View>
          <View>
            <Text
              style={{
                fontSize: 8,
                color: "#64748b",
                textTransform: "uppercase",
              }}
            >
              Net Balance
            </Text>
            <Text
              style={{ fontSize: 16, fontWeight: "bold", color: "#030711" }}
            >
              {((totalIncome || 0) - (totalExpense || 0)).toLocaleString(
                "en-US",
                { style: "currency", currency: "PKR" },
              )}
            </Text>
          </View>
        </View>

        <Text style={theme.sectionTitle}>Digital Ledger Records</Text>

        <View style={theme.table}>
          {/* Header */}
          <View style={[theme.tableRow, theme.tableHeader]}>
            <View style={[theme.tableCol, { width: "15%" }]}>
              <Text style={theme.tableCellHeader}>Date</Text>
            </View>
            <View style={[theme.tableCol, { width: "20%" }]}>
              <Text style={theme.tableCellHeader}>Category</Text>
            </View>
            <View style={[theme.tableCol, { width: "40%" }]}>
              <Text style={theme.tableCellHeader}>Description</Text>
            </View>
            <View
              style={[theme.tableCol, { width: "25%", textAlign: "right" }]}
            >
              <Text style={theme.tableCellHeader}>Amount</Text>
            </View>
          </View>

          {/* Rows */}
          {(transactions || [])
            .filter((t) => t && typeof t === "object")
            .map((t: any) => (
              <View key={t.id || Math.random()} style={theme.tableRow}>
                <View style={[theme.tableCol, { width: "15%" }]}>
                  <Text style={theme.tableCell}>
                    {t.date ? format(new Date(t.date), "dd MMM yyyy") : "-"}
                  </Text>
                </View>
                <View style={[theme.tableCol, { width: "20%" }]}>
                  <Text style={theme.tableCell}>{getCategoryName(t)}</Text>
                </View>
                <View style={[theme.tableCol, { width: "40%" }]}>
                  <Text style={theme.tableCell}>{t.description || "-"}</Text>
                </View>
                <View
                  style={[theme.tableCol, { width: "25%", textAlign: "right" }]}
                >
                  <Text
                    style={[
                      theme.tableCell,
                      t.type === "INCOME" ? theme.income : theme.expense,
                    ]}
                  >
                    {t.type === "INCOME" ? "+" : "-"}
                    {(t.amount || 0).toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                    })}
                  </Text>
                </View>
              </View>
            ))}
        </View>

        <View style={theme.footer}>
          <Text style={theme.footerText}>
            Apna Khata - Financial Clarity & Secure Mastery
          </Text>
          <Text style={theme.footerText}>Page 1 of 1</Text>
        </View>
      </Page>
    </Document>
  );
};
