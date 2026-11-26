import { PublicFrame } from "../../components/PublicFrame";
import { PublicFooter } from "../../components/PublicFooter";
import { Award } from "../../components/Award";
import { awards } from "../../lib/awards";

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
        {awards.map((award) => <Award key={award.id} award={award} />)}
      </main>
      <PublicFooter />
    </PublicFrame>
  );
}
