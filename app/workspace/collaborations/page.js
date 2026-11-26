"use client";

import { useState } from "react";
import Link from "next/link";
import { Workspace } from "../../../components/Workspace";
import { creators } from "../../../lib/model";
import { blankCollaboration, useCollaborations } from "../../../lib/collaborations";

// Artists that can be tagged: the exclusives and the campaign-work artists with profiles.
const taggable = creators.filter((creator) => creator.manager || creator.portrait);
const lines = (text) => text.split("\n").map((line) => line.trim()).filter(Boolean);

function CollabForm({ item, onSave, onCancel }) {
  const [draft, setDraft] = useState({ ...item, did: item.did.join("\n"), results: item.results.join("\n"), videos: item.videos.join("\n") });
  const [error, setError] = useState("");
  const set = (key, value) => setDraft((current) => ({ ...current, [key]: value }));

  function toggleArtist(id) {
    set("artistIds", draft.artistIds.includes(id) ? draft.artistIds.filter((x) => x !== id) : [...draft.artistIds, id]);
  }

  function submit(event) {
    event.preventDefault();
    if (!draft.brand.trim() || !draft.title.trim()) {
      setError("Give it a brand and a title.");
      return;
    }
    for (const url of [draft.image, draft.link].filter(Boolean)) {
      if (!/^(https?:\/\/|\/)/.test(url.trim())) {
        setError("Links and images must start with https:// or /.");
        return;
      }
    }
    onSave({
      ...draft,
      brand: draft.brand.trim(),
      title: draft.title.trim(),
      summary: draft.summary.trim(),
      image: draft.image.trim(),
      link: draft.link.trim(),
      did: lines(draft.did),
      results: lines(draft.results),
      // Accept a full Squarespace video link or just its id.
      videos: lines(draft.videos).map((v) => (v.match(/[0-9a-f]{8}-[0-9a-f-]{27}/i) || [v])[0]),
    });
  }

  return (
    <form className="roster-fields" onSubmit={submit}>
      <label>Brand<input required value={draft.brand} onChange={(e) => set("brand", e.target.value)} /></label>
      <label>Title<input required value={draft.title} placeholder="Artist for Brand" onChange={(e) => set("title", e.target.value)} /></label>
      <label>Date<input value={draft.date} placeholder="2026-08" onChange={(e) => set("date", e.target.value)} /></label>
      <label className="talent-check"><input type="checkbox" checked={draft.published} onChange={(e) => set("published", e.target.checked)} /> Show on the public page</label>
      <label className="wide">Summary<textarea value={draft.summary} onChange={(e) => set("summary", e.target.value)} /></label>
      <label className="wide">What we made (one per line)<textarea value={draft.did} onChange={(e) => set("did", e.target.value)} /></label>
      <label className="wide">Results (one per line; only real, confirmed numbers)<textarea value={draft.results} placeholder="1.2M views across 4 TikTok videos" onChange={(e) => set("results", e.target.value)} /></label>
      <label className="wide">Video IDs or links (one per line)<textarea value={draft.videos} onChange={(e) => set("videos", e.target.value)} /></label>
      <label>Cover image link<input value={draft.image} placeholder="https://… (blank uses the first artist’s photo)" onChange={(e) => set("image", e.target.value)} /></label>
      <label>Press or source link<input value={draft.link} placeholder="https://…" onChange={(e) => set("link", e.target.value)} /></label>
      <fieldset className="wide collab-pick">
        <legend>Artists</legend>
        <div className="categories">
          {taggable.map((artist) => (
            <label key={artist.id}><input type="checkbox" checked={draft.artistIds.includes(artist.id)} onChange={() => toggleArtist(artist.id)} />{artist.name}</label>
          ))}
        </div>
      </fieldset>
      {error ? <p className="wide sheet-error">{error}</p> : null}
      <div className="wide button-row" style={{ justifyContent: "flex-start" }}>
        <button className="apply" type="submit">Save collaboration</button>
        <button className="ghost" type="button" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}

export default function CollaborationsAdmin() {
  const { items, save, remove, move, reset } = useCollaborations();
  const [editing, setEditing] = useState("");
  const [adding, setAdding] = useState(null);
  const [notice, setNotice] = useState("");

  function done(item) {
    setNotice(save(item) ? `${item.title} saved in this browser.` : "The browser is out of room, so this was not saved.");
    setEditing("");
    setAdding(null);
  }

  function del(item) {
    if (!window.confirm(`Delete “${item.title}”?`)) return;
    remove(item.id);
    setNotice(`${item.title} deleted.`);
  }

  return (
    <Workspace active="/workspace/collaborations">
      <header className="page-head">
        <p className="eyebrow">Admin · <Link className="text-link" href="/collaborations">See the public page</Link></p>
        <h1>Collaborations and case studies</h1>
        <p className="lede">Brand work shown on the public Collaborations page. Add results only when they are real and the brand allows it. Saved in this browser.</p>
      </header>
      <div className="button-row roster-add">
        <button className="apply" type="button" onClick={() => { setAdding(blankCollaboration()); setEditing(""); }}>Add collaboration</button>
        <button className="ghost" type="button" onClick={() => { if (window.confirm("Put back the starting list? Your changes are lost.")) reset(); }}>Reset to starting list</button>
      </div>
      {notice ? <p className="notice">{notice}</p> : null}
      {adding ? <section className="panel"><h3>New collaboration</h3><CollabForm item={adding} onSave={done} onCancel={() => setAdding(null)} /></section> : null}
      <div className="stack">
        {items.map((item, index) => (
          <article key={item.id} className="panel">
            <div className="roster-head">
              <div>
                <b>{item.title}</b>
                <p className="meta">{item.brand}{item.date ? ` · ${item.date}` : ""} · {item.published ? "Public" : "Hidden"} · {item.results.length ? `${item.results.length} results` : "No results yet"}</p>
              </div>
              <div className="button-row">
                <button className="ghost" type="button" disabled={index === 0} onClick={() => move(item.id, -1)}>Move up</button>
                <button className="ghost" type="button" disabled={index === items.length - 1} onClick={() => move(item.id, 1)}>Move down</button>
                <button className="save" type="button" onClick={() => setEditing(editing === item.id ? "" : item.id)}>{editing === item.id ? "Close" : "Edit"}</button>
                <button className="ghost talent-delete" type="button" onClick={() => del(item)}>Delete</button>
              </div>
            </div>
            {editing === item.id ? <CollabForm item={item} onSave={done} onCancel={() => setEditing("")} /> : null}
          </article>
        ))}
      </div>
    </Workspace>
  );
}
