"use client";

import { useEffect, useState } from "react";

// Same tabs, columns, and formulas as "KYNX Creator's Information and Campaigns" (Creator Projects & Revenue Tracker).
// The figures are typed or pasted in the browser only. They never go into the site's code, which is public.
const storageKey = "kynx-revenue-v1";

const rate = 0.15; // KYNX commission and the talent manager's 15% share, as in the sheet
const round = (value) => Math.round(value * 100) / 100;
const num = (value) => Number(value) || 0;

export const dealStatuses = ["Ongoing", "Done", "Pending Payment", "Cancelled"];
export const payStatuses = ["Pending", "Pending Payment", "Paid"];
const yesNo = ["Yes", "No"];

const head = [
  { key: "projectDate", label: "Project Date", type: "date" },
  { key: "creator", label: "Creator", type: "creator" },
  { key: "postedLink", label: "Posted link", type: "link" },
];
const job = [
  { key: "brand", label: "Brand" },
  { key: "manager", label: "Talent Manager", type: "manager" },
  { key: "campaign", label: "Campaign" },
];
const tail = [
  { key: "billing", label: "Billing Statement", type: "link" },
  { key: "ar", label: "AR" },
  { key: "popKol", label: "Proof of Payment (sent to KOLs)", type: "link" },
];
const siDocs = [
  { key: "siDate", label: "SI Date", type: "date" },
  { key: "siNo", label: "SI No." },
  { key: "siFile", label: "SI File", type: "link" },
  { key: "received2307", label: "2307 Received", type: "select", options: yesNo },
  { key: "file2307", label: "2307 File", type: "link" },
];
const deal = { key: "dealStatus", label: "Deal Status", type: "select", options: dealStatuses };
const payStatus = { key: "paymentStatus", label: "Payment Status", type: "select", options: payStatuses };
const commissionStatus = { key: "commissionStatus", label: "Commission Payment Status", type: "select", options: payStatuses };
const popBrand = { key: "popBrand", label: "Proof of Payment (from brand)", type: "link" };
const dueKol = { key: "dueKol", label: "Payment Due Date (KOL side)", type: "date" };

export const trackers = [
  {
    id: "excl",
    name: "Exclusive · without SI",
    columns: [
      ...head,
      { key: "creatorStatus", label: "Creator Status", type: "select", options: ["Exclusive", "Non-exclusive"] },
      ...job,
      { key: "netPay", label: "Net Pay", type: "money" },
      { key: "kynxRevenue", label: "KYNX Revenue", type: "money", calc: (r) => num(r.netPay) * rate },
      { key: "tmCommission", label: "Talent Manager Commission (15%)", type: "money", calc: (r, c) => c.kynxRevenue * rate },
      { key: "kynxNet", label: "KYNX Net Revenue", type: "money", calc: (r, c) => c.kynxRevenue - c.tmCommission },
      { key: "talentPay", label: "Talent Pay", type: "money", calc: (r, c) => num(r.netPay) - c.kynxRevenue },
      deal,
      { key: "dueBrand", label: "Payment Due Date", type: "date" },
      payStatus,
      commissionStatus,
      popBrand,
      dueKol,
      { key: "popKynx", label: "KYNX Revenue POP", type: "link" },
      ...tail,
    ],
  },
  {
    id: "excl-si",
    name: "Exclusive · with SI",
    columns: [
      ...head,
      ...job,
      { key: "netReceivable", label: "Net Receivable", type: "money" },
      { key: "vat", label: "VAT (12%)", type: "money" },
      { key: "wht", label: "WHT (10%)", type: "money" },
      { key: "netAfterVat", label: "Net Pay after VAT", type: "money", calc: (r) => num(r.netReceivable) - num(r.vat) },
      { key: "kynxRevenue", label: "KYNX Revenue", type: "money", calc: (r, c) => c.netAfterVat * rate },
      { key: "tmCommission", label: "Talent Manager Commission (15%)", type: "money", calc: (r, c) => c.kynxRevenue * rate },
      { key: "kynxNet", label: "KYNX Net Revenue", type: "money", calc: (r, c) => c.kynxRevenue - c.tmCommission },
      { key: "talentPay", label: "Talent Pay", type: "money", calc: (r, c) => c.netAfterVat - c.kynxRevenue },
      deal,
      { key: "issuedSi", label: "Issued SI?", type: "select", options: yesNo },
      ...siDocs,
      { key: "dueBrand", label: "Payment Due Date (brand side)", type: "date" },
      payStatus,
      popBrand,
      dueKol,
      commissionStatus,
      ...tail,
    ],
  },
  {
    id: "nonexcl",
    name: "Non-exclusive · without SI",
    columns: [
      ...head,
      ...job,
      { key: "netPay", label: "Net Pay", type: "money" },
      { key: "kynxRevenue", label: "KYNX Revenue", type: "money" },
      { key: "tmCommission", label: "Talent Manager Commission (15%)", type: "money" },
      { key: "kynxNet", label: "KYNX Net Revenue", type: "money", calc: (r) => num(r.kynxRevenue) - num(r.tmCommission) },
      { key: "talentPay", label: "Talent Pay", type: "money" },
      deal,
      { key: "dueBrand", label: "Payment Due Date", type: "date" },
      payStatus,
      commissionStatus,
      popBrand,
      dueKol,
      ...tail,
    ],
  },
  {
    id: "nonexcl-si",
    name: "Non-exclusive · with SI",
    columns: [
      ...head,
      ...job,
      { key: "netReceivable", label: "Net Receivable", type: "money" },
      { key: "netAfterVat", label: "Net Pay after VAT", type: "money" },
      { key: "kynxRevenue", label: "KYNX Revenue", type: "money" },
      { key: "tmCommission", label: "Talent Manager Commission (15%)", type: "money", calc: (r) => num(r.kynxRevenue) * rate },
      { key: "kynxNet", label: "KYNX Net Revenue", type: "money", calc: (r, c) => num(r.kynxRevenue) - c.tmCommission },
      { key: "talentPay", label: "Talent Pay", type: "money" },
      { key: "vat", label: "VAT (12%)", type: "money" },
      { key: "wht", label: "WHT (10%)", type: "money" },
      deal,
      ...siDocs,
      { key: "dueBrand", label: "Payment Due Date (brand side)", type: "date" },
      payStatus,
      popBrand,
      dueKol,
      ...tail,
    ],
  },
  {
    id: "si",
    name: "SI Request",
    columns: [
      { key: "creator", label: "Talent", type: "creator" },
      { key: "manager", label: "Talent Manager who requested [PIC]", type: "manager" },
      { key: "requested", label: "Date Requested", type: "date" },
      { key: "campaign", label: "Campaign" },
      { key: "company", label: "Company Name" },
      { key: "address", label: "Company Address" },
      { key: "tin", label: "TIN" },
      { key: "description", label: "Description" },
      { key: "netAmount", label: "Net Amount", type: "money" },
      { key: "netOfVat", label: "Net of VAT", type: "money" },
      { key: "lessVat", label: "Less: VAT Amount", type: "money" },
      { key: "vatInclusive", label: "Total Sales VAT Inclusive", type: "money" },
      { key: "lessWht", label: "Less: Withholding Tax", type: "money" },
      { key: "addVat", label: "Add: VAT", type: "money" },
      { key: "amountDue", label: "Total Amount Due", type: "money" },
      { key: "siFile", label: "SI File", type: "link" },
      { key: "siNo", label: "SI No." },
      { key: "shipped", label: "Shipped to Client", type: "select", options: yesNo },
      { key: "dateShipped", label: "Date Shipped", type: "date" },
      { key: "correctSi", label: "Correct SI", type: "select", options: yesNo },
      { key: "notes", label: "Notes" },
    ],
  },
];

// Fills in every formula column, in column order, so later formulas can use earlier results.
export function computeRow(tracker, row) {
  const out = {};
  for (const column of tracker.columns) {
    out[column.key] = column.calc ? round(column.calc(row, out)) : column.type === "money" ? num(row[column.key]) : row[column.key];
  }
  return out;
}

export function sumColumn(tracker, rows, key) {
  if (!tracker.columns.some((column) => column.key === key)) return 0;
  return round(rows.reduce((total, row) => total + num(computeRow(tracker, row)[key]), 0));
}

// Spreadsheet copy is tab-separated; a cell with line breaks comes wrapped in quotes.
export function parseTsv(text) {
  const rows = [];
  let row = [];
  let cell = "";
  let quoted = false;
  const src = String(text || "").replace(/\r\n?/g, "\n");
  for (let i = 0; i < src.length; i += 1) {
    const ch = src[i];
    if (quoted) {
      if (ch === '"' && src[i + 1] === '"') { cell += '"'; i += 1; }
      else if (ch === '"') quoted = false;
      else cell += ch;
    } else if (ch === '"' && cell === "") quoted = true;
    else if (ch === "\t") { row.push(cell); cell = ""; }
    else if (ch === "\n") { row.push(cell); rows.push(row); row = []; cell = ""; }
    else cell += ch;
  }
  row.push(cell);
  rows.push(row);
  return rows.filter((cells) => cells.some((value) => value.trim()));
}

// "9/27/2026", "July 21, 2026", "2026-07-21", or an Excel day number become 2026-07-21.
export function toIsoDate(value) {
  const text = String(value || "").trim();
  if (!text) return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(text)) return text;
  if (/^\d{5}$/.test(text)) return new Date(Date.UTC(1899, 11, 30) + Number(text) * 86400000).toISOString().slice(0, 10);
  const slash = text.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2,4})$/);
  if (slash) return `${slash[3].length === 2 ? `20${slash[3]}` : slash[3]}-${slash[1].padStart(2, "0")}-${slash[2].padStart(2, "0")}`;
  const parsed = new Date(text.replace(/\./g, ""));
  return Number.isNaN(parsed.getTime()) ? "" : parsed.toLocaleDateString("en-CA");
}

const toMoney = (value) => Number(String(value || "").replace(/[^\d.-]/g, "")) || 0;

let rowCount = 0;
export function blankRow(fields = {}) {
  rowCount += 1;
  return { id: `r-${Date.now().toString(36)}${rowCount}`, ...fields };
}

// Pasted cells land in the tab's columns, left to right, the same order as the Excel tab.
export function rowsFromPaste(tracker, text) {
  return parseTsv(text)
    .filter((cells) => cells[1]?.trim() !== tracker.columns[1].label && cells[0]?.trim() !== tracker.columns[0].label)
    .map((cells) => {
      const fields = {};
      tracker.columns.forEach((column, index) => {
        if (column.calc) return;
        const value = (cells[index] || "").trim();
        fields[column.key] = column.type === "date" ? toIsoDate(value) : column.type === "money" ? toMoney(value) : value;
      });
      return blankRow(fields);
    });
}

export function useRevenueTracker() {
  const [rows, setRows] = useState({});
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) || "null");
      if (saved && typeof saved === "object") setRows(saved);
    } catch {
      /* start empty */
    }
    setReady(true);
  }, []);

  // Writes before showing, so a full browser store is reported instead of silently lost.
  function persist(next) {
    try {
      localStorage.setItem(storageKey, JSON.stringify(next));
    } catch {
      return false;
    }
    setRows(next);
    return true;
  }

  return {
    ready,
    rowsFor: (trackerId) => rows[trackerId] || [],
    addRows: (trackerId, added) => persist({ ...rows, [trackerId]: [...(rows[trackerId] || []), ...added] }),
    updateCell: (trackerId, rowId, key, value) =>
      persist({ ...rows, [trackerId]: (rows[trackerId] || []).map((row) => (row.id === rowId ? { ...row, [key]: value } : row)) }),
    removeRow: (trackerId, rowId) => persist({ ...rows, [trackerId]: (rows[trackerId] || []).filter((row) => row.id !== rowId) }),
  };
}
