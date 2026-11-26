"use client";

import { useEffect, useState } from "react";
import { creators } from "./model";
import { basePath } from "./paths";
import { artistPhoto } from "./showcase";

export function coverFor(item) {
  if (item.image) return item.image.startsWith("/") ? `${basePath}${item.image}` : item.image;
  const artist = creators.find((creator) => creator.id === item.artistIds?.[0]);
  return artist ? artistPhoto(artist) : "";
}

export function artistNames(item) {
  return (item.artistIds || []).map((id) => creators.find((creator) => creator.id === id)?.name).filter(Boolean);
}

// Brand collaborations and case studies. Seeded only with work already public on the site;
// results stay empty until an admin enters real ones.
export const videoRoot = "https://video.squarespace-cdn.com/content/v1/69b03f3c09081c159fdb0d4a";

export const seedCollaborations = [
  {
    id: "krazy-garlic",
    brand: "Krazy Garlic",
    title: "Toni and Alex Gonzaga for Krazy Garlic",
    date: "",
    artistIds: ["c30", "c33"],
    summary: "Sisters Toni and Alex Gonzaga each filmed a campaign video for the Krazy Garlic restaurant chain.",
    did: ["Two campaign videos, one per artist", "Short-form video for social"],
    results: [],
    videos: ["ee6fd02c-218b-422c-957b-c750619be812", "d6402a55-63ca-4be5-b7b3-1544c47ab0c4"],
    image: "",
    link: "",
    published: true,
  },
  {
    id: "red-lotus",
    brand: "Red Lotus",
    title: "Ivana Alawi for Red Lotus",
    date: "",
    artistIds: ["c31"],
    summary: "Ivana Alawi fronted a campaign video for Red Lotus.",
    did: ["Campaign video", "Short-form video for social"],
    results: [],
    videos: ["2f542e0e-ad40-4f3a-8068-84c532805a94"],
    image: "",
    link: "",
    published: true,
  },
  {
    id: "crocs",
    brand: "Crocs",
    title: "Sharlene San Pedro for Crocs",
    date: "",
    artistIds: ["c29"],
    summary: "Sharlene San Pedro made a fashion and lifestyle video for Crocs.",
    did: ["Campaign video", "Fashion and lifestyle content"],
    results: [],
    videos: ["310ce396-9011-4ed4-9b07-dd29f0d5d298"],
    image: "",
    link: "",
    published: true,
  },
  {
    id: "glamfix",
    brand: "Glamfix PH",
    title: "sabbyandsophia for Glamfix PH",
    date: "",
    artistIds: ["c28"],
    summary: "Beauty duo sabbyandsophia made a glam video for Glamfix PH.",
    did: ["Campaign video", "Beauty content"],
    results: [],
    videos: ["d8c37823-b489-47aa-bfad-9bdc4ddcf008"],
    image: "",
    link: "",
    published: true,
  },
  {
    id: "siklab",
    brand: "Siklab",
    title: "Julia Montes surprises fans at Siklab",
    date: "",
    artistIds: ["c35"],
    summary: "Julia Montes surprised her fans as they ate Filipino food at Siklab.",
    did: ["In-store fan meet", "Food content"],
    results: [],
    videos: [],
    image: "/news/julia-siklab.jpg",
    link: "",
    published: true,
  },
  {
    id: "beautycon-2025",
    brand: "Beautycon Manila",
    title: "Andrea So performs at Beautycon Manila 2025",
    date: "2025-08",
    artistIds: ["c34"],
    summary: "TikTok star Andrea So performed on stage at Beautycon Manila 2025, held at the SMX Convention Center from August 28 to 31.",
    did: ["Live performance", "Event appearance"],
    results: [],
    videos: [],
    image: "/news/andrea-beautycon.jpg",
    link: "https://garage.com.ph/2025/08/26/beautycon-2025-160-brands-exclusive-launches-and-favorite-stars/",
    published: true,
  },
  {
    id: "new-moon",
    brand: "New Moon",
    title: "Criza Taa for New Moon",
    date: "",
    artistIds: ["c32"],
    summary: "Criza Taa made lifestyle content for New Moon.",
    did: ["Lifestyle content"],
    results: [],
    videos: [],
    image: "",
    link: "",
    published: true,
  },
  {
    id: "shopee",
    brand: "Shopee",
    title: "Shopee data and VIP campaigns",
    date: "",
    artistIds: [],
    summary: "KYNX creators post TikTok videos for Shopee’s Pinakamurang Data, Shopee VIP and VIP+ programs.",
    did: ["TikTok videos from KYNX creators", "Pinakamurang Data, Shopee VIP and VIP+ programs"],
    results: [],
    videos: [],
    image: "",
    link: "",
    published: true,
  },
];

const storageKey = "kynx-collabs-v1";

let count = 0;
export function blankCollaboration() {
  count += 1;
  return { id: `x${Date.now().toString(36)}${count}`, brand: "", title: "", date: "", artistIds: [], summary: "", did: [], results: [], videos: [], image: "", link: "", published: true };
}

export function useCollaborations() {
  const [items, setItems] = useState(seedCollaborations);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) || "null");
      if (Array.isArray(saved)) setItems(saved);
    } catch {
      /* keep the seed */
    }
    setReady(true);
  }, []);

  function persist(next) {
    try {
      localStorage.setItem(storageKey, JSON.stringify(next));
    } catch {
      return false;
    }
    setItems(next);
    return true;
  }

  return {
    ready,
    items,
    save: (item) => persist(items.some((it) => it.id === item.id) ? items.map((it) => (it.id === item.id ? item : it)) : [item, ...items]),
    remove: (id) => persist(items.filter((it) => it.id !== id)),
    move: (id, step) => {
      const i = items.findIndex((it) => it.id === id);
      const j = i + step;
      if (i < 0 || j < 0 || j >= items.length) return false;
      const next = items.slice();
      [next[i], next[j]] = [next[j], next[i]];
      return persist(next);
    },
    reset: () => persist(seedCollaborations),
  };
}
