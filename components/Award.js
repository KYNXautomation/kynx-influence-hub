import Link from "next/link";
import { basePath } from "../lib/paths";

// One award: its photo beside the title, details and thank-you text.
export function Award({ award, featured = false }) {
  return (
    <article className={featured ? "award award-featured" : "award"}>
      <img className="award-image" src={`${basePath}/awards/${award.image}`} alt={`${award.title}, ${award.event}`} />
      <div className="award-text">
        <p className="eyebrow">{featured ? "Award" : award.event}</p>
        <h2>{featured ? <>{award.title}<br /><em>{award.event}</em></> : award.title}</h2>
        <p className="meta">{[award.from, award.place, award.date].join(" · ")}</p>
        <p className="award-body">{award.text}</p>
        <div className="button-row award-actions">
          {featured ? <Link className="join" href="/awards">See our awards</Link> : null}
          <a className="ghost" href={award.link} target="_blank" rel="noreferrer">See the post on Instagram ↗</a>
        </div>
      </div>
    </article>
  );
}
