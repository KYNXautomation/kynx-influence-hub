"use client";

import { useState } from "react";
import Link from "next/link";
import { Workspace } from "../../components/Workspace";
import { useLedger } from "../../lib/useLedger";

export default function ReviewsPage() {
  const { listReviews, verifyDocument, setDeliverableState } = useLedger();
  const items = listReviews();
  const [notice, setNotice] = useState("");

  function verify(item) {
    if (item.kind === "deliverable") {
      setDeliverableState(item.recordId, item.deliverableId, "Approved");
      setNotice("Sample draft approved in this browser.");
      return;
    }
    verifyDocument(item.recordId, item.kind);
    setNotice("Sample document verified in this browser.");
  }

  return (
    <Workspace active="/reviews">
      <header className="page-head">
        <p className="eyebrow">Review</p>
        <h1>Documents and drafts</h1>
        <p className="lede">MOA, billing statements, and deliverables waiting on a sample review. Actions stay in this browser.</p>
      </header>
      {notice ? <p className="notice">{notice}</p> : null}
      {items.length === 0 ? <p className="empty">Nothing is waiting for review.</p> : (
        <div className="stack">
          {items.map((item) => (
            <article key={item.key} className="panel">
              <div className="doc">
                <div>
                  <h3>{item.label}</h3>
                  <p className="meta">{item.detail} · {item.campaign}</p>
                </div>
                <div className="button-row">
                  <Link className="text-link" href={`/creators/${item.recordId}`}>Open record</Link>
                  <button className="apply" type="button" onClick={() => verify(item)}>
                    {item.kind === "deliverable" ? "Approve draft" : "Verify"}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </Workspace>
  );
}
