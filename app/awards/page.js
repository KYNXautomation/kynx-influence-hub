import { PublicFrame } from "../../components/PublicFrame";
import { PublicFooter } from "../../components/PublicFooter";
import { basePath } from "../../lib/paths";

// Newest first. Add an award here and its images under public/awards/.
const awards = [
  {
    id: "shopee-mcn-2026",
    title: "MCN Partner Award",
    event: "Shopee Creators’ Night 2026",
    from: "Shopee Philippines",
    place: "The Fifth at Rockwell",
    date: "November 5, 2026",
    text: "KYNX Influence Hub received the MCN Partner Award at Shopee Creators’ Night 2026. To our creators, partners and community: thank you for the trust, the collaboration, and for bringing every campaign to life with us. The recognition is yours, too.",
    images: ["shopee-mcn-2026-1.jpg", "shopee-mcn-2026-2.jpg"],
    link: "https://www.instagram.com/p/DfjiMdIjdGD/",
  },
];

export const metadata = { title: "Awards · KYNX Influence Hub" };

export default function AwardsPage() {
  return (
    <PublicFrame>
      <main className="landing awards-page">
        <header className="page-head">
          <p className="eyebrow">Awards</p>
          <h1>Recognition for the work.</h1>
          <p className="lede">Awards KYNX and our creators have received from the brands and platforms we work with.</p>
        </header>
        {awards.map((award) => (
          <article className="award" key={award.id}>
            <div className="award-images">
              {award.images.map((image, index) => (
                <img key={image} src={`${basePath}/awards/${image}`} alt={index ? "" : `${award.title}, ${award.event}`} loading={index ? "lazy" : "eager"} />
              ))}
            </div>
            <div className="award-text">
              <p className="eyebrow">{award.event}</p>
              <h2>{award.title}</h2>
              <p className="meta">{[award.from, award.place, award.date].join(" · ")}</p>
              <p className="award-body">{award.text}</p>
              <a className="ghost" href={award.link} target="_blank" rel="noreferrer">See the post on Instagram ↗</a>
            </div>
          </article>
        ))}
      </main>
      <PublicFooter />
    </PublicFrame>
  );
}
