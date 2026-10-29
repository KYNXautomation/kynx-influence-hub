"use client";

import { useEffect, useState } from "react";
import { seedTalents } from "./talents";

const storageKey = "kynx-talents-v1";

export function useTalents() {
  const [talents, setTalents] = useState(seedTalents);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) || "null");
      if (Array.isArray(saved)) setTalents(saved);
    } catch {
      /* keep the starting roster */
    }
    setReady(true);
  }, []);

  function persist(next) {
    setTalents(next);
    try {
      localStorage.setItem(storageKey, JSON.stringify(next));
      return true;
    } catch {
      return false;
    }
  }

  return {
    ready,
    talents,
    saveTalent(fields) {
      const exists = talents.some((item) => item.id === fields.id);
      return persist(exists ? talents.map((item) => (item.id === fields.id ? { ...item, ...fields } : item)) : [...talents, fields]);
    },
    removeTalent(id) {
      return persist(talents.filter((item) => item.id !== id));
    },
    reset() {
      return persist(seedTalents());
    },
  };
}
