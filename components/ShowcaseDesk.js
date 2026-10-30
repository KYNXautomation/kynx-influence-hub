"use client";

import { useState } from "react";
import Link from "next/link";
import { formatFollowers } from "../lib/format";
import { shrinkPhoto } from "../lib/photo";
import { artistPath, artistPhoto, isAddedArtist } from "../lib/showcase";
import { useShowcase } from "../lib/useShowcase";

const blank = { name: "", handle: "", followers: "", niche: "", location: "", brand: "", instagram: "", bio: "", points: "", photo: "" };

function draftFrom(creator) {
  return {
    name: creator.name || "",
    handle: creator.handle || "",
    followers: String(creator.followers ?? ""),
    niche: creator.niche || "",
    location: creator.location || "",
    brand: creator.brand || "",
    instagram: creator.instagram || "",
    bio: creator.bio || "",
    points: (creator.points || []).join(", "),
    photo: creator.photo || "",
  };
}

// Turns the form into saved fields, or returns an error message.
function fieldsFrom(draft) {
  const name = draft.name.trim();
  if (!name) return "Give the artist a name.";
  const followers = draft.followers.trim() === "" ? 0 : Number(draft.followers);
  if (!Number.isFinite(followers) || followers < 0) return "Followers needs a number, like 149000.";
  return {
    ...draft,
    name,
    handle: draft.handle.trim().replace(/^@/, ""),
    niche: draft.niche.trim() || "Lifestyle",
    followers,
    points: draft.points.split(",").map((point) => point.trim()).filter(Boolean),
  };
}

function Thumb({ creator }) {
  const photo = artistPhoto(creator);
  return photo
    ? <img className="roster-thumb" src={photo} alt="" style={creator.focus ? { objectPosition: creator.focus } : undefined} />
    : <span className="roster-thumb empty" aria-hidden="true">{(creator.name || "?").slice(0, 1).toUpperCase()}</span>;
}

function ArtistForm({ draft, setDraft, niches, onSubmit, submitLabel, note, setNote, children }) {
  function update(key, value) {
    setDraft((current) => ({ ...current, [key]: value }));
    setNote("");
  }

  async function choosePhoto(event) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    try {
      update("photo", await shrinkPhoto(file, 720));
    } catch (error) {
      setNote(error.message);
    }
  }

  return (
    <form className="roster-fields" onSubmit={onSubmit}>
      <div className="wide roster-photo">
        <Thumb creator={{ ...draft, photo: draft.photo || draft.fallbackPhoto || "" }} />
        <label className="ghost photo-pick">
          {draft.photo ? "Change photo" : "Upload photo"}
          <input type="file" accept="image/*" onChange={choosePhoto} />
        </label>
        {draft.photo ? <button className="ghost" type="button" onClick={() => update("photo", "")}>Remove photo</button> : null}
      </div>
      <label>Name<input required value={draft.name} onChange={(event) => update("name", event.target.value)} /></label>
      <label>Instagram handle<input value={draft.handle} placeholder="without @" onChange={(event) => update("handle", event.target.value)} /></label>
      <label>Followers<input inputMode="numeric" value={draft.followers} onChange={(event) => update("followers", event.target.value)} /></label>
      <label>
        Category
        <input list="artist-niches" value={draft.niche} placeholder="Beauty, Food…" onChange={(event) => update("niche", event.target.value)} />
        <datalist id="artist-niches">{niches.map((niche) => <option key={niche} value={niche} />)}</datalist>
      </label>
      <label>Location<input value={draft.location} onChange={(event) => update("location", event.target.value)} /></label>
      <label>Endorsed brand<input value={draft.brand} onChange={(event) => update("brand", event.target.value)} /></label>
      <label className="wide">Instagram link<input value={draft.instagram} placeholder="https://www.instagram.com/…" onChange={(event) => update("instagram", event.target.value)} /></label>
      <label className="wide">Content, separated by commas<input value={draft.points} placeholder="Makeup, Skincare" onChange={(event) => update("points", event.target.value)} /></label>
      <label className="wide">Bio<textarea value={draft.bio} onChange={(event) => update("bio", event.target.value)} /></label>
      <div className="wide button-row">
        {note ? <p className="meta">{note}</p> : null}
        {children}
        <button className="save" type="submit">{submitLabel}</button>
      </div>
    </form>
  );
}

function ArtistRow({ creator, index, total, niches, move, saveCredentials, removeArtist }) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(() => draftFrom(creator));
  const [note, setNote] = useState("");
  const builtInPhoto = isAddedArtist(creator.id) ? "" : artistPhoto({ ...creator, photo: "" });

  function save(event) {
    event.preventDefault();
    const fields = fieldsFrom(draft);
    if (typeof fields === "string") {
      setNote(fields);
      return;
    }
    const ok = saveCredentials(creator.id, fields);
    setNote(ok ? "Saved in this browser." : "This browser is out of room. Try a smaller photo.");
  }

  function remove() {
    if (window.confirm(`Delete ${creator.name} from the public artists page? You can put them back later from the removed list.`)) removeArtist(creator.id);
  }

  return (
    <article className="roster-row">
      <div className="roster-head">
        <div className="roster-who">
          <Thumb creator={creator} />
          <div>
            <b>{index + 1}. {creator.name}</b>
            <p className="meta">
              {creator.niche}
              {creator.followers ? ` · ${formatFollowers(creator.followers)} followers` : ""}
              {creator.brand ? ` · ${creator.brand}` : ""}
              {creator.handle ? ` · @${creator.handle}` : ""}
            </p>
          </div>
        </div>
        <div className="button-row">
          <button className="ghost" type="button" disabled={index === 0} onClick={() => move(creator.id, -1)}>Move up</button>
          <button className="ghost" type="button" disabled={index === total - 1} onClick={() => move(creator.id, 1)}>Move down</button>
          <Link className="ghost" href={artistPath(creator)}>View</Link>
          <button className="save" type="button" aria-expanded={open} onClick={() => { setDraft(draftFrom(creator)); setNote(""); setOpen(!open); }}>{open ? "Close" : "Edit"}</button>
          <button className="ghost talent-delete" type="button" onClick={remove} aria-label={`Delete ${creator.name}`}>Delete</button>
        </div>
      </div>
      {open ? (
        <ArtistForm draft={{ ...draft, fallbackPhoto: builtInPhoto }} setDraft={setDraft} niches={niches} onSubmit={save} submitLabel="Save changes" note={note} setNote={setNote}>
          <button className="ghost" type="button" onClick={remove}>Remove artist</button>
        </ArtistForm>
      ) : null}
    </article>
  );
}

function AddArtist({ niches, addArtist }) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(blank);
  const [note, setNote] = useState("");

  function add(event) {
    event.preventDefault();
    const fields = fieldsFrom(draft);
    if (typeof fields === "string") {
      setNote(fields);
      return;
    }
    if (!addArtist(fields)) {
      setNote("This browser is out of room. Try a smaller photo.");
      return;
    }
    setDraft(blank);
    setOpen(false);
    setNote("");
  }

  if (!open) {
    return (
      <div className="button-row roster-add">
        <button className="apply" type="button" onClick={() => setOpen(true)}>Add artist</button>
      </div>
    );
  }

  return (
    <section className="panel" aria-label="Add artist">
      <h2>New artist</h2>
      <p className="meta">They show up at the end of the public list. Move them up after.</p>
      <ArtistForm draft={draft} setDraft={setDraft} niches={niches} onSubmit={add} submitLabel="Add artist" note={note} setNote={setNote}>
        <button className="ghost" type="button" onClick={() => { setOpen(false); setDraft(blank); setNote(""); }}>Cancel</button>
      </ArtistForm>
    </section>
  );
}

export function ShowcaseDesk() {
  const { list, removed, move, saveCredentials, addArtist, removeArtist, restoreArtist } = useShowcase();
  const niches = [...new Set(["Beauty", "Fashion", "Entertainment", "Lifestyle", "Food", ...list.map((creator) => creator.niche).filter(Boolean)])];

  return (
    <>
      <header className="page-head">
        <p className="eyebrow">Public artists</p>
        <h1>Who visitors see first.</h1>
        <p className="lede">Add artists, edit their name, photo, and profile, or move them up and down. This stays in this browser.</p>
      </header>
      <AddArtist niches={niches} addArtist={addArtist} />
      <section className="panel" aria-label="Artist order">
        {list.map((creator, index) => (
          <ArtistRow key={creator.id} creator={creator} index={index} total={list.length} niches={niches} move={move} saveCredentials={saveCredentials} removeArtist={removeArtist} />
        ))}
      </section>
      {removed.length ? (
        <section className="panel" aria-label="Removed artists">
          <h2>Removed</h2>
          {removed.map((creator) => (
            <div key={creator.id} className="roster-head roster-row">
              <div className="roster-who">
                <Thumb creator={creator} />
                <b>{creator.name}</b>
              </div>
              <button className="ghost" type="button" onClick={() => restoreArtist(creator.id)}>Put back</button>
            </div>
          ))}
        </section>
      ) : null}
    </>
  );
}
