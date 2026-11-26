"use client";

import { useState } from "react";
import Link from "next/link";
import { PublicFrame } from "../../components/PublicFrame";
import { PublicFooter } from "../../components/PublicFooter";
import { artistNames, coverFor, useCollaborations } from "../../lib/collaborations";

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
        {!ready ? null : shown.length === 0 ? <p className="empty">No collaborations here yet.</p> : (
          <div className="news-grid">
            {shown.map((item) => {
              const cover = coverFor(item);
              const names = artistNames(item);
              return (
                <Link key={item.id} className="news-card" href={`/collaborations/case/?id=${encodeURIComponent(item.id)}`}>
                  {cover ? <img src={cover} alt="" style={{ objectPosition: "center 30%" }} /> : (
                    <div className="news-tile" aria-hidden="true"><span>{item.brand}</span><small>Case study</small></div>
                  )}
                  <span className="news-band">
                    <span className="news-title">{item.title}</span>
                    <span className="news-sub">{[item.brand, names.join(", ")].filter(Boolean).join(" · ")}</span>
                  </span>
                </Link>
              );
            })}
          </div>
        )}
      </main>
      <PublicFooter />
    </PublicFrame>
  );
}
