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
        <p className="lede">
          Every documented number comes from a creator post on a campaign. The client total is the sum of those posts.
        </p>
      </header>
      <section className="stats" aria-label="All documented views">
        <div className="stat">
          <b>{formatNumber(total)}</b>
          <span>Views across clients</span>
        </div>
        <div className="stat">
          <b>{formatNumber(clients.length)}</b>
          <span>Clients</span>
        </div>
        <div className="stat">
          <b>{formatNumber(clients.reduce((sum, client) => sum + client.post_count, 0))}</b>
          <span>Posts</span>
        </div>
      </section>
      <div className="client-list">
        {clients.map((client) => (
          <section key={client.id} id={`client-${client.id}`} className="client-block">
            <div className="section-label">
              <h2>{client.name}</h2>
              <span className="client-total">{formatNumber(client.views)}</span>
            </div>
            <p className="meta">{client.industry} · {client.post_count} posts</p>
            {client.posts.length === 0 ? (
              <p className="empty">No posts documented for this client yet.</p>
            ) : (
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
                        <span className="who">
                          <b>{post.title}</b>
                          <span className="handle">{formatDate(post.published_on)} · {post.platform}</span>
                        </span>
                      </td>
                      <td><Link href={`/campaigns/${post.campaign_id}`}>{post.campaign_name}</Link></td>
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
