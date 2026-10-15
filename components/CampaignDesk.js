"use client";

import { useState } from "react";
import Link from "next/link";
import { Workspace } from "./Workspace";
import { useLedger } from "../lib/useLedger";
import { formatDate, formatFollowers, formatNumber } from "../lib/format";

export function CampaignDesk({ id }) {
  const { getCampaign, savePostViews, addPost } = useLedger();
  const campaign = getCampaign(id);
  const [notice, setNotice] = useState("");

  if (!campaign) {
    return (
      <Workspace active="/campaigns">
        <header className="page-head">
          <p className="eyebrow">Missing</p>
          <h1>That campaign is not on the desk.</h1>
          <p className="lede"><Link className="text-link" href="/campaigns">Back to campaigns</Link></p>
        </header>
      </Workspace>
    );
  }

  function saveViews(event, postId) {
    event.preventDefault();
    const views = Math.round(Number(new FormData(event.currentTarget).get("views")));
    if (!Number.isInteger(views) || views < 0) {
      setNotice("Check the view count, then save again.");
      return;
    }
    savePostViews(postId, views);
    setNotice("Views saved in this browser.");
  }

  function createPost(event) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const title = String(data.get("title") || "").trim();
    const publishedOn = String(data.get("publishedOn") || "");
    const views = Math.round(Number(data.get("views")));
    const creatorId = Number(data.get("creatorId"));
    if (!title || !/^\d{4}-\d{2}-\d{2}$/.test(publishedOn) || !Number.isInteger(views) || views < 0 || !creatorId) {
      setNotice("Check the post title, date, and view count, then save again.");
      return;
    }
    addPost({
      campaign_id: campaign.id,
      creator_id: creatorId,
      title: title.slice(0, 140),
      published_on: publishedOn,
      views,
    });
    event.currentTarget.reset();
    setNotice("Post added to the client ledger in this browser.");
  }

  return (
    <Workspace active="/campaigns">
      <header className="page-head">
        <p className="eyebrow">{campaign.client_name}</p>
        <h1>{campaign.name}</h1>
        <p className="lede">{campaign.brief}</p>
      </header>
      {notice ? <p className="notice">{notice}</p> : null}
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
        <Link href={{ pathname: "/creators", query: { niche: campaign.niche, min: campaign.min_tiktok_followers, from: campaign.id } }}>
          Find {campaign.niche} creators
        </Link>
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
                  <Link href={`/creators/${post.creator_id}`}>{post.creator_name}</Link>
                  <div className="handle">@{post.handle} · {formatFollowers(post.tiktok_followers)}</div>
                </td>
                <td className="num">
                  <form className="inline-form" onSubmit={(event) => saveViews(event, post.id)}>
                    <input aria-label={`Views for ${post.title}`} name="views" type="number" min="0" step="1" defaultValue={post.views} key={`${post.id}-${post.views}`} />
                    <button className="save" type="submit">Save</button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <form className="add-form" onSubmit={createPost}>
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
