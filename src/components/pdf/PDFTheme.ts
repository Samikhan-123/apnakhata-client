import { StyleSheet } from "@react-pdf/renderer";

// Register fonts if needed (using default Helvetica for reliability)
export const theme = StyleSheet.create({
  page: {
    padding: 40,
    backgroundColor: "#ffffff",
    fontFamily: "Helvetica",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
    borderBottom: 1,
    borderBottomColor: "#f1f5f9",
    paddingBottom: 20,
  },
  brandSection: {
    flexDirection: "column",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#030711", // Sapphire dark
  },
  subtitle: {
    fontSize: 10,
    color: "#64748b",
    marginTop: 4,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  metaSection: {
    textAlign: "right",
  },
  metaText: {
    fontSize: 9,
    color: "#94a3b8",
    marginBottom: 2,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#0f172a",
    marginBottom: 10,
    marginTop: 20,
    textTransform: "uppercase",
  },
  table: {
    width: "auto",
    marginTop: 10,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomColor: "#f1f5f9",
    borderBottomWidth: 1,
    alignItems: "center",
    minHeight: 30,
  },
  tableHeader: {
    backgroundColor: "#f8fafc",
    borderBottomWidth: 2,
    borderBottomColor: "#e2e8f0",
  },
  tableCol: {
    padding: 6,
  },
  tableCell: {
    fontSize: 9,
    color: "#334155",
  },
  tableCellHeader: {
    fontSize: 8,
    fontWeight: "bold",
    color: "#475569",
    textTransform: "uppercase",
  },
  // Row colors
  income: {
    color: "#059669", // Emerald 600
  },
  expense: {
    color: "#dc2626", // Rose 600
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    borderTop: 1,
    borderTopColor: "#f1f5f9",
    paddingTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  footerText: {
    fontSize: 8,
    color: "#94a3b8",
  },
});
