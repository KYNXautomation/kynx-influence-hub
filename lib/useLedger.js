"use client";

import { useEffect, useState } from "react";
import { deskToday, seedCategories, seedRecords, withDesk } from "./model";

const storageKey = "kynx-desk-v3";

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

const initial = { records: seedRecords, categories: seedCategories, campaigns: {} };

export function useLedger() {
  const [desk, setDesk] = useState(initial);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) || "null");
      if (saved && Array.isArray(saved.records) && saved.records.every((record) => record.kolConfirmation) && saved.categories) {
        setDesk({ campaigns: {}, ...saved });
      }
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

  function patchRecord(recordId, fields) {
    updateRecord(recordId, (record) => ({ ...record, ...fields }));
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
          postedAt: published ? item.postedAt || deskToday : "",
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

  function markPosted(recordId) {
    updateRecord(recordId, (record) => ({
      ...record,
      postDate: record.postDate || deskToday,
      draftStatus: record.draftStatus || "Approved",
      deliverables: record.deliverables.map((item, index) => (index === 0 && item.state !== "Published"
        ? { ...item, state: "Published", postedAt: deskToday, videoId: item.videoId || `DEMO-${recordId.toUpperCase()}-1`, views: item.views || 0 }
        : item)),
    }));
  }

  function setCampaignPayment(campaignId, paymentStatus) {
    persist({
      ...desk,
      campaigns: {
        ...desk.campaigns,
        [campaignId]: { ...desk.campaigns[campaignId], paymentStatus, paymentDate: paymentStatus === "Paid" ? deskToday : "" },
      },
    });
  }

  return {
    ...withDesk(desk.records, desk.categories, desk.campaigns || {}),
    categoryMap: desk.categories,
    patchRecord,
    setDeliverableState,
    saveDeliverableViews,
    addNote,
    setCategories,
    markPosted,
    setCampaignPayment,
    markPaid(recordId) {
      patchRecord(recordId, { payment: "Paid" });
    },
    clearAccountHold(recordId) {
      patchRecord(recordId, { accountHold: false });
    },
    reset() {
      persist(clone(initial));
    },
  };
}
