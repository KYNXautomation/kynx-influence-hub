"use client";

import { useState } from "react";
import Link from "next/link";
import { artistPath, artistPhoto } from "../lib/showcase";
import { useShowcase } from "../lib/useShowcase";

const pageSize = 8;
function initials(name) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function ArtistFace({ creator }) {
  const photo = artistPhoto(creator);
  if (!photo) {
    return <div className="artist-fallback" aria-hidden="true">{initials(creator.name)}</div>;
  }
  return <img src={photo} alt="" style={creator.focus ? { objectPosition: creator.focus } : undefined} />;
}

export function BrandArtists() {
  const [niche, setNiche] = useState("All");
  const [page, setPage] = useState(1);
  const { list: roster } = useShowcase();
  const niches = ["All", ...new Set(roster.map((creator) => creator.niche))];
  const filtered = roster.filter((creator) => niche === "All" || creator.niche === niche);
  const pages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const current = Math.min(page, pages);
  const visible = filtered.slice((current - 1) * pageSize, current * pageSize);

  return (
    <section className="artist-showcase" aria-label="Artists">
      <div className="artist-filter-row">
        <div className="artist-filters" role="tablist" aria-label="Artist categories">
          {niches.map((name) => (
            <button key={name} type="button" role="tab" aria-selected={name === niche} className={name === niche ? "active" : undefined} onClick={() => { setNiche(name); setPage(1); }}>
              {name}
            </button>
          ))}
        </div>
      </div>
      <div className="artist-grid">
        {visible.map((creator) => (
          <Link key={creator.id} className="artist-card" href={artistPath(creator)}>
            <ArtistFace creator={creator} />
            <span className="artist-label">
              <span className="artist-name">{creator.name}</span>
            </span>
          </Link>
        ))}
      </div>
      <nav className="artist-pages" aria-label="Pagination">
        <button type="button" disabled={current === 1} onClick={() => setPage(current - 1)}>Previous</button>
        {Array.from({ length: pages }, (_, index) => (
          <button key={index + 1} type="button" aria-current={current === index + 1 ? "page" : undefined} onClick={() => setPage(index + 1)}>{index + 1}</button>
        ))}
        <button type="button" disabled={current === pages} onClick={() => setPage(current + 1)}>Next</button>
      </nav>
    </section>
  );
}
