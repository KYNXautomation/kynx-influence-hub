import { Workspace } from "./layout";
import { listCampaigns, overviewStats } from "../lib/db";
import { formatFollowers, formatNumber } from "../lib/format";

export default function HomePage() {
  const stats = overviewStats();
  const campaigns = listCampaigns();

  return (
    <Workspace active="/">
      <header className="page-head">
        <p className="eyebrow">Kynx desk</p>
        <h1>Match creators. Count the views.</h1>
        <p className="lede">
          When a campaign needs a niche, filter the roster by that niche and by TikTok followers. Views from the posts those creators publish are kept against the client.
        </p>
      </header>
      <section className="stats" aria-label="Roster summary">
        <div className="stat">
          <b>{formatNumber(stats.creators)}</b>
          <span>Creators</span>
        </div>
        <div className="stat">
          <b>{formatNumber(stats.views)}</b>
          <span>Documented views</span>
        </div>
        <div className="stat">
          <b>{formatNumber(stats.campaigns)}</b>
          <span>Open campaigns</span>
        </div>
      </section>
      <div className="section-label">
        <h2>Campaigns</h2>
        <a href="/impact">Client view ledger</a>
      </div>
      <div className="campaign-list">
        {campaigns.map((campaign) => (
          <article key={campaign.id} className="campaign-row">
            <div>
              <h3>{campaign.name}</h3>
              <p className="meta">{campaign.client_name} · {campaign.status}</p>
            </div>
            <div>
              <span className="pill">{campaign.niche}</span>
              <p className="meta">{formatFollowers(campaign.min_tiktok_followers)}+ TikTok</p>
            </div>
            <div>
              <b>{formatNumber(campaign.views)}</b>
              <p className="meta">{campaign.post_count} posts</p>
            </div>
            <div className="actions">
              <a href={`/creators?niche=${encodeURIComponent(campaign.niche)}&min=${campaign.min_tiktok_followers}&from=${campaign.id}`}>
                Find creators
              </a>
              <a href={`/campaigns/${campaign.id}`}>Open</a>
            </div>
          </article>
        ))}
      </div>
    </Workspace>
  );
}
