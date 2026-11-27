"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { PublicFrame } from "../../../components/PublicFrame";
import { PublicFooter } from "../../../components/PublicFooter";
import { WorkVideo } from "../../../components/WorkVideo";
import { creators } from "../../../lib/model";
import { artistPath, artistPhoto } from "../../../lib/showcase";
import { coverFor, useCollaborations, videoRoot } from "../../../lib/collaborations";

function CaseStudy() {
  const id = useSearchParams().get("id");
  const { items, ready } = useCollaborations();
  const item = items.find((entry) => entry.id === id && entry.published);
  if (!ready) return <main className="landing" />;
  if (!item) {
    return (
      <main className="landing">
        <p className="empty">That collaboration is not on the list.</p>
        <Link className="text-link" href="/collaborations">See all our works</Link>
      </main>
    );
  }
  const artists = item.artistIds.map((artistId) => creators.find((creator) => creator.id === artistId)).filter(Boolean);
  const cover = coverFor(item);

  return (
    <main className="landing collab-case">
      <Link className="text-link" href="/collaborations">← All our works</Link>
      <header className="collab-head">
        <p className="eyebrow">{item.brand}{item.date ? ` · ${item.date}` : ""}</p>
        <h1>{item.title}</h1>
        {item.summary ? <p className="lede">{item.summary}</p> : null}
      </header>

      <div className="collab-body">
        <div className="collab-media">
          {item.videos.length ? item.videos.map((videoId, index) => (
            <WorkVideo key={videoId} src={`${videoRoot}/${videoId}/playlist.m3u8`} poster={(artists[index] && artistPhoto(artists[index])) || cover} />
          )) : cover ? <img className="collab-cover" src={cover} alt={item.title} /> : null}
        </div>
        <aside className="collab-facts">
          {artists.length ? (
            <section>
              <h2>Artists</h2>
              <ul className="collab-artists">
                {artists.map((artist) => (
                  <li key={artist.id}>
                    <Link href={artistPath(artist)}>
                      {artistPhoto(artist) ? <img src={artistPhoto(artist)} alt="" /> : null}
                      <span>{artist.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
          {item.did.length ? (
            <section>
              <h2>What we made</h2>
              <ul>{item.did.map((line) => <li key={line}>{line}</li>)}</ul>
            </section>
          ) : null}
          {item.results.length ? (
            <section>
              <h2>Results</h2>
              <ul className="collab-results">{item.results.map((line) => <li key={line}>{line}</li>)}</ul>
            </section>
          ) : null}
          {item.link ? <a className="ghost" href={item.link} target="_blank" rel="noreferrer">Read the coverage ↗</a> : null}
          <Link className="join" href="/contact">Contact us about a campaign</Link>
        </aside>
      </div>
    </main>
  );
}

export default function CasePage() {
  return (
    <PublicFrame>
      <Suspense fallback={<main className="landing" />}>
        <CaseStudy />
      </Suspense>
      <PublicFooter />
    </PublicFrame>
  );
}
