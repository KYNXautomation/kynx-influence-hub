"use client";

import Link from "next/link";
import { PublicFrame } from "../../components/PublicFrame";
import { BrandArtists } from "../../components/BrandArtists";

export default function ArtistsPage() {
  return (
    <PublicFrame>
      <section className="home-artists">
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
