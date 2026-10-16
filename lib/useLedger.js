"use client";

import { useEffect, useState } from "react";
import { deskToday, seedCategories, seedRecords, withDesk } from "./model";

const storageKey = "kynx-desk-v3";

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

const initial = { records: seedRecords, categories: seedCategories, campaigns: {}, extraCampaigns: [] };

export function useLedger() {
  const [desk, setDesk] = useState(initial);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) || "null");
      if (saved && Array.isArray(saved.records) && saved.records.every((record) => record.kolConfirmation) && saved.categories) {
        setDesk({ campaigns: {}, extraCampaigns: [], ...saved });
      }
    } catch {
      /* keep the sample desk */
    }
    setReady(true);
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

  function createCampaign(input) {
    const name = String(input.name || "").trim();
    if (!name) return "";
    const programs = String(input.programs || "")
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
    const id = `camp-${Date.now().toString(36)}`;
    const campaign = {
      id,
      name,
      short: name.slice(0, 18),
      brand: input.brand || "Shopee",
      client: String(input.client || "").trim() || "Shopee",
      objective: input.objective || "Awareness",
      description: "Opened on the desk. Shared columns match the client nomination sheet. Affiliate details stay internal.",
      start: input.start || deskToday,
      end: input.end || "",
      paymentStatus: "Processing",
      paymentDate: "",
      targetKols: Math.max(0, Math.round(Number(input.target) || 0)),
      revenue: Math.max(0, Math.round(Number(input.revenue) || 0)),
      boosting: Math.max(0, Math.round(Number(input.boosting) || 0)),
      vat: Math.max(0, Math.round(Number(input.vat) || 0)),
      owner: input.owner || "Annie",
      campaignStatus: "Active",
      programs: programs.length ? programs : ["General"],
      category: "",
      minFollowers: 0,
      createdHere: true,
    };
    persist({ ...desk, extraCampaigns: [...(desk.extraCampaigns || []), campaign] });
    return id;
  }

  function addNomination({ campaignId, creatorId, program, owner }) {
    const id = `n-${Date.now().toString(36)}`;
    const record = {
      id,
      creatorId,
      campaignId,
      program,
      owner,
      kolConfirmation: "Pitching",
      kynxApproval: "Pending",
      brandApproval: "",
      rate: 0,
      invoice: "No",
      taxesInclusive: "No",
      moa: "Missing",
      draftStatus: "",
      postDue: "",
      postDate: "",
      deliverables: [{ id: `${id}-v1`, title: "TikTok video 1", state: "Not submitted", postedAt: "", videoId: "", views: 0 }],
      accountHold: false,
      payment: "Pending",
      notes: [],
      affiliate: { legalName: "", phone: "", email: "", paymentMethod: "", bankName: "", accountName: "" },
    };
    persist({ ...desk, records: [...desk.records, record] });
    return id;
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
    ready,
    ...withDesk(desk.records, desk.categories, desk.campaigns || {}, desk.extraCampaigns || []),
    categoryMap: desk.categories,
    patchRecord,
    setDeliverableState,
    saveDeliverableViews,
    addNote,
    setCategories,
    markPosted,
    setCampaignPayment,
    createCampaign,
    addNomination,
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
