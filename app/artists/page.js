"use client";

import { PublicFrame } from "../../components/PublicFrame";
import { BrandArtists } from "../../components/BrandArtists";
import { PublicFooter } from "../../components/PublicFooter";

export default function ArtistsPage() {
  return (
    <PublicFrame>
      <section className="home-artists">
        <header className="team-head">
          <h1>Meet the KYNX artists</h1>
          <p>Exclusive creators in food, beauty, fashion, comedy and everyday life, managed end to end by KYNX.</p>
        </header>
        <BrandArtists />
      </section>
      <PublicFooter />
    </PublicFrame>
  );
}
