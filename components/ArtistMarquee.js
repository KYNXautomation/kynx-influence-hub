"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { creators } from "../lib/model";
import { artistPath, artistPhoto } from "../lib/showcase";

// The KYNX exclusive creators as a slideshow: every 3 seconds the row slides over by one artist.
// Pauses on hover, on keyboard focus, and with the Pause button.
const exclusives = creators.filter((creator) => creator.manager && artistPhoto(creator));
const everyMs = 3000;
const gap = 18;

export function ArtistMarquee() {
  const [paused, setPaused] = useState(false);
  const [hold, setHold] = useState(false);
  const [index, setIndex] = useState(0);
  const [animate, setAnimate] = useState(true);
  const [step, setStep] = useState(0);
  const track = useRef(null);

  useEffect(() => {
    const measure = () => setStep((track.current?.querySelector("li")?.getBoundingClientRect().width || 0) + gap);
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  useEffect(() => {
    if (paused || hold) return undefined;
    const timer = setInterval(() => {
      setAnimate(true);
      setIndex((current) => current + 1);
    }, everyMs);
    return () => clearInterval(timer);
  }, [paused, hold]);

  // After sliding into the second copy of the list, jump back to the same picture in the first copy.
  function wrap() {
    if (index < exclusives.length) return;
    setAnimate(false);
    setIndex(index - exclusives.length);
  }

  return (
    <section className={paused ? "marquee-wrap paused" : "marquee-wrap"} aria-label="KYNX exclusive creators">
      <button className="marquee-toggle" type="button" onClick={() => setPaused(!paused)} aria-pressed={paused}>
        {paused ? "▶ Play" : "❚❚ Pause"}
      </button>
      <div className="marquee" onMouseEnter={() => setHold(true)} onMouseLeave={() => setHold(false)} onFocus={() => setHold(true)} onBlur={() => setHold(false)}>
        <div
          ref={track}
          className="marquee-track"
          style={{ transform: `translateX(-${index * step}px)`, transition: animate ? "transform 0.8s var(--ease)" : "none" }}
          onTransitionEnd={wrap}
        >
          {/* The list is shown twice so the loop has no gap; the copy is hidden from screen readers. */}
          {[0, 1].map((copy) => (
            <ul key={copy} className="marquee-list" aria-hidden={copy ? "true" : undefined}>
              {exclusives.map((creator) => (
                <li key={creator.id}>
                  <Link href={artistPath(creator)} tabIndex={copy ? -1 : undefined}>
                    <img src={artistPhoto(creator)} alt="" style={creator.focus ? { objectPosition: creator.focus } : undefined} />
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
