import { creators } from "./model";

// Columns the site reads back from the sheet. Creator, Handle, and Views are written by the site only.
const editable = [
  ["Program", "program"],
  ["PIC", "owner"],
  ["KOL Confirmation", "kolConfirmation"],
  ["KYNX Approval", "kynxApproval"],
  ["Brand Approval", "brandApproval"],
  ["Rate", "rate"],
  ["Invoice", "invoice"],
  ["MOA", "moa"],
  ["Draft Status", "draftStatus"],
  ["Post Due", "postDue"],
  ["Post Date", "postDate"],
];

const choices = {
  kolConfirmation: ["Pitching", "Confirmed", "Dropped", "Rejected"],
  kynxApproval: ["Pending", "Approved", "Rejected", "Dropped"],
  brandApproval: ["", "For approval", "Approved"],
  invoice: ["Yes", "No"],
  moa: ["Missing", "Needs review", "Verified"],
  draftStatus: ["", "For review", "For revision", "Approved", "Approved after revision"],
};

const configKey = "kynx-sheets-v1";

export function loadSheetConfig(campaignId) {
  try {
    const saved = JSON.parse(localStorage.getItem(configKey) || "{}");
    return { saved: saved[campaignId] || null, last: saved.last || null };
  } catch {
    return { saved: null, last: null };
  }
}

export function saveSheetConfig(campaignId, config) {
  try {
    const saved = JSON.parse(localStorage.getItem(configKey) || "{}");
    if (config) {
      saved[campaignId] = config;
      saved.last = { url: config.url, key: config.key };
    } else {
      delete saved[campaignId];
    }
    localStorage.setItem(configKey, JSON.stringify(saved));
    return true;
  } catch {
    return false;
  }
}

export function checkScriptUrl(url) {
  return /^https:\/\/script\.google\.com\/macros\/s\/[\w-]+\/exec$/.test(String(url || "").trim());
}

function time(value) {
  return Date.parse(value || "") || 0;
}

function pick(list, value) {
  const text = String(value ?? "").trim().toLowerCase();
  return list.find((item) => item.toLowerCase() === text);
}

function cleanDate(value) {
  const text = String(value ?? "").trim();
  if (!text) return "";
  return /^\d{4}-\d{2}-\d{2}$/.test(text) ? text : null;
}

// Reads one sheet row into record fields. Values the site can't use are listed in problems and left out.
function fieldsFromRow(row, campaign) {
  const fields = {};
  const problems = [];
  for (const [header, key] of editable) {
    if (!(header in row)) continue;
    const raw = row[header];
    const blank = String(raw ?? "").trim() === "";
    // A blank cell clears fields that can be empty and leaves the rest as they are.
    if (blank && !["brandApproval", "draftStatus", "postDue", "postDate"].includes(key)) continue;
    let value;
    if (choices[key]) value = pick(choices[key], raw);
    else if (key === "rate") {
      const number = Number(String(raw ?? "").replace(/[₱,\s]/g, "") || 0);
      value = Number.isFinite(number) && number >= 0 ? Math.round(number) : undefined;
    } else if (key === "postDue" || key === "postDate") value = cleanDate(raw) ?? undefined;
    else if (key === "program") value = pick(campaign.programs || [], raw);
    else value = String(raw ?? "").trim() || undefined;
    if (value === undefined) problems.push(`Row ${row._row}: ${header} "${raw}" was not used`);
    else fields[key] = value;
  }
  return { fields, problems };
}

function differs(record, fields) {
  return Object.entries(fields).some(([key, value]) => record[key] !== value);
}

function findCreator(row) {
  const handle = String(row.Handle || "").trim().replace(/^@/, "").toLowerCase();
  const name = String(row.Creator || "").trim().toLowerCase();
  return creators.find((creator) => (handle && creator.handle.toLowerCase() === handle) || (name && creator.name.toLowerCase() === name));
}

export function rowFor(record, creator, views) {
  return {
    "Record ID": record.id,
    Creator: creator?.name || "",
    Handle: creator?.handle ? `@${creator.handle}` : "",
    Program: record.program,
    PIC: record.owner,
    "KOL Confirmation": record.kolConfirmation,
    "KYNX Approval": record.kynxApproval,
    "Brand Approval": record.brandApproval,
    Rate: record.rate,
    Invoice: record.invoice,
    MOA: record.moa,
    "Draft Status": record.draftStatus,
    "Post Due": record.postDue,
    "Post Date": record.postDate,
    Views: views,
    "Updated At": record.updatedAt || "",
  };
}

// Works out what the site takes from the sheet. records are the campaign's rows from getCampaign.
export function mergeSheet(campaign, records, sheetRows) {
  const byId = new Map(records.map((record) => [record.id, record]));
  const patches = {};
  const added = [];
  const problems = [];
  let changed = 0;
  for (const row of sheetRows) {
    const id = String(row["Record ID"] || "").trim();
    const record = byId.get(id);
    if (record) {
      if (time(row["Updated At"]) <= time(record.updatedAt)) continue;
      const { fields, problems: issues } = fieldsFromRow(row, campaign);
      problems.push(...issues);
      // Always take the sheet's time, so the next push doesn't look older than the sheet.
      patches[id] = { ...fields, updatedAt: row["Updated At"] };
      if (differs(record, fields)) changed += 1;
      continue;
    }
    if (id) {
      problems.push(`Row ${row._row}: Record ID ${id} is not in this campaign`);
      continue;
    }
    const creator = findCreator(row);
    if (!creator) {
      if (row.Creator || row.Handle) problems.push(`Row ${row._row}: no creator on the desk matches "${row.Creator || row.Handle}"`);
      continue;
    }
    const { fields, problems: issues } = fieldsFromRow(row, campaign);
    problems.push(...issues);
    added.push({ creatorId: creator.id, row: row._row, fields: { program: campaign.programs?.[0] || "General", owner: "Annie", ...fields, updatedAt: row["Updated At"] || new Date().toISOString() } });
  }
  return { patches, added, problems, changed: changed + added.length };
}

export async function callSheet(config, rows) {
  const response = await fetch(config.url.trim(), {
    method: "POST",
    // text/plain keeps the browser from sending a preflight request, which Apps Script can't answer.
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify({ key: config.key, tab: config.tab, rows }),
  });
  if (!response.ok) throw new Error(`The sheet answered ${response.status}.`);
  const data = await response.json().catch(() => null);
  if (!data) throw new Error("The sheet did not answer with data. Check the web app is deployed for Anyone.");
  if (!data.ok) throw new Error(data.error || "The sheet refused the sync.");
  return data;
}
