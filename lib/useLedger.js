"use client";

import { useEffect, useState } from "react";
import { seedPosts, withPosts } from "./model";

const storageKey = "kynx-ledger-posts";

export function useLedger() {
  const [posts, setPosts] = useState(seedPosts);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) || "null");
      if (Array.isArray(saved) && saved.length > 0) setPosts(saved);
    } catch {
      /* keep the sample ledger */
    }
  }, []);

  function persist(next) {
    setPosts(next);
    localStorage.setItem(storageKey, JSON.stringify(next));
  }

  function savePostViews(postId, views) {
    persist(posts.map((post) => (post.id === postId ? { ...post, views } : post)));
  }

  function addPost(draft) {
    const id = posts.reduce((max, post) => Math.max(max, post.id), 0) + 1;
    persist([...posts, { id, platform: "TikTok", ...draft }]);
  }

  return { ...withPosts(posts), savePostViews, addPost };
}
