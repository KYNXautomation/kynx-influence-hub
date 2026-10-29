"use client";

import { useState } from "react";
import Link from "next/link";
import { Workspace } from "../../components/Workspace";
import { Avatar } from "../../components/Avatar";
import { useRole } from "../../components/RoleProvider";
import { useLedger } from "../../lib/useLedger";
import { canSeeRecord } from "../../lib/roles";
import { creatorPath } from "../../lib/paths";

export default function ReviewsPage() {
  const { role, creatorId, specialist } = useRole();
  const { listReviews, listRecords, listCampaigns, patchRecord } = useLedger();
  const [notice, setNotice] = useState("");
  const [brand, setBrand] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const visible = new Set(listRecords().filter((record) => canSeeRecord(role, record, { creatorId, specialist })).map((record) => record.id));
  const kinds = role === "brands" ? ["brand", "draft"] : role === "specialists" ? ["kynx", "revision", "draft"] : ["kynx", "brand", "draft", "revision"];
  const allItems = listReviews().filter((item) => visible.has(item.recordId) && kinds.includes(item.kind));
  const items = allItems.filter((item) => item.brand === brand);

  // Creators waiting on an approval, per brand. A revision is with the creator, so it does not count.
  const waiting = (name) => new Set(allItems.filter((item) => item.brand === name && item.kind !== "revision").map((item) => item.recordId)).size;
  const brandNames = [...new Set([
    ...listCampaigns().map((campaign) => campaign.brand),
    ...allItems.map((item) => item.brand),
  ])]
    .filter((name) => name && (role !== "brands" || name === "Shopee"))
    .sort((a, b) => waiting(b) - waiting(a) || a.localeCompare(b));

  function chooseBrand(name) {
    setBrand(name);
    setMenuOpen(false);
    setNotice("");
  }

  const kynx = items.filter((item) => item.kind === "kynx");
  const nominations = items.filter((item) => item.kind === "brand");
  const drafts = items.filter((item) => item.kind === "draft" || item.kind === "revision");
  const sections = role === "brands"
    ? [["Nominations", nominations], ["Drafts", drafts]]
    : role === "specialists"
      ? [["KYNX approval", kynx], ["Drafts", drafts]]
      : [["KYNX approval", kynx], ["Brand approval", nominations], ["Drafts", drafts]];

  function act(item, fields, message) {
    patchRecord(item.recordId, fields);
    setNotice(message);
  }

  return (
    <Workspace>
      <header className="page-head">
        <p className="eyebrow">{role === "brands" ? "Brand" : role === "admin" ? "Admin" : "Specialist"}</p>
        <h1>Reviews</h1>
        <p className="lede">
          {role === "brands"
            ? "Nominations and drafts are separate. A nomination is the person. A draft is the post."
            : "KYNX approval and drafts are separate. KYNX clears the person. The draft is the post."}
        </p>
      </header>
      {!brand ? (
        <section>
          <div className="section-label"><h2>Choose a brand</h2></div>
          {brandNames.length === 0 ? <p className="empty">No brands yet.</p> : (
            <div className="brand-pick-grid">
              {brandNames.map((name) => (
                <button key={name} type="button" className="brand-pick" onClick={() => chooseBrand(name)}>
                  <span className={waiting(name) ? "count-badge" : "count-badge zero"}>{waiting(name)}</span>
                  <span>
                    <strong>{name}</strong>
                    <small>{waiting(name) === 1 ? "1 creator needs approval" : `${waiting(name)} creators need approval`}</small>
                  </span>
                </button>
              ))}
            </div>
          )}
        </section>
      ) : (
        <div className="brand-switch">
          <button type="button" className="brand-current" aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}>
            <span className={waiting(brand) ? "count-badge" : "count-badge zero"}>{waiting(brand)}</span>
            {brand}
            <span className="caret" aria-hidden="true">▾</span>
          </button>
          {menuOpen ? (
            <div className="brand-menu" role="menu">
              {brandNames.map((name) => (
                <button key={name} type="button" role="menuitem" className={name === brand ? "active" : undefined} onClick={() => chooseBrand(name)}>
                  <span className={waiting(name) ? "count-badge" : "count-badge zero"}>{waiting(name)}</span>
                  {name}
                </button>
              ))}
            </div>
          ) : null}
        </div>
      )}
      {notice ? <p className="notice">{notice}</p> : null}
      {brand ? sections.map(([title, rows]) => (
        <section key={title} style={{ marginBottom: 28 }}>
          <div className="section-label"><h2>{title}</h2></div>
          {rows.length === 0 ? <p className="empty">Nothing is waiting.</p> : (
            <div className="stack">
              {rows.map((item) => (
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
                      <Link className="text-link" href={creatorPath(item.recordId)}>Open record</Link>
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
        </section>
      )) : null}
    </Workspace>
  );
}
