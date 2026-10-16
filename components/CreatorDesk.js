"use client";

import { useState } from "react";
import Link from "next/link";
import { Workspace } from "./Workspace";
import { Avatar } from "./Avatar";
import { useRole } from "./RoleProvider";
import { useLedger } from "../lib/useLedger";
import { categoryOptions } from "../lib/model";
import { canSeeRecord } from "../lib/roles";
import { formatDate, formatFollowers, formatNumber, formatRate } from "../lib/format";

function tone(status) {
  if (status === "Posted" || status === "Paid" || status === "Approved for posting") return "ready";
  if (status === "Dropped" || status === "Rejected" || status === "On hold" || status === "Escalate") return "hold";
  if (status.includes("Awaiting") || status.includes("review") || status === "Under revision" || status === "Follow up") return "review";
  return "";
}

export function CreatorDesk({ id }) {
  const { role, creatorId, specialist } = useRole();
  const { getRecord, patchRecord, saveDeliverableViews, addNote, setCategories, markPaid, clearAccountHold, markPosted } = useLedger();
  const record = getRecord(id);
  const operations = role === "admin" || role === "specialists";
  const finance = role === "admin" || role === "finance";
  const [notice, setNotice] = useState("");

  if (!record || !canSeeRecord(role, record, { creatorId, specialist })) {
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

  const showMoney = role !== "brands";
  const checks = [
    [record.onTracker, "On the tracker"],
    [record.stage === "Posted", "Post is live"],
    [record.rate > 0, "Rate is set"],
    [record.invoice === "Yes", "Service invoice on file"],
    [!record.accountHold, "Payment account clear"],
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

  function saveRate(event) {
    event.preventDefault();
    const rate = Math.round(Number(new FormData(event.currentTarget).get("rate")));
    if (!Number.isInteger(rate) || rate < 0) {
      setNotice("Check the rate, then save again.");
      return;
    }
    patchRecord(record.id, { rate });
    setNotice(rate === 0 ? "Rate cleared. The row stays in negotiating." : "Rate saved in this browser.");
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
        <p className="eyebrow">{record.program}</p>
        <div className="title-row">
          <Avatar name={record.creator.name} size="lg" />
          <h1>{record.creator.name}</h1>
          <span className={`status ${tone(record.status)}`}>{record.status}</span>
        </div>
        <p className="lede">@{record.creator.handle} · {record.tier} · {formatFollowers(record.creator.followers)} TikTok followers · {record.categoryLabel}</p>
      </header>
      {notice ? <p className="notice">{notice}</p> : null}
      <section className="fact-grid" aria-label="Nomination">
        <div className="fact"><span>PIC</span><b>{record.owner}</b></div>
        <div className="fact"><span>Platforms</span><b>{record.platforms}</b></div>
        <div className="fact"><span>Post due</span><b>{formatDate(record.postDue)}</b></div>
        <div className="fact"><span>{record.onTracker ? "Action" : "Gate"}</span><b>{record.onTracker ? record.action || record.stage : record.status}</b></div>
      </section>
      <div className="split">
        <section className="panel">
          <h2>Three gates</h2>
          <p className="meta">The client sheet receives this row only when all three read confirmed or approved. A dropped row stays here.</p>
          <div className="doc">
            <div><b>Creator</b><div className="handle">KOL confirmation</div></div>
            <div className="button-row">
              <span className="pill">{record.kolConfirmation}</span>
              {operations ? ["Confirmed", "Pitching", "Dropped"].filter((value) => value !== record.kolConfirmation).slice(0, 2).map((value) => (
                <button key={value} className="ghost" type="button" onClick={() => { patchRecord(record.id, { kolConfirmation: value }); setNotice("Confirmation updated in this browser."); }}>{value}</button>
              )) : null}
            </div>
          </div>
          <div className="doc">
            <div><b>KYNX</b><div className="handle">Admin approval. Pending rows stay off the client sheet.</div></div>
            <div className="button-row">
              <span className="pill">{record.kynxApproval}</span>
              {role === "admin" && record.kynxApproval !== "Approved" ? <button className="save" type="button" onClick={() => { patchRecord(record.id, { kynxApproval: "Approved" }); setNotice("KYNX approved this nomination in this browser."); }}>Approve</button> : null}
              {role === "admin" && record.kynxApproval !== "Rejected" && record.kynxApproval !== "Dropped" ? <button className="ghost" type="button" onClick={() => { patchRecord(record.id, { kynxApproval: "Rejected" }); setNotice("KYNX rejected this nomination in this browser."); }}>Reject</button> : null}
            </div>
          </div>
          <div className="doc">
            <div><b>Brand</b><div className="handle">Pulled back from the client sheet.</div></div>
            <div className="button-row">
              <span className="pill">{record.brandApproval || "Not sent"}</span>
              {(role === "brands" || role === "admin") && record.brandApproval !== "Approved" && record.kolConfirmation === "Confirmed" ? (
                <button className="save" type="button" onClick={() => { patchRecord(record.id, { brandApproval: "Approved" }); setNotice("Brand approved this nomination in this browser."); }}>Approve</button>
              ) : null}
            </div>
          </div>
        </section>
        <section className="panel">
          <h2>Draft and post</h2>
          <p className="meta">{record.onTracker ? `${record.stage}${record.late != null ? ` · ${record.late} days late · ${record.risk} risk` : ""}` : "Stage starts after the three gates."}</p>
          <div className="doc">
            <div><b>Draft</b><div className="handle">{record.draftStatus || "No draft yet"}</div></div>
            <div className="button-row">
              {operations && record.onTracker && record.draftStatus !== "For review" && record.stage !== "Posted" ? (
                <button className="ghost" type="button" onClick={() => { patchRecord(record.id, { draftStatus: "For review" }); setNotice("Draft sent for review in this browser."); }}>Send draft</button>
              ) : null}
              {(role === "brands" || role === "admin") && record.draftStatus === "For review" ? (
                <>
                  <button className="ghost" type="button" onClick={() => { patchRecord(record.id, { draftStatus: "For revision" }); setNotice("Revision requested in this browser."); }}>Request revision</button>
                  <button className="save" type="button" onClick={() => { patchRecord(record.id, { draftStatus: "Approved" }); setNotice("Draft approved for posting in this browser."); }}>Approve draft</button>
                </>
              ) : null}
              {operations && record.onTracker && (record.stage === "Approved for posting" || record.draftStatus === "Approved" || record.draftStatus === "Approved after revision") && record.stage !== "Posted" ? (
                <button className="apply" type="button" onClick={() => { markPosted(record.id); setNotice("Marked posted in this browser."); }}>Mark posted</button>
              ) : null}
            </div>
          </div>
          {showMoney ? (
            <form className="inline-form" onSubmit={saveRate}>
              <label>
                Rate
                <input name="rate" type="number" min="0" step="1" defaultValue={record.rate || ""} key={record.rate} placeholder="Need rate" />
              </label>
              {operations ? <button className="save" type="submit">Save rate</button> : null}
            </form>
          ) : <p className="meta">Rate, invoice, and MOA stay on the KYNX side of the row.</p>}
          {showMoney ? (
            <div className="doc">
              <div><b>Service invoice</b><div className="handle">{record.taxesInclusive === "Yes" ? "Inclusive of taxes" : "Taxes separate"} · MOA {record.moa.toLowerCase()}</div></div>
              <div className="button-row">
                <span className="pill">{record.invoice}</span>
                {operations ? <button className="ghost" type="button" onClick={() => { patchRecord(record.id, { invoice: record.invoice === "Yes" ? "No" : "Yes", moa: "Verified" }); setNotice("Invoice flag updated in this browser."); }}>{record.invoice === "Yes" ? "Clear invoice" : "Invoice on file"}</button> : null}
              </div>
            </div>
          ) : null}
        </section>
      </div>
      <section className="panel" style={{ marginBottom: 14 }}>
        <h2>Generated views</h2>
        <p className="meta">{record.publishedCount} of {record.deliverables.length} published · {record.campaign.name}</p>
        {record.deliverables.map((item, index) => (
          <div className="deliverable" key={item.id}>
            <div>
              <b>{String(index + 1).padStart(2, "0")} · {item.title}</b>
              <div className="handle">{item.postedAt ? `Posted ${formatDate(item.postedAt)} · ID ${item.videoId}` : item.state}</div>
            </div>
            {item.state === "Published" && operations ? (
              <form className="inline-form" onSubmit={(event) => saveViews(event, item.id)}>
                <input aria-label={`Generated views for ${item.title}`} name="views" type="number" min="0" step="1" defaultValue={item.views} key={`${item.id}-${item.views}`} />
                <button className="save" type="submit">Save</button>
              </form>
            ) : item.state === "Published" ? <b>{formatNumber(item.views)}</b> : <span className="pill">{item.state}</span>}
          </div>
        ))}
      </section>
      {operations ? <div className="split">
        <section className="panel">
          <h2>Internal notes</h2>
          <p className="meta">These notes stay inside KYNX. They are not part of the client nomination.</p>
          {record.notes.length === 0 ? <p className="empty">No internal notes yet.</p> : record.notes.map((note) => (
            <div className="note" key={note.id}><span>{note.text}</span></div>
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
          <p className="meta">Used when a new program needs a niche. One PIC still owns the row.</p>
          <div className="categories">
            {categoryOptions.map((name) => (
              <label key={name}>
                <input type="checkbox" checked={record.categories.includes(name)} onChange={(event) => toggleCategory(name, event.target.checked)} />
                {name}
              </label>
            ))}
          </div>
        </section>
      </div> : null}
      {showMoney ? (
        <section className="panel">
          <p className="pay-amount">{formatRate(record.rate)}</p>
          <span className={`status ${tone(record.payStatus)}`}>{record.payStatus}</span>
          <ul className="checks">
            {checks.map(([done, label]) => <li key={label} className={done ? "done" : undefined}>{done ? "✓" : "○"} {label}</li>)}
          </ul>
          {finance ? <div className="button-row" style={{ justifyContent: "flex-start", marginTop: 12 }}>
            {record.payStatus === "Ready to pay" ? <button className="apply" type="button" onClick={() => { markPaid(record.id); setNotice("Marked paid in this browser."); }}>Mark paid</button> : null}
            {record.accountHold ? <button className="ghost" type="button" onClick={() => { clearAccountHold(record.id); setNotice("Payment hold cleared in this browser."); }}>Clear account hold</button> : null}
          </div> : null}
        </section>
      ) : null}
      {record.others.length > 0 ? (
        <section className="panel" style={{ marginTop: 14 }}>
          <h2>Also on a program</h2>
          {record.others.map((other) => (
            <div className="doc" key={other.id}>
              <Link href={`/creators/${other.id}`}>{other.program}</Link>
              <span className="pill">{other.status}</span>
            </div>
          ))}
        </section>
      ) : null}
    </Workspace>
  );
}
