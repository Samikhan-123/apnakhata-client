import React from "react";
import { Page, Text, View, Document } from "@react-pdf/renderer";
import { theme } from "./PDFTheme";
import { format } from "date-fns";

interface CategoryStat {
  name: string;
  total: number;
  percentage: number;
}

interface BudgetStat {
  category: string;
  limit: number;
  spent: number;
  progress: number;
}

interface ReportData {
  summary: {
    totalIncome: number;
    totalExpense: number;
    netSavings: number;
    savingsRate: number;
  };
  categoryStats: CategoryStat[];
  activeBudgets: BudgetStat[];
  period: {
    startDate: string;
    endDate: string;
  };
}

interface Props {
  data: ReportData;
  userName: string;
}

export const ReportPDF = ({ data, userName }: Props) => {
  return (
    <Document title={`Monthly Statement - ${userName}`}>
      <Page size="A4" style={theme.page}>
        <View style={theme.header}>
          <View style={theme.brandSection}>
            <Text style={theme.title}>APNA KHATA</Text>
            <Text style={theme.subtitle}>Monthly Financial Statement</Text>
          </View>
          <View style={theme.metaSection}>
            <Text style={theme.metaText}>Prepared for: {userName}</Text>
            <Text style={theme.metaText}>
              Period: {format(new Date(data.period.startDate), "dd MMM")} -{" "}
              {format(new Date(data.period.endDate), "dd MMM yyyy")}
            </Text>
            <Text style={theme.metaText}>
              Generated: {format(new Date(), "dd MMM yyyy")}
            </Text>
          </View>
        </View>

        {/* Executive Summary */}
        <View
          style={{
            backgroundColor: "#f8fafc",
            padding: 15,
            borderRadius: 8,
            marginBottom: 20,
          }}
        >
          <Text
            style={[theme.sectionTitle, { marginTop: 0, marginBottom: 15 }]}
          >
            Executive Summary
          </Text>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <View>
              <Text style={{ fontSize: 8, color: "#64748b" }}>
                Total Income
              </Text>
              <Text
                style={{ fontSize: 14, fontWeight: "bold", color: "#059669" }}
              >
                {(data?.summary?.totalIncome || 0).toLocaleString("en-US", {
                  style: "currency",
                  currency: "PKR",
                })}
              </Text>
            </View>
            <View>
              <Text style={{ fontSize: 8, color: "#64748b" }}>
                Total Expenses
              </Text>
              <Text
                style={{ fontSize: 14, fontWeight: "bold", color: "#dc2626" }}
              >
                {(data?.summary?.totalExpense || 0).toLocaleString("en-US", {
                  style: "currency",
                  currency: "PKR",
                })}
              </Text>
            </View>
            <View>
              <Text style={{ fontSize: 8, color: "#64748b" }}>Net Savings</Text>
              <Text
                style={{ fontSize: 14, fontWeight: "bold", color: "#030711" }}
              >
                {(data?.summary?.netSavings || 0).toLocaleString("en-US", {
                  style: "currency",
                  currency: "PKR",
                })}
              </Text>
            </View>
            <View>
              <Text style={{ fontSize: 8, color: "#64748b" }}>
                Savings Rate
              </Text>
              <Text
                style={{ fontSize: 14, fontWeight: "bold", color: "#6366f1" }}
              >
                {(data?.summary?.savingsRate || 0).toFixed(1)}%
              </Text>
            </View>
          </View>
        </View>

        {/* Category Breakdown */}
        <Text style={theme.sectionTitle}>Expense Breakdown by Category</Text>
        <View style={theme.table}>
          <View style={[theme.tableRow, theme.tableHeader]}>
            <View style={[theme.tableCol, { width: "50%" }]}>
              <Text style={theme.tableCellHeader}>Category</Text>
            </View>
            <View
              style={[theme.tableCol, { width: "25%", textAlign: "right" }]}
            >
              <Text style={theme.tableCellHeader}>Percentage</Text>
            </View>
            <View
              style={[theme.tableCol, { width: "25%", textAlign: "right" }]}
            >
              <Text style={theme.tableCellHeader}>Total Spent</Text>
            </View>
          </View>

          {(data?.categoryStats || []).map((cat, index) => (
            <View key={index} style={theme.tableRow}>
              <View style={[theme.tableCol, { width: "50%" }]}>
                <Text style={theme.tableCell}>{cat?.name || "Unknown"}</Text>
              </View>
              <View
                style={[theme.tableCol, { width: "25%", textAlign: "right" }]}
              >
                <Text style={theme.tableCell}>
                  {(cat?.percentage || 0).toFixed(1)}%
                </Text>
              </View>
              <View
                style={[theme.tableCol, { width: "25%", textAlign: "right" }]}
              >
                <Text style={theme.tableCell}>
                  {(cat?.total || 0).toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                  })}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Budget Status */}
        {(data?.activeBudgets || []).length > 0 && (
          <>
            <Text style={theme.sectionTitle}>Active Budgets Tracking</Text>
            <View style={theme.table}>
              <View style={[theme.tableRow, theme.tableHeader]}>
                <View style={[theme.tableCol, { width: "40%" }]}>
                  <Text style={theme.tableCellHeader}>Category</Text>
                </View>
                <View
                  style={[theme.tableCol, { width: "20%", textAlign: "right" }]}
                >
                  <Text style={theme.tableCellHeader}>Limit</Text>
                </View>
                <View
                  style={[theme.tableCol, { width: "20%", textAlign: "right" }]}
                >
                  <Text style={theme.tableCellHeader}>Spent</Text>
                </View>
                <View
                  style={[theme.tableCol, { width: "20%", textAlign: "right" }]}
                >
                  <Text style={theme.tableCellHeader}>Status</Text>
                </View>
              </View>

              {(data?.activeBudgets || []).map((b, index) => (
                <View key={index} style={theme.tableRow}>
                  <View style={[theme.tableCol, { width: "40%" }]}>
                    <Text style={theme.tableCell}>
                      {b?.category || "Unknown"}
                    </Text>
                  </View>
                  <View
                    style={[
                      theme.tableCol,
                      { width: "20%", textAlign: "right" },
                    ]}
                  >
                    <Text style={theme.tableCell}>
                      {(b?.limit || 0).toLocaleString()}
                    </Text>
                  </View>
                  <View
                    style={[
                      theme.tableCol,
                      { width: "20%", textAlign: "right" },
                    ]}
                  >
                    <Text style={theme.tableCell}>
                      {(b?.spent || 0).toLocaleString()}
                    </Text>
                  </View>
                  <View
                    style={[
                      theme.tableCol,
                      { width: "20%", textAlign: "right" },
                    ]}
                  >
                    <Text
                      style={[
                        theme.tableCell,
                        (b?.progress || 0) >= 100
                          ? { color: "#dc2626", fontWeight: "bold" }
                          : { color: "#059669" },
                      ]}
                    >
                      {(b?.progress || 0) >= 100
                        ? "EXCEEDED"
                        : `${(100 - (b?.progress || 0)).toFixed(1)}% LEFT`}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </>
        )}

        <View style={theme.footer}>
          <Text style={theme.footerText}>
            Secure personal finance mastery with Apna Khata.
          </Text>
          <Text style={theme.footerText}>
            This is a computer generated report and does not require a
            signature.
          </Text>
        </View>
      </Page>
    </Document>
  );
};
