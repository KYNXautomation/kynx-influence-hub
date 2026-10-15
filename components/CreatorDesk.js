"use client";

import { useState } from "react";
import Link from "next/link";
import { Workspace } from "./Workspace";
import { useLedger } from "../lib/useLedger";
import { categoryOptions } from "../lib/model";
import { formatDate, formatFollowers, formatNumber, formatPeso } from "../lib/format";

function tone(status) {
  if (status === "Ready to pay" || status === "Paid") return "ready";
  if (status === "Payment on hold" || status.includes("review") || status === "Revisions needed") return status === "Payment on hold" ? "hold" : "review";
  return "";
}

export function CreatorDesk({ id }) {
  const { getRecord, verifyDocument, saveDeliverableViews, addNote, setCategories, markPaid, clearAccountHold } = useLedger();
  const record = getRecord(id);
  const [notice, setNotice] = useState("");
  const [sampleDoc, setSampleDoc] = useState("");

  if (!record) {
    return (
      <Workspace active="/creators">
        <header className="page-head">
          <p className="eyebrow">Missing</p>
          <h1>That record is not on the desk.</h1>
          <p className="lede"><Link className="text-link" href="/creators">Back to creators</Link></p>
        </header>
      </Workspace>
    );
  }

  const published = record.deliverables.filter((item) => item.state === "Published").length;
  const checks = [
    [record.moa === "Verified", "MOA verified"],
    [record.deliverables.length > 0 && published === record.deliverables.length, "All deliverables published"],
    [record.billing === "Verified", "Billing statement verified"],
    [!record.accountHold, "Payment details cleared"],
  ];

  function saveViews(event, deliverableId) {
    event.preventDefault();
    const views = Math.round(Number(new FormData(event.currentTarget).get("views")));
    if (!Number.isInteger(views) || views < 0) {
      setNotice("Check the view count, then save again.");
      return;
    }
    saveDeliverableViews(record.id, deliverableId, views);
    setNotice("Views saved in this browser.");
  }

  function saveNote(event) {
    event.preventDefault();
    const text = String(new FormData(event.currentTarget).get("note") || "").trim();
    if (!text) return;
    addNote(record.id, text);
    event.currentTarget.reset();
    setNotice("Note saved in this browser.");
  }

  function toggleCategory(name, checked) {
    const next = checked ? [...record.categories, name] : record.categories.filter((item) => item !== name);
    if (next.length === 0) {
      setNotice("Keep at least one category.");
      return;
    }
    setCategories(record.creator.id, next);
  }

  return (
    <Workspace active="/creators">
      <header className="page-head">
        <p className="eyebrow">{record.campaign.name}</p>
        <div className="title-row">
          <h1>{record.creator.name}</h1>
          <span className={`status ${tone(record.status)}`}>{record.status}</span>
        </div>
        <p className="lede">@{record.creator.handle} · {record.categoryLabel} · {formatFollowers(record.creator.followers)} followers</p>
      </header>
      {notice ? <p className="notice">{notice}</p> : null}
      <section className="fact-grid" aria-label="Campaign record">
        <div className="fact"><span>Campaign</span><b>{record.campaign.short || record.campaign.name}</b></div>
        <div className="fact"><span>Agreed rate</span><b>{formatPeso(record.rate)} gross</b></div>
        <div className="fact"><span>Specialist</span><b>{record.owner}</b></div>
        <div className="fact"><span>Post due</span><b>{formatDate(record.campaign.deadline)}</b></div>
      </section>
      <div className="split">
        <section className="panel">
          <h2>Agreement & billing</h2>
          <p className="meta">Receipt and verification are tracked separately. Documents here are illustrative samples.</p>
          {[["moa", "Memorandum of agreement", `MOA_${record.creator.handle}_sample.pdf`], ["billing", "Billing statement", `Billing_${record.creator.handle}_sample.pdf`]].map(([field, label, file]) => (
            <div className="doc" key={field}>
              <div>
                <b>{label}</b>
                <div className="handle">{file}</div>
              </div>
              <div className="button-row">
                <span className="pill">{record[field]}</span>
                <button className="ghost" type="button" onClick={() => setSampleDoc(label)}>View</button>
                {record[field] !== "Verified" ? (
                  <button className="save" type="button" onClick={() => { verifyDocument(record.id, field); setNotice(`${label} verified in this browser.`); }}>Verify</button>
                ) : null}
              </div>
            </div>
          ))}
          {sampleDoc ? <p className="meta">{sampleDoc} is a sample label. This desk does not open a real file.</p> : null}
        </section>
        <section className="panel">
          <h2>Content deliverables</h2>
          <p className="meta">{published} of {record.deliverables.length} published · {record.campaign.name}</p>
          {record.deliverables.map((item, index) => (
            <div className="deliverable" key={item.id}>
              <div>
                <b>{String(index + 1).padStart(2, "0")} · {item.title}</b>
                <div className="handle">
                  {item.postedAt ? `Posted ${formatDate(item.postedAt)} · ID ${item.videoId}` : item.state}
                </div>
              </div>
              {item.state === "Published" ? (
                <form className="inline-form" onSubmit={(event) => saveViews(event, item.id)}>
                  <input aria-label={`Views for ${item.title}`} name="views" type="number" min="0" step="1" defaultValue={item.views} key={`${item.id}-${item.views}`} />
                  <button className="save" type="submit">Save</button>
                </form>
              ) : <span className="pill">{item.state}</span>}
            </div>
          ))}
        </section>
      </div>
      <div className="split">
        <section className="panel">
          <h2>Team notes</h2>
          <p className="meta">Context for this creator, in this campaign.</p>
          {record.notes.length === 0 ? <p className="empty">No team notes yet.</p> : record.notes.map((note) => (
            <div className="note" key={note.id}>
              <span>{note.text}</span>
            </div>
          ))}
          <form className="note-form" onSubmit={saveNote}>
            <label>
              Add a note
              <textarea name="note" maxLength={280} placeholder="Sample note for this browser" />
            </label>
            <div className="button-row"><button className="apply" type="submit">Save note</button></div>
          </form>
        </section>
        <section className="panel">
          <h2>Creator categories</h2>
          <p className="meta">Shared across this creator’s campaign records. Choose one or more content categories for future shortlists.</p>
          <div className="categories">
            {categoryOptions.map((name) => (
              <label key={name}>
                <input
                  type="checkbox"
                  checked={record.categories.includes(name)}
                  onChange={(event) => toggleCategory(name, event.target.checked)}
                />
                {name}
              </label>
            ))}
          </div>
          <h3 style={{ marginTop: 18 }}>Brand experience</h3>
          <p>{record.brands.join(" · ") || "No recorded collaborations yet."}</p>
          <p className="meta">Based on campaign history, including ongoing work. This is not a brand endorsement.</p>
        </section>
      </div>
      <section className="panel">
        <p className="pay-amount">{formatPeso(record.rate)}</p>
        <span className={`status ${tone(record.status)}`}>{record.status}</span>
        <ul className="checks">
          {checks.map(([done, label]) => <li key={label} className={done ? "done" : undefined}>{done ? "✓" : "○"} {label}</li>)}
        </ul>
        <p className="meta">One creator, one campaign record. Documented views on published posts: {formatNumber(record.views)}.</p>
        <div className="button-row" style={{ justifyContent: "flex-start", marginTop: 12 }}>
          {record.status === "Ready to pay" ? <button className="apply" type="button" onClick={() => { markPaid(record.id); setNotice("Marked paid in this browser."); }}>Mark paid</button> : null}
          {record.accountHold ? <button className="ghost" type="button" onClick={() => { clearAccountHold(record.id); setNotice("Payment hold cleared in this browser."); }}>Clear account hold</button> : null}
        </div>
      </section>
      {record.others.length > 0 ? (
        <section className="panel" style={{ marginTop: 14 }}>
          <h2>Also working on</h2>
          {record.others.map((other) => (
            <div className="doc" key={other.id}>
              <Link href={`/creators/${other.id}`}>{other.campaign.name}</Link>
              <span className="pill">{other.status}</span>
            </div>
          ))}
        </section>
      ) : null}
    </Workspace>
  );
}
