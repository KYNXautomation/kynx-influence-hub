"use client";

import Link from "next/link";
import { Workspace } from "../../components/Workspace";
import { useRole } from "../../components/RoleProvider";
import { useLedger } from "../../lib/useLedger";
import { canSeeRecord } from "../../lib/roles";
import { formatNumber, formatPeso } from "../../lib/format";

export default function CampaignsPage() {
  const { role, creatorId, specialist } = useRole();
  const { listCampaigns } = useLedger();
  const campaigns = listCampaigns()
    .map((campaign) => ({ ...campaign, records: campaign.records.filter((record) => canSeeRecord(role, record, { creatorId, specialist })) }))
    .filter((campaign) => role === "admin" || campaign.records.length > 0 || (role === "specialists" && specialist === "all"));

  return (
    <Workspace active="/campaigns">
      <header className="page-head">
        <p className="eyebrow">Work</p>
        <h1>Campaigns</h1>
        <p className="lede">Each campaign keeps one record per creator: agreement, deliverables, and the views those posts generate.</p>
      </header>
      <div className="campaign-list">
        {campaigns.map((campaign) => (
          <article key={campaign.id} className="campaign-row">
            <div>
              <h3><Link href={`/campaigns/${campaign.id}`}>{campaign.name}</Link></h3>
              <p className="meta">{campaign.brand} · {campaign.owner}</p>
            </div>
            <div>
              {campaign.category ? <span className="pill">{campaign.category}</span> : <span className="pill">Open call</span>}
              <p className="meta">{campaign.records.length} creator records · {campaign.ready} ready to pay</p>
            </div>
            <div>
              <b>{formatNumber(campaign.records.reduce((sum, record) => sum + record.views, 0))}</b>
              <p className="meta">{formatPeso(campaign.budget)} sample budget</p>
            </div>
            <div className="actions">
              <Link href={`/campaigns/${campaign.id}`}>Open</Link>
            </div>
          </article>
        ))}
      </div>
    </Workspace>
  );
}
