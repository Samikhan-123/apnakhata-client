import { pdf } from '@react-pdf/renderer';
import React from 'react';
import { format } from 'date-fns';
import { LedgerPDF } from '../components/pdf/LedgerPDF';
import { ReportPDF } from '../components/pdf/ReportPDF';

/**
 * Trigger browser download for a blob
 */
const downloadBlob = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const exportToCSV = (data: any[], filename: string) => {
  if (!data || data.length === 0) return;

  const headers = ['Date', 'Description', 'Category', 'Type', 'Amount'];
  const BOM = '\uFEFF';

  const csvRows = [
    headers.join(','),
    ...data.map(row => {
      const dateStr = row.date ? format(new Date(row.date), 'dd MMM yyyy') : '-';
      return [
        `"${dateStr}"`,
        `"${(row.description || '').replace(/"/g, '""')}"`,
        `"${row.category?.name || row.category || 'Uncategorized'}"`,
        `"${row.type}"`,
        row.amount
      ].join(',');
    })
  ];

  const blob = new Blob([BOM + csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
  downloadBlob(blob, `${filename}.csv`);
};

export const exportLedgerToPDF = async (transactions: any[], userName: string, filters: any) => {
  const doc = React.createElement(LedgerPDF, { transactions, userName, filters }) as React.ReactElement<any>;
  const blob = await pdf(doc).toBlob();
  downloadBlob(blob, `ApnaKhata_Records_${format(new Date(), 'dd_MMM_yyyy')}.pdf`);
};

export const exportReportToPDF = async (data: any, userName: string) => {
  const doc = React.createElement(ReportPDF, { data, userName }) as React.ReactElement<any>;
  const blob = await pdf(doc).toBlob();
  downloadBlob(blob, `ApnaKhata_Report_${format(new Date(), 'dd_MMM_yyyy')}.pdf`);
};

/**
 * XML-based Excel Export (Lightweight)
 */
export const exportToExcel = (data: any[], filename: string) => {
  let xml = `<?xml version="1.0"?><?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet" xmlns:html="http://www.w3.org/TR/REC-html40">
  <Styles>
    <Style ss:ID="header"><Font ss:Bold="1" ss:Color="#FFFFFF"/><Interior ss:Color="#030711" ss:Pattern="Solid"/></Style>
    <Style ss:ID="income"><Font ss:Color="#059669"/></Style>
    <Style ss:ID="expense"><Font ss:Color="#dc2626"/></Style>
  </Styles>
  <Worksheet ss:Name="Records">
    <Table>
      <Column ss:Width="100"/>
      <Column ss:Width="250"/>
      <Column ss:Width="120"/>
      <Column ss:Width="80"/>
      <Column ss:Width="80"/>
      <Row ss:StyleID="header">
        <Cell><Data ss:Type="String">Date</Data></Cell>
        <Cell><Data ss:Type="String">Description</Data></Cell>
        <Cell><Data ss:Type="String">Category</Data></Cell>
        <Cell><Data ss:Type="String">Type</Data></Cell>
        <Cell><Data ss:Type="String">Amount</Data></Cell>
      </Row>`;

  data.forEach(row => {
    const style = row.type === 'INCOME' ? 'income' : 'expense';
    const dateStr = row.date ? format(new Date(row.date), 'dd MMM yyyy') : '-';
    xml += `
      <Row>
        <Cell><Data ss:Type="String">${dateStr}</Data></Cell>
        <Cell><Data ss:Type="String">${(row.description || '-').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</Data></Cell>
        <Cell><Data ss:Type="String">${row.category?.name || row.category || 'Uncategorized'}</Data></Cell>
        <Cell ss:StyleID="${style}"><Data ss:Type="String">${row.type}</Data></Cell>
        <Cell><Data ss:Type="Number">${row.amount}</Data></Cell>
      </Row>`;
  });

  xml += `
    </Table>
  </Worksheet>
</Workbook>`;

  const blob = new Blob([xml], { type: 'application/vnd.ms-excel' });
  downloadBlob(blob, `${filename}.xls`);
};
