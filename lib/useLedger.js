"use client";

import { useEffect, useState } from "react";
import { seedCategories, seedRecords, withDesk } from "./model";

const storageKey = "kynx-desk-v2";

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

export function useLedger() {
  const [desk, setDesk] = useState({ records: seedRecords, categories: seedCategories });

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) || "null");
      if (saved && Array.isArray(saved.records) && saved.categories) setDesk(saved);
    } catch {
      /* keep the sample desk */
    }
  }, []);

  function persist(next) {
    setDesk(next);
    localStorage.setItem(storageKey, JSON.stringify(next));
  }

  function updateRecord(recordId, change) {
    persist({
      ...desk,
      records: desk.records.map((record) => (record.id === recordId ? change(record) : record)),
    });
  }

  function verifyDocument(recordId, field) {
    updateRecord(recordId, (record) => ({ ...record, [field]: "Verified" }));
  }

  function setDeliverableState(recordId, deliverableId, state) {
    updateRecord(recordId, (record) => ({
      ...record,
      deliverables: record.deliverables.map((item) => {
        if (item.id !== deliverableId) return item;
        const published = state === "Published";
        return {
          ...item,
          state,
          postedAt: published ? item.postedAt || "2026-10-14" : "",
          videoId: published ? item.videoId || `DEMO-${recordId.toUpperCase()}-X` : item.videoId,
        };
      }),
    }));
  }

  function saveDeliverableViews(recordId, deliverableId, views) {
    updateRecord(recordId, (record) => ({
      ...record,
      deliverables: record.deliverables.map((item) => (item.id === deliverableId ? { ...item, views } : item)),
    }));
  }

  function addNote(recordId, text) {
    const note = { id: `${Date.now()}`, text: text.slice(0, 280), at: new Date().toISOString() };
    updateRecord(recordId, (record) => ({ ...record, notes: [...record.notes, note] }));
  }

  function setCategories(creatorId, nextCategories) {
    if (nextCategories.length === 0) return;
    persist({ ...desk, categories: { ...desk.categories, [creatorId]: nextCategories } });
  }

  function markPaid(recordId) {
    updateRecord(recordId, (record) => ({ ...record, payment: "Paid" }));
  }

  function clearAccountHold(recordId) {
    updateRecord(recordId, (record) => ({ ...record, accountHold: false }));
  }

  return {
    ...withDesk(desk.records, desk.categories),
    categoryMap: desk.categories,
    verifyDocument,
    setDeliverableState,
    saveDeliverableViews,
    addNote,
    setCategories,
    markPaid,
    clearAccountHold,
    reset() {
      persist(clone({ records: seedRecords, categories: seedCategories }));
    },
  };
}
