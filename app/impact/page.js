"use client";

import Link from "next/link";
import { Workspace } from "../../components/Workspace";
import { useLedger } from "../../lib/useLedger";
import { formatDate, formatNumber } from "../../lib/format";

export default function ImpactPage() {
  const { listImpact } = useLedger();
  const clients = listImpact();
  const total = clients.reduce((sum, client) => sum + client.views, 0);

  return (
    <Workspace active="/impact">
      <header className="page-head">
        <p className="eyebrow">Clients</p>
        <h1>Views we generated</h1>
        <p className="lede">Published deliverables carry the view count. The brand total is the sum of those posts.</p>
      </header>
      <section className="stats" aria-label="All documented views">
        <div className="stat"><b>{formatNumber(total)}</b><span>Views across brands</span></div>
        <div className="stat"><b>{formatNumber(clients.length)}</b><span>Brands</span></div>
        <div className="stat"><b>{formatNumber(clients.reduce((sum, client) => sum + client.posts.length, 0))}</b><span>Published posts</span></div>
      </section>
      <div className="client-list">
        {clients.map((client) => (
          <section key={client.name} className="client-block">
            <div className="section-label">
              <h2>{client.name}</h2>
              <span className="client-total">{formatNumber(client.views)}</span>
            </div>
            {client.posts.length === 0 ? <p className="empty">No published posts for this brand yet.</p> : (
              <table>
                <thead>
                  <tr>
                    <th>Post</th>
                    <th>Campaign</th>
                    <th>Creator</th>
                    <th className="num">Views</th>
                  </tr>
                </thead>
                <tbody>
                  {client.posts.map((post) => (
                    <tr key={post.id}>
                      <td>
                        <b>{post.title}</b>
                        <div className="handle">{post.postedAt ? formatDate(post.postedAt) : ""} · {post.videoId}</div>
                      </td>
                      <td><Link href={`/campaigns/${post.campaignId}`}>{post.campaignName}</Link></td>
                      <td><Link href={`/creators/${post.recordId}`}>@{post.handle}</Link></td>
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
