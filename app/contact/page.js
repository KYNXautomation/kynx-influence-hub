"use client";

import Link from "next/link";
import { contactDetails } from "../../lib/brandSite";
import { PublicFrame } from "../../components/PublicFrame";

export default function ContactPage() {
  return (
    <PublicFrame>
      <main className="landing">
        <section className="creator-band">
          <p className="eyebrow">Contact</p>
          <h2>Work with us.</h2>
          <p className="lede">Interested in working together? Reach the desk and we will be in touch.</p>
          <p><a href={`mailto:${contactDetails.email}`}>{contactDetails.email}</a></p>
          <p><a href="tel:+639761486539">{contactDetails.phone}</a></p>
          <div className="button-row" style={{ justifyContent: "flex-start" }}>
            <a className="ghost" href={contactDetails.instagram} target="_blank" rel="noreferrer">Instagram</a>
            <a className="ghost" href={contactDetails.facebook} target="_blank" rel="noreferrer">Facebook</a>
          </div>
        </section>
      </main>
      <footer className="public-foot">
        <Link className="wordmark" href="/">KYN<span>X.</span></Link>
        <p>KYNX Influence Hub · Creator campaigns, made clear</p>
        <Link href="/workspace">Explore the management demo</Link>
      </footer>
    </PublicFrame>
  );
}
