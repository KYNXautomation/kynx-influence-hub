"use client";

import Link from "next/link";
import { PublicFrame } from "../../components/PublicFrame";
import { BrandArtists } from "../../components/BrandArtists";

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
      <footer className="public-foot">
        <Link className="wordmark" href="/">KYN<span>X.</span></Link>
        <p>KYNX Influence Hub · Creator campaigns, made clear</p>
        <Link href="/workspace">Explore the management demo</Link>
      </footer>
    </PublicFrame>
  );
}
