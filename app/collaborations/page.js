"use client";

import { useState } from "react";
import { PublicFrame } from "../../components/PublicFrame";
import { PublicFooter } from "../../components/PublicFooter";
import { useCollaborations } from "../../lib/collaborations";
import { CollabGrid } from "../../components/CollabGrid";

export default function CollaborationsPage() {
  const { items, ready } = useCollaborations();
  const [brand, setBrand] = useState("All");
  const live = items.filter((item) => item.published);
  const brands = ["All", ...new Set(live.map((item) => item.brand).filter(Boolean))];
  const shown = live.filter((item) => brand === "All" || item.brand === brand);

  return (
    <PublicFrame>
      <main className="landing news-page collab-page">
        <div className="news-rule">
          <h1>Collaborations</h1>
          <div className="news-filters" role="tablist" aria-label="Brand">
            {brands.map((name) => (
              <button key={name} type="button" role="tab" aria-selected={brand === name} className={brand === name ? "active" : undefined} onClick={() => setBrand(name)}>
                {name}
              </button>
            ))}
          </div>
        </div>
        <p className="lede collab-lede">Brands we have worked with, the KYNX artists on each campaign, and what we made.</p>
        {ready ? <CollabGrid items={shown} /> : null}
      </main>
      <PublicFooter />
    </PublicFrame>
  );
}
