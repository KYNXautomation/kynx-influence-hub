"use client";

import { useEffect, useState } from "react";
import { parseTsv } from "./revenueTracker";

const storageKey = "kynx-payment-sheet-v1";

export const paymentStatuses = ["Pending", "Urgent", "Processing", "Paid", "On hold"];

// Same order as the Lark "Payment Request - KOLs" sheet, so rows pasted from Lark land in the right cells.
export const sheetColumns = [
  { key: "pic", label: "PIC", width: 110, type: "pic" },
  { key: "fullName", label: "Full Name", width: 200, tone: "name" },
  { key: "username", label: "KOL Username", width: 170, tone: "name" },
  { key: "accountNumber", label: "Account Number", width: 160 },
  { key: "accountName", label: "Account Name", width: 200 },
  { key: "status", label: "Payment Status", width: 140, type: "status" },
  { key: "dueDate", label: "Due Date", width: 140, type: "date" },
  { key: "paymentDate", label: "Payment Date", width: 140, type: "date" },
  { key: "reference", label: "Reference #", width: 140 },
  { key: "proof", label: "Proof of Payment [Final payment]", width: 210, type: "link" },
  { key: "moa", label: "MOA", width: 190, type: "link" },
  { key: "amount", label: "Amount (₱)", width: 120, type: "amount" },
];

let rowCount = 0;

export function blankRow(fields = {}) {
  rowCount += 1;
  return {
    id: `p-${Date.now().toString(36)}${rowCount}`,
    recordId: "",
    pic: "",
    fullName: "",
    username: "",
    accountNumber: "",
    accountName: "",
    status: "Pending",
    dueDate: "",
    paymentDate: "",
    reference: "",
    proof: "",
    moa: "",
    amount: 0,
    ...fields,
  };
}

// A confirmed KOL on the tracker becomes a payment row.
export function rowFromRecord(record) {
  const affiliate = record.affiliate || {};
  return blankRow({
    recordId: record.id,
    pic: record.owner || "",
    fullName: affiliate.legalName || record.creator.name,
    username: record.creator.handle || "",
    accountName: affiliate.accountName || "",
    status: record.payment === "Paid" ? "Paid" : "Pending",
    dueDate: record.postDue || "",
    amount: record.rate || 0,
  });
}

// Accepts 2026-09-27, 9/27/2026, or 9/27/26 and returns 2026-09-27.
export function toIsoDate(value) {
  const text = String(value || "").trim();
  if (!text) return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(text)) return text;
  const match = text.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2,4})$/);
  if (!match) return "";
  const year = match[3].length === 2 ? `20${match[3]}` : match[3];
  return `${year}-${match[1].padStart(2, "0")}-${match[2].padStart(2, "0")}`;
}

// Turns cells copied from Lark (tab-separated) into rows.
export function rowsFromPaste(text) {
  return parseTsv(text)
    .filter((cells) => cells[1]?.trim().toLowerCase() !== "full name")
    .map((cells) => {
      const fields = {};
      sheetColumns.forEach((column, index) => {
        const value = (cells[index] || "").trim();
        if (column.type === "date") fields[column.key] = toIsoDate(value);
        else if (column.type === "amount") fields[column.key] = Number(value.replace(/[^\d.]/g, "")) || 0;
        else if (column.type === "status") fields[column.key] = paymentStatuses.find((item) => item.toLowerCase() === value.toLowerCase()) || "Pending";
        else fields[column.key] = value;
      });
      return blankRow(fields);
    });
}

const empty = { tabs: [], rows: {} };

export function usePaymentSheet() {
  const [sheet, setSheet] = useState(empty);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) || "null");
      if (saved && Array.isArray(saved.tabs) && saved.rows) setSheet(saved);
    } catch {
      /* start empty */
    }
    setReady(true);
  }, []);

  function commit(change) {
    let ok = true;
    setSheet((current) => {
      const next = change(current);
      try {
        localStorage.setItem(storageKey, JSON.stringify(next));
      } catch {
        ok = false;
      }
      return next;
    });
    return ok;
  }

  // One tab per campaign, filled with its confirmed KOLs the first time it appears.
  function ensureCampaignTabs(campaigns, records) {
    const missing = campaigns.filter((campaign) => !sheet.tabs.some((tab) => tab.campaignId === campaign.id));
    if (!missing.length) return;
    commit((current) => {
      const tabs = [...current.tabs];
      const rows = { ...current.rows };
      missing.forEach((campaign) => {
        if (tabs.some((tab) => tab.campaignId === campaign.id)) return;
        const id = `tab-${campaign.id}`;
        tabs.push({ id, name: campaign.name, campaignId: campaign.id });
        rows[id] = records.filter((record) => record.campaignId === campaign.id && record.onTracker).map(rowFromRecord);
      });
      return { ...current, tabs, rows };
    });
  }

  function addTab(name) {
    const id = `tab-${Date.now().toString(36)}`;
    commit((current) => ({ ...current, tabs: [...current.tabs, { id, name, campaignId: "" }], rows: { ...current.rows, [id]: [] } }));
    return id;
  }

  function renameTab(tabId, name) {
    commit((current) => ({ ...current, tabs: current.tabs.map((tab) => (tab.id === tabId ? { ...tab, name } : tab)) }));
  }

  function removeTab(tabId) {
    commit((current) => {
      const rows = { ...current.rows };
      delete rows[tabId];
      // A campaign tab stays as an empty, hidden marker so it is not rebuilt on the next visit.
      const tabs = current.tabs.map((tab) => (tab.id === tabId && tab.campaignId ? { ...tab, hidden: true } : tab)).filter((tab) => tab.id !== tabId || tab.campaignId);
      return { ...current, tabs, rows };
    });
  }

  function addRows(tabId, newRows) {
    return commit((current) => ({ ...current, rows: { ...current.rows, [tabId]: [...(current.rows[tabId] || []), ...newRows] } }));
  }

  function updateCell(tabId, rowId, key, value) {
    return commit((current) => ({
      ...current,
      rows: {
        ...current.rows,
        [tabId]: (current.rows[tabId] || []).map((row) => {
          if (row.id !== rowId) return row;
          const next = { ...row, [key]: value };
          // Marking a row paid fills in today's payment date if it is empty.
          if (key === "status" && value === "Paid" && !row.paymentDate) next.paymentDate = new Date().toLocaleDateString("en-CA");
          return next;
        }),
      },
    }));
  }

  function removeRow(tabId, rowId) {
    commit((current) => ({ ...current, rows: { ...current.rows, [tabId]: (current.rows[tabId] || []).filter((row) => row.id !== rowId) } }));
  }

  return {
    ready,
    tabs: sheet.tabs.filter((tab) => !tab.hidden),
    rowsFor: (tabId) => sheet.rows[tabId] || [],
    ensureCampaignTabs,
    addTab,
    renameTab,
    removeTab,
    addRows,
    updateCell,
    removeRow,
  };
}
