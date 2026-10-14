import { notFound } from "next/navigation";
import { Workspace } from "../../layout";
import { getCreator } from "../../../lib/db";
import { formatDate, formatFollowers, formatNumber, formatPeso } from "../../../lib/format";

export default async function CreatorPage({ params }) {
  const { id } = await params;
  const creator = getCreator(Number(id));
  if (!creator) notFound();

  return (
    <Workspace active="/creators">
      <header className="page-head">
        <p className="eyebrow">@{creator.handle}</p>
        <h1>{creator.name}</h1>
        <p className="lede">{creator.bio}</p>
      </header>
      <section className="stats" aria-label="Creator summary">
        <div className="stat">
          <b>{formatFollowers(creator.tiktok_followers)}</b>
          <span>TikTok followers</span>
        </div>
        <div className="stat">
          <b>{formatNumber(creator.views_generated)}</b>
          <span>Views generated</span>
        </div>
        <div className="stat">
          <b>{formatPeso(creator.rate_php)}</b>
          <span>Sample rate</span>
        </div>
      </section>
      <div className="profile">
        <div>
          <div className="section-label"><h2>Niches</h2></div>
          <p>{creator.niches}</p>
          <p className="meta">{creator.location}</p>
          <p><a className="text-link" href={`/creators?niche=${encodeURIComponent(creator.primary_niche)}`}>More {creator.primary_niche} creators</a></p>
        </div>
        <div>
          <div className="section-label"><h2>Posts on record</h2></div>
          {creator.posts.length === 0 ? <p className="empty">No documented posts yet.</p> : (
            <table>
              <thead>
                <tr>
                  <th>Post</th>
                  <th>Client</th>
                  <th className="num">Views</th>
                </tr>
              </thead>
              <tbody>
                {creator.posts.map((post) => (
                  <tr key={post.id}>
                    <td>
                      <span className="who">
                        <b>{post.title}</b>
                        <span className="handle">{formatDate(post.published_on)} · {post.platform}</span>
                      </span>
                    </td>
                    <td>
                      <a href={`/campaigns/${post.campaign_id}`}>{post.client_name}</a>
                      <div className="handle">{post.campaign_name}</div>
                    </td>
                    <td className="num">{formatNumber(post.views)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </Workspace>
  );
}
