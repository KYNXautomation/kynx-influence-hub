import { creators } from "./model";
import { basePath } from "./paths";

// Our Works first, in the order on kynxinfluencehub.com/our-works, then everyone else by followers.
export const showcaseRank = ["c28", "c29", "c30", "c31", "c32", "c33", "c34", "c35", "c24", "c22", "c26", "c25", "c23", "c20", "c19", "c21", "c27"];

const textFields = ["name", "handle", "niche", "location", "brand", "instagram", "bio", "photo"];

// Artists an admin adds get ids like "a1729580000000" so they never clash with the model's "c" ids.
export function isAddedArtist(id) {
  return /^a\d+$/.test(id || "");
}

export function artistPath(creator) {
  return isAddedArtist(creator.id) ? `/artists/view/?id=${encodeURIComponent(creator.id)}` : `/artists/${creator.id}`;
}

export function artistPhoto(creator) {
  if (creator.photo) return creator.photo;
  if (creator.portrait === false || isAddedArtist(creator.id)) return "";
  return `${basePath}/artists/${creator.id}.jpg`;
}

function withProfile(creator, extra = {}) {
  const next = { ...creator };
  for (const key of textFields) {
    if (typeof extra[key] === "string") next[key] = extra[key];
  }
  if (Array.isArray(extra.points)) next.points = extra.points;
  if (extra.followers !== undefined && extra.followers !== "" && Number.isFinite(Number(extra.followers))) {
    next.followers = Number(extra.followers);
  }
  return next;
}

export function applyShowcase(saved) {
  const order = Array.isArray(saved?.order) && saved.order.length ? saved.order : showcaseRank;
  const profiles = saved?.profiles || {};
  const hidden = new Set(Array.isArray(saved?.hidden) ? saved.hidden : []);
  const added = Array.isArray(saved?.added) ? saved.added : [];
  const rank = new Map(order.map((id, index) => [id, index]));
  const addedRank = new Map(added.map((creator, index) => [creator.id, 1000 + index]));
  const builtIn = creators.filter((creator) => creator.showcase && !hidden.has(creator.id));
  return [...builtIn, ...added]
    .map((creator) => withProfile(creator, profiles[creator.id]))
    .sort((a, b) => (rank.get(a.id) ?? addedRank.get(a.id) ?? 999) - (rank.get(b.id) ?? addedRank.get(b.id) ?? 999) || a.name.localeCompare(b.name));
}

export function removedArtists(saved) {
  const hidden = new Set(Array.isArray(saved?.hidden) ? saved.hidden : []);
  return creators.filter((creator) => creator.showcase && hidden.has(creator.id)).map((creator) => withProfile(creator, saved?.profiles?.[creator.id]));
}
