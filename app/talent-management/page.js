"use client";

import { useState } from "react";
import { PublicFrame } from "../../components/PublicFrame";
import { PublicFooter, StepGrid } from "../../components/PublicFooter";
import { categoryOptions } from "../../lib/model";
import { contactDetails } from "../../lib/brandSite";
import { ArtistMarquee } from "../../components/ArtistMarquee";

const steps = [
  ["Apply", "Tell us who you are, where you post, and the content you make."],
  ["Talk with us", "If your content fits, a KYNX talent manager reaches out to get to know you."],
  ["Join the roster", "Exclusive creators get a dedicated talent manager for campaigns, contracts and rate cards."],
];

const blank = { name: "", email: "", city: "", niche: categoryOptions[0], instagram: "", tiktok: "", facebook: "", followers: "", about: "" };

export default function TalentManagementPage() {
  const [form, setForm] = useState(blank);
  const [note, setNote] = useState("");

  function update(key, value) {
    setForm((current) => ({ ...current, [key]: value }));
    setNote("");
  }

  // No server behind the site: the application opens in the applicant's email app, ready to send.
  function submit(event) {
    event.preventDefault();
    const body = [
      `Name: ${form.name.trim()}`,
      `Email: ${form.email.trim()}`,
      `City: ${form.city.trim()}`,
      `Content: ${form.niche}`,
      `Instagram: ${form.instagram.trim()}`,
      `TikTok: ${form.tiktok.trim()}`,
      `Facebook: ${form.facebook.trim()}`,
      `Total followers: ${form.followers.trim()}`,
      "",
      form.about.trim(),
    ].join("\n");
    const subject = `Exclusive creator application: ${form.name.trim()}`;
    window.location.href = `mailto:${contactDetails.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setNote(`Your email app should open with your application ready. If it does not, write to ${contactDetails.email}.`);
  }

  return (
    <PublicFrame>
      <main className="landing">
        <section className="intro-band">
          <div>
            <p className="eyebrow">Talent management</p>
            <h2>Become a KYNX<br /><em>exclusive creator.</em></h2>
            <p className="lede">Our exclusive creators are managed end to end by KYNX, with a talent manager who handles their campaigns, contracts and rate cards.</p>
          </div>
          <div className="intro-action">
            <a className="join" href="#apply">Apply now →</a>
            <small>It takes about two minutes.</small>
          </div>
        </section>
        <ArtistMarquee />
        <StepGrid steps={steps} />

        <section className="contact-block apply-block" id="apply">
          <div>
            <h2>Apply as an exclusive creator</h2>
            <p>Share your accounts and a little about your content. Fields marked required must be filled in.</p>
          </div>
          <form className="contact-form" onSubmit={submit}>
            <label>Full name <small>(required)</small><input required value={form.name} autoComplete="name" onChange={(event) => update("name", event.target.value)} /></label>
            <label>Email <small>(required)</small><input required type="email" value={form.email} autoComplete="email" onChange={(event) => update("email", event.target.value)} /></label>
            <label>City<input value={form.city} autoComplete="address-level2" onChange={(event) => update("city", event.target.value)} /></label>
            <label>
              Main content
              <select value={form.niche} onChange={(event) => update("niche", event.target.value)}>
                {categoryOptions.map((item) => <option key={item}>{item}</option>)}
              </select>
            </label>
            <label>Instagram <small>(link or @handle)</small><input value={form.instagram} onChange={(event) => update("instagram", event.target.value)} /></label>
            <label>TikTok <small>(link or @handle)</small><input value={form.tiktok} onChange={(event) => update("tiktok", event.target.value)} /></label>
            <label>Facebook <small>(link)</small><input value={form.facebook} onChange={(event) => update("facebook", event.target.value)} /></label>
            <label>Total followers <small>(approximate)</small><input inputMode="numeric" value={form.followers} placeholder="e.g. 50,000" onChange={(event) => update("followers", event.target.value)} /></label>
            <label>About your content <small>(required)</small><textarea required value={form.about} placeholder="What you post, brands you have worked with, why you want to join." onChange={(event) => update("about", event.target.value)} /></label>
            <button className="join" type="submit">Send application</button>
            {note ? <p className="contact-note" role="status">{note}</p> : null}
          </form>
        </section>
      </main>
      <PublicFooter />
    </PublicFrame>
  );
}
