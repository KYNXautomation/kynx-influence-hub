"use client";

import { useEffect, useState } from "react";
import { applyShowcase, isAddedArtist, removedArtists } from "./showcase";

const storageKey = "kynx-showcase-v1";

export function useShowcase() {
  const [saved, setSaved] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const parsed = JSON.parse(localStorage.getItem(storageKey) || "null");
      if (parsed && typeof parsed === "object") setSaved(parsed);
    } catch {
      /* keep the built-in order */
    }
    setReady(true);
  }, []);

  function persist(next) {
    try {
      localStorage.setItem(storageKey, JSON.stringify(next));
    } catch {
      return false;
    }
    setSaved(next);
    return true;
  }

  function move(id, direction) {
    const ids = applyShowcase(saved).map((creator) => creator.id);
    const index = ids.indexOf(id);
    const nextIndex = index + direction;
    if (index < 0 || nextIndex < 0 || nextIndex >= ids.length) return false;
    const order = ids.slice();
    const [item] = order.splice(index, 1);
    order.splice(nextIndex, 0, item);
    return persist({ ...(saved || {}), order });
  }

  function saveCredentials(id, fields) {
    const profiles = { ...(saved?.profiles || {}) };
    profiles[id] = { ...(profiles[id] || {}), ...fields };
    return persist({ ...(saved || {}), profiles });
  }

  // Returns the new id, or "" when the browser is out of room.
  function addArtist(fields) {
    const id = `a${Date.now()}`;
    const added = [...(saved?.added || []), { ...fields, id, showcase: true }];
    return persist({ ...(saved || {}), added }) ? id : "";
  }

  function removeArtist(id) {
    const next = { ...(saved || {}) };
    if (isAddedArtist(id)) {
      next.added = (saved?.added || []).filter((creator) => creator.id !== id);
      if (next.profiles) {
        next.profiles = { ...next.profiles };
        delete next.profiles[id];
      }
    } else {
      next.hidden = [...new Set([...(saved?.hidden || []), id])];
    }
    if (Array.isArray(next.order)) next.order = next.order.filter((item) => item !== id);
    return persist(next);
  }

  function restoreArtist(id) {
    return persist({ ...(saved || {}), hidden: (saved?.hidden || []).filter((item) => item !== id) });
  }

  return { list: applyShowcase(saved), removed: removedArtists(saved), ready, move, saveCredentials, addArtist, removeArtist, restoreArtist };
}
