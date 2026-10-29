"use client";

import { useEffect, useRef, useState } from "react";
import { creators } from "../lib/model";
import { newNomination } from "../lib/useLedger";
import { callSheet, checkScriptUrl, loadSheetConfig, mergeSheet, rowFor, saveSheetConfig } from "../lib/sheetSync";
import { sheetScript } from "../lib/sheetScript";

const everyMs = 30_000;

function sameRow(siteRow, sheetRow) {
  if (!sheetRow) return false;
  return Object.entries(siteRow).every(([header, value]) => header === "_row" || String(value ?? "") === String(sheetRow[header] ?? ""));
}

function clock(at) {
  return new Date(at).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

// Two-way sync between this campaign and one tab of a Google Sheet, through the Apps Script in lib/sheetScript.js.
export function SheetSync({ campaign, applySheet, changeTick }) {
  const [config, setConfig] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ url: "", key: "", tab: campaign.name });
  const [status, setStatus] = useState({ state: "idle" });
  const [copied, setCopied] = useState(false);
  const busy = useRef(false);
  const latest = useRef({ campaign, config, applySheet });
  latest.current = { campaign, config, applySheet };

  useEffect(() => {
    const { saved, last } = loadSheetConfig(campaign.id);
    setConfig(saved);
    setForm({ url: saved?.url || last?.url || "", key: saved?.key || last?.key || "", tab: saved?.tab || campaign.name });
  }, [campaign.id, campaign.name]);

  async function sync() {
    const { campaign: current, config: settings, applySheet: apply } = latest.current;
    if (!settings || busy.current) return;
    busy.current = true;
    setStatus((value) => ({ ...value, state: "syncing" }));
    try {
      const read = await callSheet(settings, null);
      const { patches, added, problems, changed } = mergeSheet(current, current.records, read.rows);
      const fresh = added.map((item) => newNomination({ campaignId: current.id, creatorId: item.creatorId, ...item.fields }));
      if (Object.keys(patches).length || fresh.length) apply(patches, fresh);

      const sheetById = new Map(read.rows.map((row) => [row["Record ID"], row]));
      const rows = current.records
        .map((record) => rowFor({ ...record, ...(patches[record.id] || {}) }, record.creator, record.views))
        .filter((row) => !sameRow(row, sheetById.get(row["Record ID"])));
      fresh.forEach((record, index) => {
        rows.push({ ...rowFor(record, creators.find((item) => item.id === record.creatorId), 0), _row: added[index].row });
      });
      const wrote = rows.length ? await callSheet(settings, rows) : { skipped: 0 };
      setStatus({ state: "ok", at: Date.now(), pulled: changed, pushed: rows.length - (wrote.skipped || 0), problems });
    } catch (error) {
      const message = error instanceof TypeError ? "Could not reach the sheet. Check the web app URL and your connection." : error.message;
      setStatus({ state: "error", at: Date.now(), message });
    } finally {
      busy.current = false;
    }
  }

  const syncRef = useRef(sync);
  syncRef.current = sync;

  // Sync on open, every 30 seconds while the tab is visible.
  useEffect(() => {
    if (!config) return undefined;
    syncRef.current();
    const timer = setInterval(() => {
      if (document.visibilityState === "visible") syncRef.current();
    }, everyMs);
    return () => clearInterval(timer);
  }, [config]);

  // Sync shortly after a change made on this page.
  useEffect(() => {
    if (!config || !changeTick) return undefined;
    const timer = setTimeout(() => syncRef.current(), 1500);
    return () => clearTimeout(timer);
  }, [changeTick, config]);

  function connect(event) {
    event.preventDefault();
    const next = { url: form.url.trim(), key: form.key.trim(), tab: form.tab.trim() || campaign.name };
    if (/docs\.google\.com\/spreadsheets/.test(next.url)) {
      setStatus({ state: "error", message: "That's the sheet's own link. Paste the web app URL instead: in Apps Script, Deploy → Manage deployments → copy the Web app URL ending in /exec." });
      return;
    }
    if (!checkScriptUrl(next.url)) {
      setStatus({ state: "error", message: "Paste the web app URL from Apps Script. It starts with https://script.google.com/macros/s/ and ends with /exec." });
      return;
    }
    if (!next.key) {
      setStatus({ state: "error", message: "Add the sync key you saved as KYNX_KEY in the script." });
      return;
    }
    saveSheetConfig(campaign.id, next);
    setConfig(next);
    setEditing(false);
    setStatus({ state: "idle" });
  }

  function disconnect() {
    saveSheetConfig(campaign.id, null);
    setConfig(null);
    setEditing(false);
    setStatus({ state: "idle" });
  }

  async function copyScript() {
    try {
      await navigator.clipboard.writeText(sheetScript);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  const statusLine = status.state === "syncing"
    ? "Syncing…"
    : status.state === "ok"
      ? `Synced ${clock(status.at)} · ${status.pulled} ${status.pulled === 1 ? "change" : "changes"} from the sheet · ${status.pushed} ${status.pushed === 1 ? "row" : "rows"} sent`
      : status.state === "error"
        ? status.message
        : config ? "Connecting…" : "Not connected";

  return (
    <section className="panel sheet-sync" aria-label="Google Sheet sync">
      <div className="sheet-head">
        <div>
          <h2>Google Sheet</h2>
          <p className={status.state === "error" ? "meta sheet-error" : "meta"}>
            {config ? <>Tab <b>{config.tab}</b> · </> : null}{statusLine}
          </p>
        </div>
        <div className="button-row">
          {config && !editing ? <button className="apply" type="button" disabled={status.state === "syncing"} onClick={() => syncRef.current()}>Sync now</button> : null}
          <button className="ghost" type="button" onClick={() => setEditing(!editing)}>{editing ? "Close" : config ? "Settings" : "Connect a sheet"}</button>
        </div>
      </div>
      {status.state === "ok" && status.problems.length ? (
        <ul className="sheet-problems">
          {status.problems.slice(0, 6).map((problem) => <li key={problem}>{problem}</li>)}
          {status.problems.length > 6 ? <li>{status.problems.length - 6} more</li> : null}
        </ul>
      ) : null}
      {editing ? (
        <>
          <details className="sheet-steps" open={!config}>
            <summary>How to connect a sheet</summary>
            <ol>
              <li>Open the Google Sheet, then Extensions → Apps Script.</li>
              <li>Delete what's there and paste the script. <button className="ghost" type="button" onClick={copyScript}>{copied ? "Copied" : "Copy script"}</button></li>
              <li>Project Settings (gear) → Script properties → add <b>KYNX_KEY</b> with a long secret, like a password.</li>
              <li>Deploy → New deployment → type Web app. Execute as <b>Me</b>, who has access <b>Anyone</b>. Approve the access Google asks for.</li>
              <li>Copy the web app URL and paste it below with the same key.</li>
            </ol>
            <p className="meta">The script makes the tab and its columns on the first sync. Edit status, rate, PIC, and dates in either place. Add a row in the sheet with a creator's name or handle and it joins this campaign. Deleting a row in the sheet does not remove it here; it comes back on the next sync.</p>
          </details>
          <form className="roster-fields" onSubmit={connect}>
            <label className="wide">Web app URL<input value={form.url} placeholder="https://script.google.com/macros/s/…/exec" onChange={(event) => setForm({ ...form, url: event.target.value })} /></label>
            <label>Sync key<input type="password" autoComplete="off" value={form.key} onChange={(event) => setForm({ ...form, key: event.target.value })} /></label>
            <label>Tab name<input value={form.tab} onChange={(event) => setForm({ ...form, tab: event.target.value })} /></label>
            <div className="wide button-row">
              {config ? <button className="ghost" type="button" onClick={disconnect}>Disconnect</button> : null}
              <button className="save" type="submit">{config ? "Save" : "Connect"}</button>
            </div>
          </form>
        </>
      ) : null}
    </section>
  );
}
