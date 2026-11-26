"use client";

import Link from "next/link";
import { creators } from "../lib/model";
import { artistPhoto } from "../lib/showcase";
import { useShowcase } from "../lib/useShowcase";
import { WorkVideo } from "./WorkVideo";
import { Icon, SocialLinks } from "./SocialLinks";

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
        <Link href="/artists">Back to artists</Link>
      </main>
    );
  }

  const tags = [creator.niche, creator.location].filter(Boolean);
  const [firstName, ...rest] = creator.name.split(" ");
  const points = creator.points || [];
  const photo = artistPhoto(creator);
  const video = creator.videoId
    ? { src: `${videoRoot}/${creator.videoId}/playlist.m3u8`, poster: photo }
    : null;

  return (
    <main className="artist-profile editorial">
      <Link className="ed-back" href="/artists">← All artists</Link>
      <p className="ed-role">{tags.join(" · ")}</p>
      <div className="ed-row">
        <div className="ed-photo">
          {!photo ? (
            <div className="artist-fallback tall">{initials(creator.name)}</div>
          ) : (
            <img src={photo} alt={creator.name} style={creator.focus ? { objectPosition: creator.focus } : undefined} />
          )}
        </div>
        <div className="ed-info">
          <h1 className="ed-name">{firstName}{rest.length ? <><br /><span>{rest.join(" ")}</span></> : null}</h1>
          <div className="ed-details">
            <Link className="ed-cta" href="/contact" aria-label={`Work with ${creator.name}`}><Icon name="arrow" size={22} /></Link>
            {creator.bio ? <p className="ed-bio">{creator.bio}</p> : null}
          </div>
          <SocialLinks creator={creator} className="social-links ed-social" />
        </div>
      </div>
      {photo && !creator.photo && creator.photoCredit ? (
        <p className="photo-credit">
          Photo: <a href={creator.photoCredit.href} target="_blank" rel="noreferrer">{creator.photoCredit.text}</a>
        </p>
      ) : null}
      <div className="ed-more">
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
      </div>
    </main>
  );
}
