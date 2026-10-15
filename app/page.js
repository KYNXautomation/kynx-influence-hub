"use client";

import Link from "next/link";
import { Workspace } from "../components/Workspace";
import { useLedger } from "../lib/useLedger";
import { formatNumber, formatPeso } from "../lib/format";

export default function HomePage() {
  const { overviewStats, listCampaigns } = useLedger();
  const stats = overviewStats();
  const campaigns = listCampaigns();

  return (
    <Workspace active="/">
      <header className="page-head">
        <p className="eyebrow">Your workspace, at a glance</p>
        <h1>Match creators. Clear the work. Count the views.</h1>
        <p className="lede">
          Campaign records follow agreement, deliverables, review, and payment readiness. Published posts keep the views generated for the brand.
        </p>
      </header>
      <section className="stats" aria-label="Workspace summary">
        <Link className="stat" href="/campaigns"><b>{formatNumber(stats.campaigns)}</b><span>Campaigns</span></Link>
        <Link className="stat" href="/creators"><b>{formatNumber(stats.collaborations)}</b><span>Creator records</span></Link>
        <Link className="stat" href="/payments"><b>{formatPeso(stats.readyAmount)}</b><span>{stats.ready} ready to pay</span></Link>
        <Link className="stat" href="/impact"><b>{formatNumber(stats.views)}</b><span>Documented views</span></Link>
      </section>
      <div className="section-label">
        <h2>Campaigns</h2>
        <Link href="/reviews">{stats.reviews} items in review</Link>
      </div>
      <div className="campaign-list">
        {campaigns.map((campaign) => (
          <article key={campaign.id} className="campaign-row">
            <div>
              <h3>{campaign.name}</h3>
              <p className="meta">{campaign.brand} · {campaign.description}</p>
            </div>
            <div>
              <span className="pill">{campaign.category || "Open"}</span>
              <p className="meta">{campaign.records.length} creators</p>
            </div>
            <div>
              <b>{formatNumber(campaign.views)}</b>
              <p className="meta">{campaign.ready} ready to pay</p>
            </div>
            <div className="actions">
              <Link href={{ pathname: "/creators", query: { niche: campaign.category || undefined, min: campaign.minFollowers || undefined, from: campaign.id } }}>Find creators</Link>
              <Link href={`/campaigns/${campaign.id}`}>Open</Link>
            </div>
          </article>
        ))}
      </div>
    </Workspace>
  );
}
