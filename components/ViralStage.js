"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { formatNumber } from "../lib/format";
import { useShowcase } from "../lib/useShowcase";
import { artistPhoto } from "../lib/showcase";

const videoRoot = "https://video.squarespace-cdn.com/content/v1/69b03f3c09081c159fdb0d4a";
const featuredIds = ["c31", "c30", "c33", "c29", "c28"];

function posterFor(creator) {
  return artistPhoto(creator);
}

function StageFilm({ src, poster }) {
  const ref = useRef(null);

  useEffect(() => {
    const video = ref.current;
    if (!video || !src) return undefined;
    let hls;
    let cancelled = false;
    const play = () => {
      video.play().catch(() => {});
    };

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

    return () => {
      cancelled = true;
      if (hls) hls.destroy();
    };
  }, [src]);

  return <video ref={ref} poster={poster} muted playsInline loop preload="metadata" />;
}

export function ViralStage() {
  const { list } = useShowcase();
  const slides = featuredIds
    .map((id) => list.find((creator) => creator.id === id))
    .filter((creator) => creator && creator.videoId);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = slides.length;
  const current = slides[index] || null;
  const previous = count ? slides[(index - 1 + count) % count] : null;
  const next = count ? slides[(index + 1) % count] : null;

  useEffect(() => {
    if (paused || count < 2) return undefined;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;
    const timer = window.setInterval(() => setIndex((value) => (value + 1) % count), 7000);
    return () => window.clearInterval(timer);
  }, [paused, count]);

  if (!current) return null;

  function step(direction) {
    setIndex((value) => (value + direction + count) % count);
  }

  return (
    <section
      className="viral-stage"
      aria-roledescription="carousel"
      aria-label="Creator films"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="viral-row">
        <button className="viral-peek" type="button" onClick={() => step(-1)} aria-label={`Show ${previous.name}`}>
          {previous && posterFor(previous) ? <img src={posterFor(previous)} alt="" /> : null}
        </button>
        <article className="viral-main">
          {posterFor(current) ? <img className="viral-blur" src={posterFor(current)} alt="" /> : null}
          <StageFilm key={current.id} src={`${videoRoot}/${current.videoId}/playlist.m3u8`} poster={posterFor(current)} />
          <Link className="viral-caption" href={`/artists/${current.id}`}>
            <h2>{current.name}</h2>
            {current.brand ? <p>For {current.brand}</p> : null}
            <p>KYNX campaign film</p>
            <p className="viral-views">{current.views > 0 ? formatNumber(current.views) : "—"} generated views</p>
          </Link>
          <button className="viral-arrow prev" type="button" onClick={() => step(-1)} aria-label="Previous film">‹</button>
          <button className="viral-arrow next" type="button" onClick={() => step(1)} aria-label="Next film">›</button>
        </article>
        <button className="viral-peek" type="button" onClick={() => step(1)} aria-label={`Show ${next.name}`}>
          {next && posterFor(next) ? <img src={posterFor(next)} alt="" /> : null}
        </button>
      </div>
      <div className="viral-dots">
        {slides.map((creator, dot) => (
          <button
            key={creator.id}
            type="button"
            aria-label={creator.name}
            aria-current={dot === index ? "true" : undefined}
            onClick={() => setIndex(dot)}
          />
        ))}
      </div>
    </section>
  );
}
