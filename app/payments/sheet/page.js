"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Workspace } from "../../../components/Workspace";
import { useLedger } from "../../../lib/useLedger";
import { paymentStatuses, rowFromRecord, rowsFromPaste, sheetColumns, blankRow, usePaymentSheet } from "../../../lib/usePaymentSheet";
import { formatPeso } from "../../../lib/format";

const pics = ["Annie", "Nisha", "Daneca"];

function statusClass(status) {
  return `pay-status pay-${String(status || "Pending").toLowerCase().replace(/\s+/g, "-")}`;
}

function shortLink(url) {
  return url.replace(/^https?:\/\/(www\.)?/, "");
}

function Cell({ column, row, onChange }) {
  const value = row[column.key];
  if (column.type === "pic") {
    return (
      <select className="sheet-input pic-select" value={value} onChange={(event) => onChange(event.target.value)}>
        <option value="">—</option>
        {[...new Set([...pics, value].filter(Boolean))].map((name) => <option key={name}>{name}</option>)}
      </select>
    );
  }
  if (column.type === "status") {
    return (
      <select className={`sheet-input ${statusClass(value)}`} value={value} onChange={(event) => onChange(event.target.value)}>
        {paymentStatuses.map((item) => <option key={item}>{item}</option>)}
      </select>
    );
  }
  if (column.type === "date") {
    return <input className="sheet-input" type="date" value={value} onChange={(event) => onChange(event.target.value)} />;
  }
  if (column.type === "amount") {
    return (
      <input
        className="sheet-input num"
        inputMode="numeric"
        value={value || ""}
        placeholder="0"
        onChange={(event) => onChange(Number(event.target.value.replace(/[^\d.]/g, "")) || 0)}
      />
    );
  }
  if (column.type === "link") {
    return (
      <span className="sheet-link">
        <input className="sheet-input" value={value} placeholder="Paste a link" onChange={(event) => onChange(event.target.value)} />
        {/^https?:\/\//.test(value) ? <a href={value} target="_blank" rel="noreferrer" title={shortLink(value)}>↗</a> : null}
      </span>
    );
  }
  return <input className="sheet-input" value={value} onChange={(event) => onChange(event.target.value)} />;
}

export default function PaymentSheetPage() {
  const ledger = useLedger();
  const sheet = usePaymentSheet();
  const [activeId, setActiveId] = useState("");
  const [q, setQ] = useState("");
  const [picFilter, setPicFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [pasting, setPasting] = useState(false);
  const [pasteText, setPasteText] = useState("");
  const [notice, setNotice] = useState("");

  const campaigns = ledger.listCampaigns();
  const records = ledger.listRecords();

  useEffect(() => {
    if (ledger.ready && sheet.ready) sheet.ensureCampaignTabs(campaigns, records);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ledger.ready, sheet.ready, campaigns.length]);

  const tab = sheet.tabs.find((item) => item.id === activeId) || sheet.tabs[0];
  const rows = tab ? sheet.rowsFor(tab.id) : [];
  const query = q.trim().toLowerCase();
  const shown = rows
    .filter((row) => !picFilter || row.pic === picFilter)
    .filter((row) => !statusFilter || row.status === statusFilter)
    .filter((row) => !query || `${row.fullName} ${row.username} ${row.accountName} ${row.reference}`.toLowerCase().includes(query));

  const unpaid = rows.filter((row) => row.status !== "Paid");
  const paid = rows.filter((row) => row.status === "Paid");
  const sum = (list) => list.reduce((total, row) => total + (Number(row.amount) || 0), 0);
  const campaignRecords = tab?.campaignId ? records.filter((record) => record.campaignId === tab.campaignId && record.onTracker) : [];
  const postedKols = campaignRecords.filter((record) => record.stage === "Posted").length;
  const missingKols = campaignRecords.filter((record) => !rows.some((row) => row.recordId === record.id));

  function choose(id) {
    setActiveId(id);
    setPasting(false);
    setNotice("");
  }

  function addTab() {
    const name = window.prompt("Name the new tab, like “BM SHP - NOV Data Push”.");
    if (!name?.trim()) return;
    choose(sheet.addTab(name.trim()));
  }

  function renameTab() {
    const name = window.prompt("Rename this tab.", tab.name);
    if (name?.trim()) sheet.renameTab(tab.id, name.trim());
  }

  function deleteTab() {
    if (!window.confirm(`Delete the “${tab.name}” tab and its ${rows.length} rows? This can’t be undone.`)) return;
    sheet.removeTab(tab.id);
    setActiveId("");
    setNotice(`${tab.name} deleted.`);
  }

  function addRow() {
    sheet.addRows(tab.id, [blankRow({ pic: picFilter })]);
  }

  function pullFromTracker() {
    sheet.addRows(tab.id, missingKols.map(rowFromRecord));
    setNotice(`${missingKols.length} confirmed KOL${missingKols.length === 1 ? "" : "s"} added from the tracker.`);
  }

  function importPaste() {
    const added = rowsFromPaste(pasteText);
    if (!added.length) {
      setNotice("Nothing to add. Copy the rows in Lark (PIC through MOA) and paste them here.");
      return;
    }
    const ok = sheet.addRows(tab.id, added);
    setPasting(false);
    setPasteText("");
    setNotice(ok ? `${added.length} row${added.length === 1 ? "" : "s"} added.` : "The browser is out of room, so the rows were not saved.");
  }

  function deleteRow(row) {
    if (!window.confirm(`Delete the row for ${row.fullName || "this KOL"}?`)) return;
    sheet.removeRow(tab.id, row.id);
  }

  function exportCsv() {
    const header = sheetColumns.map((column) => column.label);
    const lines = rows.map((row) => sheetColumns.map((column) => row[column.key]));
    const csv = [header, ...lines].map((line) => line.map((cell) => `"${String(cell ?? "").replaceAll('"', '""')}"`).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `${tab.name.replace(/[^\w -]+/g, "").trim() || "payments"}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <Workspace active="/payments/sheet">
      <header className="page-head">
        <p className="eyebrow">Finance · <Link className="text-link" href="/payments">Payments overview</Link></p>
        <h1>Payment Request - KOLs</h1>
        <p className="lede">One tab per campaign. Confirmed KOLs come in from the tracker, and every cell can be edited. Saved in this browser.</p>
      </header>

      <div className="sheet-tabs" role="tablist">
        {sheet.tabs.map((item) => (
          <button key={item.id} type="button" role="tab" aria-selected={item.id === tab?.id} className={item.id === tab?.id ? "active" : undefined} onClick={() => choose(item.id)}>
            {item.name}
          </button>
        ))}
        <button type="button" className="sheet-tab-add" onClick={addTab} aria-label="Add a tab">＋</button>
      </div>

      {!tab ? <p className="empty">{sheet.ready ? "No tabs yet. Use ＋ to add one." : "Loading…"}</p> : (
        <>
          <div className="sheet-totals">
            <div><span>Total Pending</span><b>{formatPeso(sum(unpaid))}</b><small>{unpaid.length} KOL{unpaid.length === 1 ? "" : "s"}</small></div>
            <div><span>Total Paid</span><b>{formatPeso(sum(paid))}</b><small>{paid.length} KOL{paid.length === 1 ? "" : "s"}</small></div>
            <div className="urgent"><span>Urgent</span><b>{rows.filter((row) => row.status === "Urgent").length}</b><small>need paying first</small></div>
            <div><span>Count</span><b>{rows.length}</b><small>rows on this tab</small></div>
            <div><span>Total KOLs (confirmed &amp; posted)</span><b>{tab.campaignId ? `${campaignRecords.length} · ${postedKols}` : "—"}</b><small>{tab.campaignId ? "confirmed · posted, from the tracker" : "not linked to a campaign"}</small></div>
          </div>

          <div className="filters sheet-tools">
            <label>Search<input value={q} placeholder="Name, username, reference" onChange={(event) => setQ(event.target.value)} /></label>
            <label>
              PIC
              <select value={picFilter} onChange={(event) => setPicFilter(event.target.value)}>
                <option value="">Everyone</option>
                {pics.map((name) => <option key={name}>{name}</option>)}
              </select>
            </label>
            <label>
              Status
              <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
                <option value="">Any status</option>
                {paymentStatuses.map((item) => <option key={item}>{item}</option>)}
              </select>
            </label>
          </div>
          <div className="button-row sheet-actions">
              <button className="apply" type="button" onClick={addRow}>Add row</button>
              <button className="ghost" type="button" onClick={() => setPasting(!pasting)}>{pasting ? "Close paste" : "Paste from Lark"}</button>
              {tab.campaignId && missingKols.length ? (
                <button className="ghost" type="button" onClick={pullFromTracker}>Pull {missingKols.length} from tracker</button>
              ) : null}
              <button className="ghost" type="button" onClick={exportCsv}>Export CSV</button>
              <button className="ghost" type="button" onClick={renameTab}>Rename tab</button>
              <button className="ghost talent-delete" type="button" onClick={deleteTab}>Delete tab</button>
          </div>

          {pasting ? (
            <section className="panel sheet-paste">
              <p className="meta">In Lark, select the rows from <b>PIC</b> to <b>MOA</b>, copy (Ctrl+C), and paste here (Ctrl+V). Add an amount column after MOA if you have one.</p>
              <textarea value={pasteText} rows={6} placeholder="Nisha	Ken Eiron Mateo	Eironmateoo	09772567848	Susailene Mateo	Paid	9/27/2026	10/2/2026 …" onChange={(event) => setPasteText(event.target.value)} />
              <div className="button-row" style={{ justifyContent: "flex-start" }}>
                <button className="apply" type="button" onClick={importPaste}>Add {rowsFromPaste(pasteText).length || ""} rows</button>
              </div>
            </section>
          ) : null}

          {notice ? <p className="notice">{notice}</p> : null}

          <div className="sheet-scroll">
            <table className="sheet-grid">
              <thead>
                <tr>
                  <th className="sheet-index">#</th>
                  {sheetColumns.map((column) => (
                    <th key={column.key} className={column.tone === "name" ? "tone-name" : undefined} style={{ minWidth: column.width }}>{column.label}</th>
                  ))}
                  <th aria-label="Row actions"></th>
                </tr>
              </thead>
              <tbody>
                {shown.map((row, index) => (
                  <tr key={row.id} className={row.status === "Urgent" ? "urgent" : undefined}>
                    <td className="sheet-index">{index + 1}</td>
                    {sheetColumns.map((column) => (
                      <td key={column.key}>
                        <Cell column={column} row={row} onChange={(value) => sheet.updateCell(tab.id, row.id, column.key, value)} />
                      </td>
                    ))}
                    <td>
                      <button className="sheet-row-delete" type="button" onClick={() => deleteRow(row)} aria-label={`Delete row for ${row.fullName || "KOL"}`}>✕</button>
                    </td>
                  </tr>
                ))}
                {shown.length === 0 ? (
                  <tr><td className="sheet-index"></td><td colSpan={sheetColumns.length + 1} className="sheet-empty">{rows.length ? "No rows match the filters." : "No rows yet. Add a row, paste from Lark, or pull KOLs from the tracker."}</td></tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </>
      )}
    </Workspace>
  );
}
