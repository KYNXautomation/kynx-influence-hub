"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { creators } from "../lib/model";
import { artistPath, artistPhoto } from "../lib/showcase";

// The KYNX exclusive creators in a scrollable row that glides on its own (about 30px a second).
// Visitors can scroll or drag it with the scrollbar; it pauses while the mouse or keyboard focus is on it.
const exclusives = creators.filter((creator) => creator.manager && artistPhoto(creator));
const pxPerSecond = 30;

export function ArtistMarquee() {
  const row = useRef(null);
  const track = useRef(null);

  useEffect(() => {
    const el = row.current;
    const inner = track.current;
    if (!el || !inner) return undefined;
    let hold = false;
    let position = el.scrollLeft;
    let last = performance.now();
    let frame;
    const tick = (now) => {
      const seconds = Math.min(0.1, (now - last) / 1000);
      last = now;
      const half = el.scrollWidth / 2;
      if (hold || half <= el.clientWidth) {
        position = el.scrollLeft; // follow any manual scrolling
        inner.style.transform = "";
      } else {
        // Browsers round scrollLeft to whole pixels, which looks stiff at slow speeds: scroll the whole
        // pixels (so the scrollbar follows) and shift the row by the fraction for sub-pixel smoothness.
        // The list is shown twice, so wrapping at half is invisible.
        position += pxPerSecond * seconds;
        if (position >= half) position -= half;
        const whole = Math.floor(position);
        if (el.scrollLeft !== whole) el.scrollLeft = whole;
        inner.style.transform = `translate3d(${-(position - whole)}px, 0, 0)`;
      }
      frame = requestAnimationFrame(tick);
    };
    const stop = () => { hold = true; };
    const go = () => { hold = false; };
    el.addEventListener("pointerenter", stop);
    el.addEventListener("pointerleave", go);
    el.addEventListener("focusin", stop);
    el.addEventListener("focusout", go);
    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      el.removeEventListener("pointerenter", stop);
      el.removeEventListener("pointerleave", go);
      el.removeEventListener("focusin", stop);
      el.removeEventListener("focusout", go);
    };
  }, []);

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
