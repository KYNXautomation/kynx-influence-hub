import Link from "next/link";
import { PublicFrame } from "../../components/PublicFrame";
import { PublicFooter, StepGrid } from "../../components/PublicFooter";

export const metadata = { title: "Affiliate marketing · KYNX Influence Hub" };

const steps = [
  ["Pick the products", "Brands share the products, the commission and the selling period. We match them with creators whose audience buys that kind of product."],
  ["Creators post", "Creators make short videos and posts with their own affiliate links, on the platforms where their followers shop."],
  ["Track the sales", "We follow the clicks and orders from each creator's links and report what sold, so the next round goes to what works."],
];

export default function AffiliateMarketingPage() {
  return (
    <PublicFrame>
      <main className="landing">
        <section className="intro-band">
          <div>
            <p className="eyebrow">Services</p>
            <h2>Affiliate<br /><em>marketing.</em></h2>
            <p className="lede">Creators earn a commission on every sale from their links, and brands pay for orders, not only for posts.</p>
          </div>
          <div className="intro-action">
            <Link className="join" href="/contact">Talk to us →</Link>
            <small>For brands and creators.</small>
          </div>
        </section>
        <StepGrid steps={steps} />
      </main>
      <PublicFooter />
    </PublicFrame>
  );
}
