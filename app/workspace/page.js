"use client";

import Link from "next/link";
import { Workspace } from "../../components/Workspace";
import { Avatar } from "../../components/Avatar";
import { useRole } from "../../components/RoleProvider";
import { useLedger } from "../../lib/useLedger";
import { canSeeRecord, roleById } from "../../lib/roles";
import { formatDate, formatNumber, formatPeso, formatRate } from "../../lib/format";
import { campaignPath, creatorPath } from "../../lib/paths";

export default function HomePage() {
  const { role, creatorId, specialist, creator } = useRole();
  const { overviewStats, listCampaigns, listRecords, listImpact, attention } = useLedger();
  const stats = overviewStats();
  const scope = { creatorId, specialist };
  const campaigns = listCampaigns()
    .map((campaign) => ({ ...campaign, records: campaign.records.filter((record) => canSeeRecord(role, record, scope)) }))
    .filter((campaign) => role === "admin" || role === "finance" || campaign.records.length > 0 || (role === "brands" && campaign.brand === "Shopee"));
  const mine = listRecords().filter((record) => canSeeRecord(role, record, scope));
  const current = roleById(role);
  const alerts = attention().filter((record) => canSeeRecord(role, record, scope));

  if (role === "brands") {
    const posts = listImpact()
      .filter((client) => client.brand === "Shopee")
      .flatMap((client) => client.posts);
    const visible = campaigns.map((campaign) => ({
      ...campaign,
      posts: posts.filter((post) => post.campaignId === campaign.id),
    }));
    const total = visible.reduce((sum, campaign) => sum + campaign.views, 0);
    return (
      <Workspace active="/workspace">
        <header className="page-head">
          <p className="eyebrow">Home</p>
          <h1>Generated views</h1>
          <p className="lede">Each campaign total is the sum of its published posts.</p>
        </header>
        <section className="stats" aria-label="Generated views">
          <div className="stat"><b>{formatNumber(total)}</b><span>Generated views</span></div>
          <div className="stat"><b>{formatNumber(visible.length)}</b><span>Campaigns</span></div>
        </section>
        <div className="client-list">
          {visible.map((campaign) => (
            <section key={campaign.id} className="client-block">
              <div className="section-label">
                <h2>{campaign.name}</h2>
                <span className="client-total">{formatNumber(campaign.views)}</span>
              </div>
              {campaign.posts.length === 0 ? <p className="empty">No published posts for this campaign yet.</p> : (
                <table>
                  <thead>
                    <tr>
                      <th>Post</th>
                      <th>Creator</th>
                      <th className="num">Views</th>
                    </tr>
                  </thead>
                  <tbody>
                    {campaign.posts.map((post) => (
                      <tr key={post.id}>
                        <td>
                          <b>{post.title}</b>
                          <div className="handle">{post.postedAt ? formatDate(post.postedAt) : ""}</div>
                        </td>
                        <td>@{post.handle}</td>
                        <td className="num">{formatNumber(post.views)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </section>
          ))}
        </div>
      </Workspace>
    );
  }

  return (
    <Workspace>
      <header className="page-head">
        <p className="eyebrow">{role === "admin" ? "Operations" : current.label}</p>
        <h1>
          {role === "creators" ? `${creator.name.split(" ")[0]}, your campaigns.` : role === "finance" ? "Campaign money, then creator cost." : role === "specialists" ? "Your creators, from pitch to post." : "Pitch. Approve. Post."}
        </h1>
        <p className="lede">{current.detail}</p>
      </header>
      <section className="stats" aria-label="Workspace summary">
        {role === "finance" ? (
          <>
            <Link className="stat" href="/payments"><b>{formatPeso(stats.creatorCost)}</b><span>Creator cost on the tracker</span></Link>
            <Link className="stat" href="/payments"><b>{formatPeso(stats.readyAmount)}</b><span>{stats.ready} ready to pay</span></Link>
            <Link className="stat" href="/impact"><b>{formatNumber(stats.views)}</b><span>Generated views</span></Link>
          </>
        ) : role === "creators" ? (
          <>
            <div className="stat"><b>{formatNumber(mine.length)}</b><span>Your nominations</span></div>
            <div className="stat"><b>{formatNumber(mine.reduce((sum, record) => sum + record.views, 0))}</b><span>Generated views</span></div>
          </>
        ) : (
          <>
            <Link className="stat" href="/campaigns"><b>{formatNumber(stats.live)}</b><span>Live campaign</span></Link>
            <Link className="stat" href="/creators"><b>{formatNumber(mine.filter((record) => record.onTracker).length)}</b><span>On the tracker</span></Link>
            <Link className="stat" href="/reviews"><b>{formatNumber(alerts.length)}</b><span>Follow up or escalate</span></Link>
            {role === "specialists" ? <div className="stat"><b>{formatNumber(mine.reduce((sum, record) => sum + record.views, 0))}</b><span>Generated views</span></div> : null}
          </>
        )}
      </section>
      {role === "admin" || role === "specialists" ? (
        <section className="panel" style={{ marginBottom: 14 }}>
          <h2>How a row moves</h2>
          <p className="meta">A creator reaches the live tracker only after all three. Dropped rows stay in place.</p>
          <ol className="checks">
            <li>Specialist pitches and the creator confirms.</li>
            <li>Admin approves for KYNX. Until then the client sheet does not receive the row.</li>
            <li>The brand approves. Rate, MOA, tax, and internal notes never go across.</li>
            <li>Stage is then calculated: negotiating, draft, revision, approved for posting, posted.</li>
          </ol>
        </section>
      ) : null}
      {alerts.length > 0 && role !== "creators" && role !== "brands" ? (
        <>
          <div className="section-label"><h2>Needs a person today</h2></div>
          <div className="stack" style={{ marginBottom: 18 }}>
            {alerts.map((record) => (
              <article key={record.id} className="campaign-row">
                <div className="who">
                  <Avatar name={record.creator.name} />
                  <span>
                    <h3><Link href={creatorPath(record.id)}>{record.creator.name}</Link></h3>
                    <p className="meta">@{record.creator.handle} · {record.program} · {record.owner}</p>
                  </span>
                </div>
                <div><span className="pill">{record.stage}</span><p className="meta">{record.late} days late · {record.risk}</p></div>
                <div><b>{record.action}</b><p className="meta">{formatRate(record.rate)}</p></div>
                <div className="actions"><Link href={creatorPath(record.id)}>Open</Link></div>
              </article>
            ))}
          </div>
        </>
      ) : null}
      {role === "creators" ? (
        <div className="stack">
          {mine.map((record) => (
            <article key={record.id} className="campaign-row">
              <div className="who">
                <Avatar name={record.creator.name} />
                <span>
                  <h3><Link href={creatorPath(record.id)}>{record.program}</Link></h3>
                  <p className="meta">{record.campaign.name} · {record.owner}</p>
                </span>
              </div>
              <div><span className="pill">{record.status}</span></div>
              <div>
                <b>{formatNumber(record.views)}</b>
                <p className="meta">Generated views</p>
              </div>
              <div className="actions"><Link href={creatorPath(record.id)}>Open</Link></div>
            </article>
          ))}
        </div>
      ) : (
        <div className="campaign-list">
          {campaigns.map((campaign) => (
            <article key={campaign.id} className="campaign-row">
              <div>
                <h3>{campaign.name}</h3>
                <p className="meta">{campaign.client} · {campaign.objective} · {campaign.campaignStatus}</p>
              </div>
              <div>
                <span className="pill">{campaign.paymentStatus}</span>
                <p className="meta">{campaign.confirmed} of {campaign.targetKols} on the tracker</p>
              </div>
              <div>
                <b>{formatNumber(campaign.views)}</b>
                <p className="meta">Generated views</p>
              </div>
              <div className="actions"><Link href={campaignPath(campaign.id)}>Open</Link></div>
            </article>
          ))}
        </div>
      )}
    </Workspace>
  );
}
