"use client";

import Link from "next/link";
import { PublicFrame } from "../../components/PublicFrame";
import { PublicFooter, StepGrid } from "../../components/PublicFooter";

const steps = [
  ["Find the right fit", "We share campaign opportunities and invite creators whose content fits the brief."],
  ["Agree on the work", "Review the deliverables, fee, timeline, and agreement before confirming."],
  ["Create with clarity", "Follow draft feedback, brand approval, posting, and payment progress in one place."],
];

export default function HowItWorksPage() {
  return (
    <PublicFrame>
      <main className="landing">
        <section className="intro-band">
          <div>
            <p className="eyebrow">A clearer campaign flow</p>
            <h2>From first hello<br /><em>to final post.</em></h2>
            <p className="lede">Creators know what to expect. Brands know what is moving.</p>
          </div>
          <div className="intro-action">
            <Link className="join" href="/for-creators">I am a creator →</Link>
            <Link className="text-link" href="/for-brands">I am a brand</Link>
          </div>
        </section>
        <StepGrid steps={steps} />
      </main>
      <PublicFooter />
    </PublicFrame>
  );
}
