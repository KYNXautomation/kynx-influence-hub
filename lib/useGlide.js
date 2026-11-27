"use client";

import { useEffect } from "react";

// Glides a scrollable row on its own at pxPerSecond, pausing while the mouse or keyboard focus is on it.
// The row's content must be shown twice inside `track`, so wrapping at half the width is invisible.
export function useGlide(row, track, pxPerSecond = 30) {
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
  }, [row, track, pxPerSecond]);
}
