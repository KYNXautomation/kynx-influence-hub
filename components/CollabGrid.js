"use client";

import Link from "next/link";
import { artistNames, coverFor } from "../lib/collaborations";

// Collaboration cards linking to each case study. Used on Collaborations and Brands.
export function CollabGrid({ items }) {
  if (!items.length) return <p className="empty">No collaborations here yet.</p>;
  return (
    <div className="news-grid">
      {items.map((item) => {
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
  );
}
