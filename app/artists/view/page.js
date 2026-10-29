"use client";

import { useEffect, useState } from "react";
import { PublicFrame } from "../../../components/PublicFrame";
import { ArtistProfile } from "../../../components/ArtistProfile";

// Profile page for artists an admin adds in the browser; the static build can't make a page per new id.
export default function AddedArtistPage() {
  const [id, setId] = useState(null);

  useEffect(() => {
    setId(new URLSearchParams(window.location.search).get("id") || "");
  }, []);

  return <PublicFrame>{id === null ? <main className="artist-profile" /> : <ArtistProfile id={id} />}</PublicFrame>;
}
