"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { formatNumber } from "../lib/format";
import { useShowcase } from "../lib/useShowcase";
import { artistPhoto } from "../lib/showcase";
import { creators } from "../lib/model";
import { useGlide } from "../lib/useGlide";

const videoRoot = "https://video.squarespace-cdn.com/content/v1/69b03f3c09081c159fdb0d4a";
const featuredIds = ["c31", "c30", "c33", "c29", "c28"];

// Streams and plays only while the card is on screen, so the gliding row never runs every film at once.
function StageFilm({ src, poster }) {
  const ref = useRef(null);

  useEffect(() => {
    const video = ref.current;
    if (!video || !src) return undefined;
    let hls;
    let cancelled = false;
    let started = false;
    const play = () => {
      video.play().catch(() => {});
    };
    const start = () => {
      if (started) return play();
      started = true;
      import("hls.js").then(({ default: Hls }) => {
        if (cancelled) return;
        if (Hls.isSupported()) {
          hls = new Hls();
          hls.loadSource(src);
          hls.attachMedia(video);
          hls.on(Hls.Events.MANIFEST_PARSED, play);
          return;
        }
        if (video.canPlayType("application/vnd.apple.mpegurl")) {
          video.src = src;
          video.addEventListener("loadedmetadata", play, { once: true });
        }
      });
    };
    const seen = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) start();
      else video.pause();
    });
    seen.observe(video);

    return () => {
      cancelled = true;
      seen.disconnect();
      if (hls) hls.destroy();
    };
  }, [src]);

  return <video ref={ref} poster={poster} muted playsInline loop preload="none" />;
}

// The KYNX campaign films in a scrollable row that glides on its own, like the artist slideshow.
export function ViralStage() {
  const { list } = useShowcase();
  const row = useRef(null);
  const track = useRef(null);
  useGlide(row, track);
  const slides = featuredIds
    // Campaign works, not the exclusive line-up, so fall back to every creator.
    .map((id) => list.find((creator) => creator.id === id) || creators.find((creator) => creator.id === id))
    .filter((creator) => creator && creator.videoId);

  if (!slides.length) return null;

  return (
    <section className="marquee film-marquee" aria-label="KYNX campaign films" ref={row}>
      <div className="marquee-track" ref={track}>
        {/* The list is shown twice so the loop has no gap; the copy is hidden from screen readers. */}
        {[0, 1].map((copy) => (
          <ul key={copy} className="marquee-list film-list" aria-hidden={copy ? "true" : undefined}>
            {slides.map((creator) => (
              <li key={creator.id}>
                <Link href={`/artists/${creator.id}`} tabIndex={copy ? -1 : undefined}>
                  <img className="film-blur" src={artistPhoto(creator)} alt="" draggable="false" />
                  <StageFilm src={`${videoRoot}/${creator.videoId}/playlist.m3u8`} poster={artistPhoto(creator)} />
                  <div className="film-caption">
                    <h3>{creator.name}</h3>
                    {creator.brand ? <p>For {creator.brand}</p> : null}
                    <p>KYNX campaign film</p>
                    <p className="film-views">{creator.views > 0 ? formatNumber(creator.views) : "—"} generated views</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        ))}
      </div>
    </section>
  );
}
