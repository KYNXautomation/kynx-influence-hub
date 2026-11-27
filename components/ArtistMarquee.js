"use client";

import { useRef } from "react";
import Link from "next/link";
import { creators } from "../lib/model";
import { artistPath, artistPhoto } from "../lib/showcase";
import { useGlide } from "../lib/useGlide";

// The KYNX exclusive creators in a scrollable row that glides on its own (about 30px a second).
// Visitors can scroll or drag it with the scrollbar; it pauses while the mouse or keyboard focus is on it.
const exclusives = creators.filter((creator) => creator.manager && artistPhoto(creator));

export function ArtistMarquee() {
  const row = useRef(null);
  const track = useRef(null);
  useGlide(row, track);

  return (
    <section className="marquee" aria-label="KYNX exclusive creators" ref={row}>
      <div className="marquee-track" ref={track}>
        {/* The list is shown twice so the loop has no gap; the copy is hidden from screen readers. */}
        {[0, 1].map((copy) => (
          <ul key={copy} className="marquee-list" aria-hidden={copy ? "true" : undefined}>
            {exclusives.map((creator) => (
              <li key={creator.id}>
                <Link href={artistPath(creator)} tabIndex={copy ? -1 : undefined}>
                  <img src={artistPhoto(creator)} alt="" draggable="false" style={creator.focus ? { objectPosition: creator.focus } : undefined} />
                  <span>{creator.name}<small>{creator.niche}</small></span>
                </Link>
              </li>
            ))}
          </ul>
        ))}
      </div>
    </section>
  );
}
