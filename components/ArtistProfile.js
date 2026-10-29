"use client";

import Link from "next/link";
import { creators } from "../lib/model";
import { artistPhoto } from "../lib/showcase";
import { useShowcase } from "../lib/useShowcase";
import { WorkVideo } from "./WorkVideo";

const videoRoot = "https://video.squarespace-cdn.com/content/v1/69b03f3c09081c159fdb0d4a";

function initials(name) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export function ArtistProfile({ id }) {
  const { list, ready } = useShowcase();
  const creator = list.find((item) => item.id === id) || creators.find((item) => item.id === id);
  if (!creator && !ready) return <main className="artist-profile" />;
  if (!creator) {
    return (
      <main className="artist-profile">
        <p>That creator is not on the roster.</p>
        <Link href="/">Back to artists</Link>
      </main>
    );
  }

  const tags = [creator.niche, creator.location].filter(Boolean);
  const points = creator.points || [];
  const photo = artistPhoto(creator);
  const video = creator.videoId
    ? { src: `${videoRoot}/${creator.videoId}/playlist.m3u8`, poster: photo }
    : null;

  return (
    <main className="artist-profile">
      <div className="artist-photo">
        <Link className="artist-back" href="/" aria-label="Back to artists">←</Link>
        {!photo ? (
          <div className="artist-fallback tall">{initials(creator.name)}</div>
        ) : (
          <img src={photo} alt="" style={creator.focus ? { objectPosition: creator.focus } : undefined} />
        )}
        {photo && !creator.photo && creator.photoCredit ? (
          <p className="photo-credit">
            Photo: <a href={creator.photoCredit.href} target="_blank" rel="noreferrer">{creator.photoCredit.text}</a>
          </p>
        ) : null}
      </div>
      <div className="artist-detail">
        <h1><i />{creator.name}</h1>
        <p className="artist-tags">{tags.join(" | ")}</p>
        {creator.bio ? <p className="artist-bio">{creator.bio}</p> : null}
        {creator.brand || points.length ? (
          <section className="artist-panel" aria-label="Work">
            {creator.brand ? (
              <div>
                <h2>Endorsed</h2>
                <ul><li>{creator.brand}</li></ul>
              </div>
            ) : null}
            {points.length ? (
              <div>
                <h2>Content</h2>
                <ul>{points.map((point) => <li key={point}>{point}</li>)}</ul>
              </div>
            ) : null}
          </section>
        ) : null}
        {video ? (
          <section className="artist-video" aria-label="Campaign video">
            <h2>Campaign</h2>
            <WorkVideo src={video.src} poster={video.poster} />
          </section>
        ) : null}
        {creator.instagram ? (
          <section className="artist-connect">
            <h2>Connect with {creator.name}</h2>
            <a href={creator.instagram} target="_blank" rel="noreferrer">Instagram {creator.handle ? `@${creator.handle}` : ""}</a>
          </section>
        ) : null}
      </div>
    </main>
  );
}
