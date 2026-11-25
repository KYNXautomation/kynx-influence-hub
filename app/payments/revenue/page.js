"use client";

import { useState } from "react";
import Link from "next/link";
import { Workspace } from "../../../components/Workspace";
import { creators } from "../../../lib/model";
import { talentManagers } from "../../../lib/talents";
import { formatPeso } from "../../../lib/format";
import { blankRow, computeRow, rowsFromPaste, sumColumn, trackers, useRevenueTracker } from "../../../lib/revenueTracker";

const exclusives = creators.filter((creator) => creator.manager).map((creator) => creator.name);
const dashboard = "dashboard";

function Cell({ column, value, computed, onChange }) {
  if (column.calc) return <span className="sheet-calc">{formatPeso(computed)}</span>;
  if (column.type === "select" || column.type === "manager") {
    const options = column.type === "manager" ? talentManagers : column.options;
    return (
      <select className="sheet-input" value={value || ""} onChange={(event) => onChange(event.target.value)}>
        <option value="">—</option>
        {[...new Set([...options, value].filter(Boolean))].map((item) => <option key={item}>{item}</option>)}
      </select>
    );
  }
  if (column.type === "date") return <input className="sheet-input" type="date" value={value || ""} onChange={(event) => onChange(event.target.value)} />;
  if (column.type === "money") {
    return <input className="sheet-input num" inputMode="decimal" value={value || ""} placeholder="0" onChange={(event) => onChange(Number(event.target.value.replace(/[^\d.-]/g, "")) || 0)} />;
  }
  if (column.type === "link") {
    const first = String(value || "").split(/\s+/)[0];
    return (
      <span className="sheet-link">
        <input className="sheet-input" value={value || ""} placeholder="Paste a link" onChange={(event) => onChange(event.target.value)} />
        {/^https?:\/\//.test(first) ? <a href={first} target="_blank" rel="noreferrer">↗</a> : null}
      </span>
    );
  }
  return <input className="sheet-input" list={column.type === "creator" ? "exclusive-creators" : undefined} value={value || ""} onChange={(event) => onChange(event.target.value)} />;
}

function Dashboard({ rowsFor }) {
  const money = trackers.filter((tracker) => tracker.id !== "si");
  const line = (key) => money.map((tracker) => [tracker, sumColumn(tracker, rowsFor(tracker.id), key)]);
  const blocks = [
    ["KYNX Net Revenue", line("kynxNet")],
    ["KYNX Revenue", line("kynxRevenue")],
    ["Talent Manager Commission (15%)", line("tmCommission")],
  ];
  return (
    <div className="revenue-dashboard">
      {blocks.map(([title, items]) => (
        <section key={title} className="panel">
          <h3>{title}</h3>
          <table>
            <tbody>
              {items.map(([tracker, amount]) => (
                <tr key={tracker.id}><td>{tracker.name}</td><td className="num">{formatPeso(amount)}</td></tr>
              ))}
              <tr className="total"><td>Total</td><td className="num">{formatPeso(items.reduce((sum, [, amount]) => sum + amount, 0))}</td></tr>
            </tbody>
          </table>
        </section>
      ))}
    </div>
  );
}

export default function RevenuePage() {
  const store = useRevenueTracker();
  const [tabId, setTabId] = useState(dashboard);
  const [q, setQ] = useState("");
  const [pasting, setPasting] = useState(false);
  const [pasteText, setPasteText] = useState("");
  const [notice, setNotice] = useState("");

  const tracker = trackers.find((item) => item.id === tabId);
  const rows = tracker ? store.rowsFor(tracker.id) : [];
  const query = q.trim().toLowerCase();
  const shown = rows.filter((row) => !query || `${row.creator} ${row.brand} ${row.campaign} ${row.company}`.toLowerCase().includes(query));
  const pastePreview = tracker && pasteText ? rowsFromPaste(tracker, pasteText).length : 0;

  function choose(id) {
    setTabId(id);
    setPasting(false);
    setNotice("");
  }

  function saved(ok, message) {
    setNotice(ok ? message : "The browser is out of room, so this was not saved.");
  }

  function importPaste() {
    const added = rowsFromPaste(tracker, pasteText);
    if (!added.length) {
      setNotice(`Nothing to add. Copy rows from the “${tracker.name}” tab, starting at the ${tracker.columns[0].label} column.`);
      return;
    }
    saved(store.addRows(tracker.id, added), `${added.length} row${added.length === 1 ? "" : "s"} added.`);
    setPasting(false);
    setPasteText("");
  }

  function deleteRow(row) {
    if (!window.confirm(`Delete the row for ${row.creator || "this project"}?`)) return;
    saved(store.removeRow(tracker.id, row.id), "Row deleted.");
  }

  return (
    <Workspace active="/payments/revenue">
      <header className="page-head">
        <p className="eyebrow">Finance · <Link className="text-link" href="/payments">Payments overview</Link></p>
        <h1>Creator Projects &amp; Revenue Tracker</h1>
        <p className="lede">
          Every project by KYNX creators. KYNX Revenue is 15% of the talent fee, the talent manager gets 15% of that, and the rest is KYNX Net Revenue. Saved in this browser only.
        </p>
      </header>

      <datalist id="exclusive-creators">{exclusives.map((name) => <option key={name} value={name} />)}</datalist>

      <div className="sheet-tabs" role="tablist">
        <button type="button" role="tab" aria-selected={tabId === dashboard} className={tabId === dashboard ? "active" : undefined} onClick={() => choose(dashboard)}>Dashboard</button>
        {trackers.map((item) => (
          <button key={item.id} type="button" role="tab" aria-selected={item.id === tabId} className={item.id === tabId ? "active" : undefined} onClick={() => choose(item.id)}>
            {item.name}
          </button>
        ))}
      </div>

      {!store.ready ? <p className="empty">Loading…</p> : !tracker ? <Dashboard rowsFor={store.rowsFor} /> : (
        <>
          {tracker.id !== "si" ? (
            <div className="sheet-totals">
              {[["Total Gross Sales", tracker.columns.some((c) => c.key === "netReceivable") ? "netReceivable" : "netPay"], ["Total KYNX Revenue", "kynxRevenue"], ["Talent Manager Commission", "tmCommission"], ["KYNX Net Revenue", "kynxNet"], ["Talent Pay", "talentPay"]].map(([label, key]) => (
                <div key={label}><span>{label}</span><b>{formatPeso(sumColumn(tracker, rows, key))}</b></div>
              ))}
            </div>
          ) : null}

          <div className="filters sheet-tools">
            <label>Search<input value={q} placeholder="Creator, brand, campaign" onChange={(event) => setQ(event.target.value)} /></label>
          </div>
          <div className="button-row sheet-actions">
            <button className="apply" type="button" onClick={() => saved(store.addRows(tracker.id, [blankRow()]), "Row added.")}>Add row</button>
            <button className="ghost" type="button" onClick={() => setPasting(!pasting)}>{pasting ? "Close paste" : "Paste from Excel / Lark"}</button>
          </div>

          {pasting ? (
            <section className="panel sheet-paste">
              <p className="meta">
                In the <b>{tracker.name}</b> tab, select the rows from <b>{tracker.columns[0].label}</b> across, copy (Ctrl+C), and paste here (Ctrl+V). Formula columns are worked out here, whatever was pasted in them.
              </p>
              <textarea value={pasteText} rows={6} onChange={(event) => setPasteText(event.target.value)} />
              <div className="button-row" style={{ justifyContent: "flex-start" }}>
                <button className="apply" type="button" onClick={importPaste}>Add {pastePreview || ""} rows</button>
              </div>
            </section>
          ) : null}

          {notice ? <p className="notice">{notice}</p> : null}

          <div className="sheet-scroll">
            <table className="sheet-grid">
              <thead>
                <tr>
                  <th className="sheet-index">#</th>
                  {tracker.columns.map((column) => (
                    <th key={column.key} className={column.calc ? "tone-calc" : undefined} style={{ minWidth: column.type === "link" || column.label.length > 22 ? 190 : 140 }}>{column.label}</th>
                  ))}
                  <th aria-label="Row actions"></th>
                </tr>
              </thead>
              <tbody>
                {shown.map((row, index) => {
                  const computed = computeRow(tracker, row);
                  return (
                    <tr key={row.id}>
                      <td className="sheet-index">{index + 1}</td>
                      {tracker.columns.map((column) => (
                        <td key={column.key}>
                          <Cell column={column} value={row[column.key]} computed={computed[column.key]} onChange={(value) => saved(store.updateCell(tracker.id, row.id, column.key, value), "")} />
                        </td>
                      ))}
                      <td><button className="sheet-row-delete" type="button" onClick={() => deleteRow(row)} aria-label={`Delete row for ${row.creator || "project"}`}>✕</button></td>
                    </tr>
                  );
                })}
                {shown.length === 0 ? (
                  <tr><td className="sheet-index"></td><td colSpan={tracker.columns.length + 1} className="sheet-empty">{rows.length ? "No rows match the search." : "No rows yet. Add a row, or paste rows from the Excel or Lark tab."}</td></tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </>
      )}
    </Workspace>
  );
}
