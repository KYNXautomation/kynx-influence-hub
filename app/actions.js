"use server";

import { redirect } from "next/navigation";
import { getDb } from "../lib/db";

function wholeNumber(value) {
  const number = Math.round(Number(value));
  if (!Number.isInteger(number) || number < 0 || number > 2_000_000_000) return null;
  return number;
}

export async function savePostViews(formData) {
  const postId = Number(formData.get("postId"));
  const campaignId = Number(formData.get("campaignId"));
  const views = wholeNumber(formData.get("views"));
  const destination = `/campaigns/${campaignId}`;
  if (!Number.isInteger(postId) || !Number.isInteger(campaignId) || views === null) {
    redirect(`${destination}?error=views`);
  }
  const post = getDb()
    .prepare("SELECT id FROM posts WHERE id = ? AND campaign_id = ?")
    .get(postId, campaignId);
  if (!post) redirect(`${destination}?error=views`);
  getDb().prepare("UPDATE posts SET views = ? WHERE id = ?").run(views, postId);
  redirect(`${destination}?saved=views`);
}

export async function addPost(formData) {
  const campaignId = Number(formData.get("campaignId"));
  const creatorId = Number(formData.get("creatorId"));
  const title = String(formData.get("title") || "").trim();
  const publishedOn = String(formData.get("publishedOn") || "");
  const views = wholeNumber(formData.get("views"));
  const destination = `/campaigns/${campaignId}`;
  const validDate = /^\d{4}-\d{2}-\d{2}$/.test(publishedOn);
  if (!Number.isInteger(campaignId) || !Number.isInteger(creatorId) || !title || !validDate || views === null) {
    redirect(`${destination}?error=post`);
  }
  const db = getDb();
  const campaign = db.prepare("SELECT id FROM campaigns WHERE id = ?").get(campaignId);
  const creator = db.prepare("SELECT id FROM creators WHERE id = ?").get(creatorId);
  if (!campaign || !creator) redirect(`${destination}?error=post`);
  db.prepare(
    "INSERT INTO posts (campaign_id, creator_id, platform, title, published_on, views) VALUES (?, ?, 'TikTok', ?, ?, ?)",
  ).run(campaignId, creatorId, title.slice(0, 140), publishedOn, views);
  redirect(`${destination}?saved=post`);
}
