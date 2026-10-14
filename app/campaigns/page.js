import { Workspace } from "../layout";
import { listCampaigns } from "../../lib/db";
import { formatFollowers, formatNumber } from "../../lib/format";

export default function CampaignsPage() {
  const campaigns = listCampaigns();

  return (
    <Workspace active="/campaigns">
      <header className="page-head">
        <p className="eyebrow">Work</p>
        <h1>Campaigns</h1>
        <p className="lede">Each campaign asks for a niche. Use that to pull a shortlist, then document the views those posts generate.</p>
      </header>
      <div className="campaign-list">
        {campaigns.map((campaign) => (
          <article key={campaign.id} className="campaign-row">
            <div>
              <h3><a href={`/campaigns/${campaign.id}`}>{campaign.name}</a></h3>
              <p className="meta">{campaign.client_name}</p>
            </div>
            <div>
              <span className="pill">{campaign.niche}</span>
              <p className="meta">{formatFollowers(campaign.min_tiktok_followers)}+ TikTok · {campaign.status}</p>
            </div>
            <div>
              <b>{formatNumber(campaign.views)}</b>
              <p className="meta">{campaign.post_count} documented posts</p>
            </div>
            <div className="actions">
              <a href={`/creators?niche=${encodeURIComponent(campaign.niche)}&min=${campaign.min_tiktok_followers}&from=${campaign.id}`}>
                Find creators
              </a>
            </div>
          </article>
        ))}
      </div>
    </Workspace>
  );
}
