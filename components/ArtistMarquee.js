import Link from "next/link";
import { creators } from "../lib/model";
import { artistPath, artistPhoto } from "../lib/showcase";

// The KYNX exclusive creators, sliding past in a loop. Pauses on hover and for reduced motion.
const exclusives = creators.filter((creator) => creator.manager && artistPhoto(creator));

export function ArtistMarquee() {
  return (
    <section className="marquee" aria-label="KYNX exclusive creators">
      <div className="marquee-track">
        {/* The list is shown twice so the loop has no gap; the copy is hidden from screen readers. */}
        {[0, 1].map((copy) => (
          <ul key={copy} className="marquee-list" aria-hidden={copy ? "true" : undefined}>
            {exclusives.map((creator) => (
              <li key={creator.id}>
                <Link href={artistPath(creator)} tabIndex={copy ? -1 : undefined}>
                  <img src={artistPhoto(creator)} alt="" loading="lazy" style={creator.focus ? { objectPosition: creator.focus } : undefined} />
                  <span>{creator.name}<small>{creator.niche}</small></span>
                </Link>
              </li>
            ))}
          </ul>
        ))}
      </div>
    </section>
  );
}
