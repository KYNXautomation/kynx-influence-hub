"use client";

import { useState } from "react";
import Link from "next/link";
import { Workspace } from "../../components/Workspace";
import { Avatar } from "../../components/Avatar";
import { useRole } from "../../components/RoleProvider";
import { useLedger } from "../../lib/useLedger";
import { canSeeRecord } from "../../lib/roles";

export default function ReviewsPage() {
  const { role, creatorId, specialist } = useRole();
  const { listReviews, listRecords, verifyDocument, setDeliverableState } = useLedger();
  const [notice, setNotice] = useState("");
  const visible = new Set(listRecords().filter((record) => canSeeRecord(role, record, { creatorId, specialist })).map((record) => record.id));
  const staffItems = listReviews().filter((item) => visible.has(item.recordId));
  const brandItems = listRecords()
    .filter((record) => canSeeRecord(role, record, { creatorId, specialist }))
    .flatMap((record) => record.deliverables.filter((item) => item.state === "Approved").map((item) => ({
      key: item.id,
      recordId: record.id,
      deliverableId: item.id,
      label: item.title,
      detail: record.creator.name,
      campaign: record.campaign.name,
    })));
  const items = role === "brands" ? brandItems : staffItems;

  function act(item, next) {
    if (item.kind === "deliverable" || item.deliverableId) {
      setDeliverableState(item.recordId, item.deliverableId, next);
      setNotice(next === "Published" ? "Approved for posting in this browser." : next === "Changes requested" ? "Changes requested in this browser." : "Sample draft approved in this browser.");
      return;
    }
    verifyDocument(item.recordId, item.kind);
    setNotice("Sample document verified in this browser.");
  }

  return (
    <Workspace>
      <header className="page-head">
        <p className="eyebrow">{role === "brands" ? "Brand review" : "Review"}</p>
        <h1>{role === "brands" ? "Drafts ready for the brand" : "Documents and drafts"}</h1>
        <p className="lede">
          {role === "brands"
            ? "These drafts already passed agency review. Approving one marks it ready to post. Actions stay in this browser."
            : "MOA, billing statements, and deliverables waiting on a sample review. Actions stay in this browser."}
        </p>
      </header>
      {notice ? <p className="notice">{notice}</p> : null}
      {items.length === 0 ? <p className="empty">Nothing is waiting for review.</p> : (
        <div className="stack">
          {items.map((item) => (
            <article key={item.key} className="panel">
              <div className="doc">
                <div className="who">
                  <Avatar name={item.detail} />
                  <span>
                    <h3>{item.label}</h3>
                    <p className="meta">{item.detail} · {item.campaign}</p>
                  </span>
                </div>
                <div className="button-row">
                  <Link className="text-link" href={`/creators/${item.recordId}`}>Open record</Link>
                  {role === "brands" ? (
                    <>
                      <button className="ghost" type="button" onClick={() => act(item, "Changes requested")}>Request changes</button>
                      <button className="apply" type="button" onClick={() => act(item, "Published")}>Approve for posting</button>
                    </>
                  ) : (
                    <button className="apply" type="button" onClick={() => act(item, "Approved")}>
                      {item.kind === "deliverable" ? "Approve draft" : "Verify"}
                    </button>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </Workspace>
  );
}
