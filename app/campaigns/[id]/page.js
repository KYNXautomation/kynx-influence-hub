import { notFound } from "next/navigation";
import { Workspace } from "../../layout";
import { getCampaign } from "../../../lib/db";
import { addPost, savePostViews } from "../../actions";
import { formatDate, formatFollowers, formatNumber } from "../../../lib/format";

export default async function CampaignPage({ params, searchParams }) {
  const { id } = await params;
  const query = await searchParams;
  const campaign = getCampaign(Number(id));
  if (!campaign) notFound();

  return (
    <Workspace active="/campaigns">
      <header className="page-head">
        <p className="eyebrow">{campaign.client_name}</p>
        <h1>{campaign.name}</h1>
        <p className="lede">{campaign.brief}</p>
      </header>
      {query.saved === "views" ? <p className="notice">Views saved for this client.</p> : null}
      {query.saved === "post" ? <p className="notice">Post added to the client ledger.</p> : null}
      {query.error ? <p className="notice warn">Check the post title, date, and view count, then save again.</p> : null}
      <section className="stats" aria-label="Campaign summary">
        <div className="stat">
          <b>{campaign.niche}</b>
          <span>Required niche</span>
        </div>
        <div className="stat">
          <b>{formatFollowers(campaign.min_tiktok_followers)}+</b>
          <span>TikTok followers</span>
        </div>
        <div className="stat">
          <b>{formatNumber(campaign.views)}</b>
          <span>Documented views</span>
        </div>
      </section>
      <div className="section-label">
        <h2>Posts</h2>
        <a href={`/creators?niche=${encodeURIComponent(campaign.niche)}&min=${campaign.min_tiktok_followers}&from=${campaign.id}`}>
          Find {campaign.niche} creators
        </a>
      </div>
      {campaign.posts.length === 0 ? (
        <p className="empty">No posts documented yet. Add the first one below.</p>
      ) : (
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
                  <span className="who">
                    <b>{post.title}</b>
                    <span className="handle">{formatDate(post.published_on)} · {post.platform}</span>
                  </span>
                </td>
                <td>
                  <a href={`/creators/${post.creator_id}`}>{post.creator_name}</a>
                  <div className="handle">@{post.handle} · {formatFollowers(post.tiktok_followers)}</div>
                </td>
                <td className="num">
                  <form className="inline-form" action={savePostViews}>
                    <input type="hidden" name="postId" value={post.id} />
                    <input type="hidden" name="campaignId" value={campaign.id} />
                    <input aria-label={`Views for ${post.title}`} name="views" type="number" min="0" step="1" defaultValue={post.views} />
                    <button className="save" type="submit">Save</button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <form className="add-form" action={addPost}>
        <input type="hidden" name="campaignId" value={campaign.id} />
        <label>
          Creator
          <select name="creatorId" defaultValue={campaign.creatorsForForm.find((creator) => creator.niche_match)?.id}>
            {campaign.creatorsForForm.map((creator) => (
              <option key={creator.id} value={creator.id}>
                {creator.name} · @{creator.handle} · {formatFollowers(creator.tiktok_followers)}{creator.niche_match ? ` · ${campaign.niche}` : ""}
              </option>
            ))}
          </select>
        </label>
        <label>
          Post
          <input name="title" placeholder="Post title" required maxLength={140} />
        </label>
        <label>
          Published
          <input name="publishedOn" type="date" required defaultValue="2026-10-14" />
        </label>
        <label>
          Views
          <input name="views" type="number" min="0" step="1" defaultValue="0" required />
        </label>
        <button className="apply" type="submit">Add post</button>
      </form>
    </Workspace>
  );
}
