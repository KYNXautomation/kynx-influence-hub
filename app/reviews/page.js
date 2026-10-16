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
  const { listReviews, listRecords, patchRecord } = useLedger();
  const [notice, setNotice] = useState("");
  const visible = new Set(listRecords().filter((record) => canSeeRecord(role, record, { creatorId, specialist })).map((record) => record.id));
  const kinds = role === "brands" ? ["brand", "draft"] : role === "specialists" ? ["revision", "draft"] : ["kynx", "brand", "draft", "revision"];
  const items = listReviews().filter((item) => visible.has(item.recordId) && kinds.includes(item.kind));

  function act(item, fields, message) {
    patchRecord(item.recordId, fields);
    setNotice(message);
  }

  return (
    <Workspace>
      <header className="page-head">
        <p className="eyebrow">{role === "brands" ? "Brand" : role === "admin" ? "Admin" : "Specialist"}</p>
        <h1>{role === "brands" ? "Nominations and drafts" : role === "admin" ? "Approvals waiting on KYNX" : "Drafts on your creators"}</h1>
        <p className="lede">
          {role === "brands"
            ? "Approve the person first. Approve the draft second. Both stay in this browser."
            : "KYNX approval is the admin gate. Draft review follows once the row is on the tracker."}
        </p>
      </header>
      {notice ? <p className="notice">{notice}</p> : null}
      {items.length === 0 ? <p className="empty">Nothing is waiting.</p> : (
        <div className="stack">
          {items.map((item) => (
            <article key={item.key} className="panel">
              <div className="doc">
                <div className="who">
                  <Avatar name={item.detail} />
                  <span>
                    <h3>{item.label}</h3>
                    <p className="meta">{item.detail} · {item.campaign} · {item.owner}</p>
                  </span>
                </div>
                <div className="button-row">
                  <Link className="text-link" href={`/creators/${item.recordId}`}>Open record</Link>
                  {item.kind === "kynx" && role === "admin" ? (
                    <button className="apply" type="button" onClick={() => act(item, { kynxApproval: "Approved" }, "KYNX approved this nomination in this browser.")}>Approve for KYNX</button>
                  ) : null}
                  {item.kind === "brand" && (role === "brands" || role === "admin") ? (
                    <button className="apply" type="button" onClick={() => act(item, { brandApproval: "Approved" }, "Brand approved this nomination in this browser.")}>Approve nomination</button>
                  ) : null}
                  {item.kind === "draft" && (role === "brands" || role === "admin") ? (
                    <>
                      <button className="ghost" type="button" onClick={() => act(item, { draftStatus: "For revision" }, "Revision requested in this browser.")}>Request revision</button>
                      <button className="apply" type="button" onClick={() => act(item, { draftStatus: "Approved" }, "Draft approved for posting in this browser.")}>Approve draft</button>
                    </>
                  ) : null}
                  {item.kind === "revision" && (role === "specialists" || role === "admin") ? (
                    <button className="apply" type="button" onClick={() => act(item, { draftStatus: "For review" }, "Revision sent back for review in this browser.")}>Send revision</button>
                  ) : null}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </Workspace>
  );
}
