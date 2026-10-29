"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Workspace } from "../../../components/Workspace";
import { Avatar } from "../../../components/Avatar";
import { useLedger } from "../../../lib/useLedger";
import { useTalents } from "../../../lib/useTalents";
import { presentTalent } from "../../../lib/talents";
import { campaignPath, creatorPath } from "../../../lib/paths";
import { formatDate, formatFollowers, formatNumber, formatRate } from "../../../lib/format";

function CampaignList({ title, rows, empty }) {
  return (
    <section style={{ marginBottom: 28 }}>
      <div className="section-label"><h2>{title}</h2></div>
      {rows.length === 0 ? <p className="empty">{empty}</p> : (
        <div className="stack">
          {rows.map((record) => (
            <article className="panel talent-campaign" key={record.id}>
              <span>
                <h3><Link href={campaignPath(record.campaign.id)}>{record.campaign.name}</Link></h3>
                <p className="meta">{[record.campaign.brand, record.program, record.owner ? `PIC ${record.owner}` : ""].filter(Boolean).join(" · ")}</p>
              </span>
              <span className="status">{record.kolConfirmation === "Dropped" ? "Dropped" : record.stage}</span>
              <span>
                <strong>{record.postDate ? formatDate(record.postDate) : record.postDue ? formatDate(record.postDue) : "No date"}</strong>
                <span className="meta">{record.postDate ? "Posted" : "Post due"}</span>
              </span>
              <span>
                <strong>{formatRate(record.rate)}</strong>
                <span className="meta">{record.views ? `${formatNumber(record.views)} views` : "Rate"}</span>
              </span>
              <Link className="ghost" href={creatorPath(record.id)}>Open record</Link>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

// One talent's campaigns. Opened in its own browser tab from the Talents page (?id=).
export default function TalentCampaignsPage() {
  const [id, setId] = useState(null);
  const { listRecords } = useLedger();
  const { talents, ready } = useTalents();

  useEffect(() => {
    setId(new URLSearchParams(window.location.search).get("id") || "");
  }, []);

  const saved = id ? talents.find((item) => item.id === id) : null;
  const records = listRecords();

  if (id === null || !ready) return <Workspace active="/talents" />;
  if (!saved) {
    return (
      <Workspace active="/talents">
        <header className="page-head">
          <p className="eyebrow">Talent campaigns</p>
          <h1>That talent isn’t on the roster.</h1>
          <p className="lede"><Link className="text-link" href="/talents">Back to talents</Link></p>
        </header>
      </Workspace>
    );
  }

  const talent = presentTalent(saved, records);
  const mine = saved.creatorId ? records.filter((record) => record.creatorId === saved.creatorId) : [];
  const ongoingIds = new Set(talent.ongoing.map((item) => item.recordId));
  const ongoing = mine.filter((record) => ongoingIds.has(record.id));
  const past = mine.filter((record) => !ongoingIds.has(record.id));

  return (
    <Workspace active="/talents">
      <header className="page-head">
        <p className="eyebrow">Talent campaigns</p>
        <div className="who" style={{ gap: 16 }}>
          <Avatar name={talent.name} size="lg" />
          <div>
            <h1>{talent.name}</h1>
            <p className="meta">
              {[talent.handle ? `@${talent.handle}` : "", talent.niche, talent.followers ? `${formatFollowers(talent.followers)} followers` : "", `Manager ${talent.manager}`].filter(Boolean).join(" · ")}
            </p>
          </div>
        </div>
      </header>

      <div className="stats">
        <div className="stat"><b>{ongoing.length}</b><span>Ongoing</span></div>
        <div className="stat"><b>{past.length}</b><span>Finished or dropped</span></div>
        <div className="stat"><b>{talent.campaigns.length}</b><span>Campaigns joined</span></div>
        <div className="stat"><b>{formatNumber(talent.views)}</b><span>Generated views</span></div>
      </div>

      <CampaignList title="Ongoing campaigns" rows={ongoing} empty={`${talent.name} is not on an ongoing campaign right now.`} />
      <CampaignList title="Past campaigns" rows={past} empty="No finished or dropped campaigns yet." />
    </Workspace>
  );
}
