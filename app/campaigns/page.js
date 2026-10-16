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
    .filter((campaign) => role === "admin" || role === "finance" || campaign.records.length > 0 || (role === "specialists" && specialist === "all"));

  return (
    <Workspace active="/campaigns">
      <header className="page-head">
        <p className="eyebrow">Work</p>
        <h1>Campaigns</h1>
        <p className="lede">One row per campaign. Programs live inside it. Creator cost counts only the rows that cleared the three gates. Amounts on this desk are samples.</p>
      </header>
      <div className="campaign-list">
        {campaigns.map((campaign) => (
          <article key={campaign.id} className="campaign-row">
            <div>
              <h3><Link href={`/campaigns/${campaign.id}`}>{campaign.name}</Link></h3>
              <p className="meta">{campaign.client} · {campaign.objective} · {campaign.owner}</p>
            </div>
            <div>
              <span className="pill">{campaign.campaignStatus}</span>
              <p className="meta">{campaign.paymentStatus} · {campaign.confirmed} on the tracker · {campaign.posted} posted</p>
            </div>
            <div>
              <b>{formatPeso(campaign.gross)}</b>
              <p className="meta">{Math.round(campaign.margin * 100)}% after creator cost, boosting, and VAT</p>
            </div>
            <div className="actions">
              <Link href={`/campaigns/${campaign.id}`}>Open</Link>
            </div>
          </article>
        ))}
      </div>
      <p className="meta">Generated views across visible campaigns: {formatNumber(campaigns.reduce((sum, campaign) => sum + campaign.views, 0))}.</p>
    </Workspace>
  );
}
