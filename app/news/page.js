"use client";

import { useState } from "react";
import Link from "next/link";
import { PublicFrame } from "../../components/PublicFrame";
import { PublicFooter } from "../../components/PublicFooter";
import { creators } from "../../lib/model";
import { basePath } from "../../lib/paths";
import { artistPath, artistPhoto } from "../../lib/showcase";
import { formatNewsDate, news, newsKinds } from "../../lib/news";

const perPage = 10;

function CardArt({ item, artist }) {
  const [thumbFailed, setThumbFailed] = useState(false);
  if (item.image) return <img src={`${basePath}${item.image}`} alt="" />;
  if (item.thumb && !thumbFailed) {
    return <img src={item.thumb} alt="" loading="lazy" referrerPolicy="no-referrer" onError={() => setThumbFailed(true)} />;
  }
  const photo = artist ? artistPhoto(artist) : "";
  if (photo) return <img src={photo} alt="" style={{ objectPosition: "center 30%" }} />;
  // Brand news with no photo of our own gets a branded tile.
  return (
    <div className="news-tile" aria-hidden="true">
      <span>{item.brand || item.source}</span>
      <small>{item.source}</small>
    </div>
  );
}

function NewsCard({ item }) {
  const artist = item.artistId ? creators.find((creator) => creator.id === item.artistId) : null;
  const date = formatNewsDate(item.date);
  const inner = (
    <>
      <CardArt item={item} artist={artist} />
      <span className="news-band">
        <span className="news-title">{item.title}</span>
        <span className="news-sub">{[item.source, date].filter(Boolean).join(" · ")}</span>
      </span>
    </>
  );
  if (item.href) {
    return <a className="news-card" href={item.href} target="_blank" rel="noreferrer" title={item.summary}>{inner}</a>;
  }
  if (artist) {
    return <Link className="news-card" href={artistPath(artist)} title={item.summary}>{inner}</Link>;
  }
  return <div className="news-card" title={item.summary}>{inner}</div>;
}

export default function NewsPage() {
  const [kind, setKind] = useState("all");
  const [page, setPage] = useState(1);
  const shown = news.filter((item) => kind === "all" || item.kind === kind);
  const pages = Math.max(1, Math.ceil(shown.length / perPage));
  const current = Math.min(page, pages);
  const slice = shown.slice((current - 1) * perPage, current * perPage);

  function choose(next) {
    setKind(next);
    setPage(1);
  }

  function go(next) {
    setPage(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <PublicFrame>
      <main className="landing news-page">
        <div className="news-rule">
          <h1>News</h1>
          <div className="news-filters" role="tablist" aria-label="News type">
            {newsKinds.map(([id, label]) => (
              <button key={id} type="button" role="tab" aria-selected={kind === id} className={kind === id ? "active" : undefined} onClick={() => choose(id)}>
                {label}
              </button>
            ))}
          </div>
        </div>
        {slice.length === 0 ? <p className="empty">No news here yet.</p> : (
          <div className="news-grid">
            {slice.map((item) => <NewsCard key={item.id} item={item} />)}
          </div>
        )}
        {pages > 1 ? (
          <nav className="news-pages" aria-label="News pages">
            <button type="button" disabled={current === 1} onClick={() => go(current - 1)}>Previous</button>
            {Array.from({ length: pages }, (_, index) => index + 1).map((number) => (
              <button key={number} type="button" aria-current={number === current ? "page" : undefined} onClick={() => go(number)}>{number}</button>
            ))}
            <button type="button" disabled={current === pages} onClick={() => go(current + 1)}>Next →</button>
          </nav>
        ) : null}
      </main>
      <PublicFooter />
    </PublicFrame>
  );
}
