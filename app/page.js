"use client";

import Link from "next/link";
import { Workspace } from "../components/Workspace";
import { Avatar } from "../components/Avatar";
import { useRole } from "../components/RoleProvider";
import { useLedger } from "../lib/useLedger";
import { canSeeRecord, roleById } from "../lib/roles";
import { formatNumber, formatPeso } from "../lib/format";

export default function HomePage() {
  const { role, creatorId, specialist, creator } = useRole();
  const { overviewStats, listCampaigns, listRecords } = useLedger();
  const stats = overviewStats();
  const scope = { creatorId, specialist };
  const campaigns = listCampaigns()
    .map((campaign) => ({ ...campaign, records: campaign.records.filter((record) => canSeeRecord(role, record, scope)) }))
    .filter((campaign) => role === "admin" || role === "specialists" || campaign.records.length > 0 || (role === "brands" && campaign.brand === "Shopee"));
  const mine = listRecords().filter((record) => canSeeRecord(role, record, scope));
  const current = roleById(role);

  return (
    <Workspace>
      <header className="page-head">
        <p className="eyebrow">{role === "admin" ? "Operations" : current.label}</p>
        <h1>
          {role === "creators" ? `${creator.name.split(" ")[0]}, your campaigns.` : role === "finance" ? "Clear the records. Then pay." : role === "brands" ? "Review the work. See the views." : "Match creators. Clear the work. Count the views."}
        </h1>
        <p className="lede">{current.detail}</p>
      </header>
      <section className="stats" aria-label="Workspace summary">
        {role === "finance" ? (
          <>
            <Link className="stat" href="/payments"><b>{formatPeso(stats.readyAmount)}</b><span>{stats.ready} ready to pay</span></Link>
            <Link className="stat" href="/impact"><b>{formatNumber(stats.views)}</b><span>Generated views</span></Link>
          </>
        ) : role === "creators" ? (
          <>
            <div className="stat"><b>{formatNumber(mine.length)}</b><span>Your campaigns</span></div>
            <div className="stat"><b>{formatNumber(mine.reduce((sum, record) => sum + record.views, 0))}</b><span>Generated views</span></div>
          </>
        ) : (
          <>
            <Link className="stat" href="/campaigns"><b>{formatNumber(role === "admin" ? stats.campaigns : campaigns.length)}</b><span>Campaigns</span></Link>
            <Link className="stat" href={role === "brands" ? "/reviews" : "/creators"}><b>{formatNumber(role === "admin" ? stats.collaborations : mine.length)}</b><span>Creator records</span></Link>
            {role === "admin" ? <Link className="stat" href="/payments"><b>{formatPeso(stats.readyAmount)}</b><span>{stats.ready} ready to pay</span></Link> : null}
            <Link className="stat" href="/impact"><b>{formatNumber(role === "admin" ? stats.views : mine.reduce((sum, record) => sum + record.views, 0))}</b><span>Generated views</span></Link>
          </>
        )}
      </section>
      {role === "creators" ? (
        <div className="stack">
          {mine.map((record) => (
            <article key={record.id} className="campaign-row">
              <div className="who">
                <Avatar name={record.creator.name} />
                <span>
                  <h3><Link href={`/creators/${record.id}`}>{record.campaign.name}</Link></h3>
                  <p className="meta">@{record.creator.handle} · {record.owner}</p>
                </span>
              </div>
              <div><span className="pill">{record.status}</span></div>
              <div>
                <b>{formatNumber(record.views)}</b>
                <p className="meta">Generated views</p>
              </div>
              <div className="actions"><Link href={`/creators/${record.id}`}>Open</Link></div>
            </article>
          ))}
        </div>
      ) : (
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
                <b>{formatNumber(campaign.records.reduce((sum, record) => sum + record.views, 0))}</b>
                <p className="meta">Generated views</p>
              </div>
              <div className="actions">
                {role !== "finance" && role !== "brands" ? (
                  <Link href={{ pathname: "/creators", query: { niche: campaign.category || undefined, min: campaign.minFollowers || undefined, from: campaign.id } }}>Find creators</Link>
                ) : null}
                <Link href={`/campaigns/${campaign.id}`}>Open</Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </Workspace>
  );
}
