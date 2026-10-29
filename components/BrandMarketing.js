"use client";

import Link from "next/link";
import { useRole } from "./RoleProvider";
import { aboutCopy, brandIntro, contactDetails, principles, serviceIntro, services, works } from "../lib/brandSite";
import { WorkVideo } from "./WorkVideo";

export function BrandMarketing({ page }) {
  const { role } = useRole();
  if (role !== "brands") return null;

  if (page === "services") {
    return (
      <>
        <header className="page-head">
          <p className="eyebrow">Services</p>
          <h1>Services we offer</h1>
          <p className="lede">{serviceIntro}</p>
        </header>
        <div className="brand-grid">
          {services.map((name) => (
            <article key={name} className="panel">
              <h2>{name}</h2>
            </article>
          ))}
        </div>
      </>
    );
  }

  if (page === "about") {
    return (
      <>
        <header className="page-head">
          <p className="eyebrow">About</p>
          <h1>Who we are</h1>
          <p className="lede">{aboutCopy}</p>
        </header>
      </>
    );
  }

  if (page === "works") {
    return (
      <>
        <header className="page-head">
          <p className="eyebrow">Our Works</p>
          <h1>Campaigns brands can see.</h1>
          <p className="lede">A few partnerships from the public site. Fees and internal notes stay off this side.</p>
        </header>
        <div className="brand-grid">
          {works.map((work) => (
            <article key={`${work.creator}-${work.brand}`} className="panel">
              {work.src ? <WorkVideo src={work.src} poster={work.poster} /> : null}
              <h2>{work.creator}</h2>
              <p className="meta">For {work.brand}</p>
            </article>
          ))}
        </div>
        <div className="stack" style={{ marginTop: 14 }}>
          {principles.map((item) => (
            <article key={item.title} className="panel">
              <h2>{item.title}</h2>
              <p className="meta">{item.body}</p>
            </article>
          ))}
        </div>
      </>
    );
  }

  if (page === "contact") {
    return (
      <>
        <header className="page-head">
          <p className="eyebrow">Contact</p>
          <h1>Work with us</h1>
          <p className="lede">Interested in working together? Reach the brand desk and we will be in touch.</p>
        </header>
        <section className="panel">
          <h2>Kynx Influence Hub</h2>
          <p className="meta"><a className="text-link" href={`mailto:${contactDetails.email}`}>{contactDetails.email}</a></p>
          <p className="meta"><a className="text-link" href="tel:+639761486539">{contactDetails.phone}</a></p>
          <div className="button-row" style={{ justifyContent: "flex-start", marginTop: 16 }}>
            <a className="ghost" href={contactDetails.instagram} target="_blank" rel="noreferrer">Instagram</a>
            <a className="ghost" href={contactDetails.facebook} target="_blank" rel="noreferrer">Facebook</a>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <header className="page-head">
        <p className="eyebrow">For brands</p>
        <h1>{brandIntro.title}</h1>
        <p className="lede">{brandIntro.lede}</p>
      </header>
      <div className="button-row" style={{ justifyContent: "flex-start", marginBottom: 28 }}>
        <Link className="apply" href="/contact">Work With Us</Link>
      </div>
      <div className="brand-grid">
        <Link className="panel" href="/services"><h2>Services</h2><p className="meta">Sales Sprint, Always-On Engine, Install/Signup Growth, and Launch Blitz.</p></Link>
        <Link className="panel" href="/about"><h2>About</h2><p className="meta">Structured campaigns from nano to mega-tier creators.</p></Link>
        <Link className="panel" href="/works"><h2>Our Works</h2><p className="meta">Partnerships brands are allowed to see.</p></Link>
        <Link className="panel" href="/impact"><h2>Generated views</h2><p className="meta">Published posts and the views those posts generated.</p></Link>
      </div>
    </>
  );
}
