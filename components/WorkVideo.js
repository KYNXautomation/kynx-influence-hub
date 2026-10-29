"use client";

import { useEffect, useRef } from "react";

export function WorkVideo({ src, poster }) {
  const ref = useRef(null);

  useEffect(() => {
    const video = ref.current;
    if (!video || !src) return undefined;
    let hls;

    let cancelled = false;
    import("hls.js").then(({ default: Hls }) => {
      if (cancelled) return;
      if (Hls.isSupported()) {
        hls = new Hls();
        hls.loadSource(src);
        hls.attachMedia(video);
        return;
      }
      if (video.canPlayType("application/vnd.apple.mpegurl")) video.src = src;
    });

    return () => {
      cancelled = true;
      if (hls) hls.destroy();
    };
  }, [src]);

  return (
    <video
      ref={ref}
      className="work-video"
      poster={poster}
      controls
      playsInline
      preload="none"
    />
  );
}
