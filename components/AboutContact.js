"use client";

import { useState } from "react";
import { contactDetails } from "../lib/brandSite";

const blank = { first: "", last: "", email: "", updates: false, message: "" };

export function AboutContact() {
  const [form, setForm] = useState(blank);
  const [note, setNote] = useState("");

  function update(key, value) {
    setForm((current) => ({ ...current, [key]: value }));
    setNote("");
  }

  // There is no server behind this page, so the form opens the visitor's email app with the message ready to send.
  function submit(event) {
    event.preventDefault();
    const name = `${form.first.trim()} ${form.last.trim()}`.trim();
    const body = [
      form.message.trim(),
      "",
      `From: ${name}`,
      `Email: ${form.email.trim()}`,
      form.updates ? "Please sign me up for news and updates." : "",
    ].filter((line, index) => line || index < 4).join("\n");
    const subject = `Working together: ${name}`;
    window.location.href = `mailto:${contactDetails.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setNote(`Your email app should open with the message ready. If it does not, write to ${contactDetails.email}.`);
  }

  return (
    <div className="about-contact">
      <section className="about-block" id="about">
        <div>
          <h2>Who we are</h2>
          <p>
            KYNX Influence Hub partners with brands and platforms to deliver structured, high-impact influencer campaigns
            across nano to mega-tier creators. We specialize in building creator ecosystems that generate awareness,
            credibility, and measurable brand impact—bridging influence, content, and performance.
          </p>
          <p>Our approach combines strategic planning, curated creator activation, and campaign systems designed to scale.</p>
        </div>
        <div className="about-art" aria-hidden="true">
          <span>KYN<em>X.</em></span>
          <small>Influence Hub</small>
        </div>
      </section>

      <section className="contact-block" id="contact-us">
        <div>
          <h2>Contact us</h2>
          <p>Interested in working together? Fill out some info and we will be in touch shortly. We can’t wait to hear from you!</p>
          <p className="contact-lines">
            <a href={`mailto:${contactDetails.email}`}>{contactDetails.email}</a>
            <a href="tel:+639761486539">{contactDetails.phone}</a>
          </p>
        </div>
        <form className="contact-form" onSubmit={submit}>
          <fieldset>
            <legend>Name</legend>
            <label>First name <small>(required)</small><input required value={form.first} autoComplete="given-name" onChange={(event) => update("first", event.target.value)} /></label>
            <label>Last name <small>(required)</small><input required value={form.last} autoComplete="family-name" onChange={(event) => update("last", event.target.value)} /></label>
          </fieldset>
          <label>Email <small>(required)</small><input required type="email" value={form.email} autoComplete="email" onChange={(event) => update("email", event.target.value)} /></label>
          <label className="contact-check">
            <input type="checkbox" checked={form.updates} onChange={(event) => update("updates", event.target.checked)} />
            Sign up for news and updates
          </label>
          <label>Message <small>(required)</small><textarea required value={form.message} onChange={(event) => update("message", event.target.value)} /></label>
          <button className="join" type="submit">Submit</button>
          {note ? <p className="contact-note">{note}</p> : null}
        </form>
      </section>
    </div>
  );
}
