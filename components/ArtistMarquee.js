"use client";

import { useState } from "react";
import Link from "next/link";
import { creators } from "../lib/model";
import { artistPath, artistPhoto } from "../lib/showcase";

// The KYNX exclusive creators, sliding past in a loop. Pauses on hover, on keyboard focus, and with the Pause button.
const exclusives = creators.filter((creator) => creator.manager && artistPhoto(creator));

export function ArtistMarquee() {
  const [paused, setPaused] = useState(false);
  return (
    <section className={paused ? "marquee-wrap paused" : "marquee-wrap"} aria-label="KYNX exclusive creators">
      <button className="marquee-toggle" type="button" onClick={() => setPaused(!paused)} aria-pressed={paused}>
        {paused ? "▶ Play" : "❚❚ Pause"}
      </button>
      <div className="marquee">
      <div className="marquee-track">
        {/* The list is shown twice so the loop has no gap; the copy is hidden from screen readers. */}
        {[0, 1].map((copy) => (
          <ul key={copy} className="marquee-list" aria-hidden={copy ? "true" : undefined}>
            {exclusives.map((creator) => (
              <li key={creator.id}>
                <Link href={artistPath(creator)} tabIndex={copy ? -1 : undefined}>
                  <img src={artistPhoto(creator)} alt="" loading="lazy" style={creator.focus ? { objectPosition: creator.focus } : undefined} />
                  <span>{creator.name}<small>{creator.niche}</small></span>
                </Link>
              </li>
            ))}
          </ul>
        ))}
      </div>
      </div>
    </section>
  );
}
