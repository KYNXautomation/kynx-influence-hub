"use client";

import Link from "next/link";
import { PublicFrame } from "../../components/PublicFrame";
import { PublicFooter, StepGrid } from "../../components/PublicFooter";
import { CollabGrid } from "../../components/CollabGrid";
import { ViralStage } from "../../components/ViralStage";
import { useCollaborations } from "../../lib/collaborations";

const steps = [
  ["Share your goal", "Tell us what you want to grow: sales, sign-ups, installs, or awareness for a launch."],
  ["We pick the creators", "We shortlist creators from nano to mega tier, agree the terms, and brief them."],
  ["Track every post", "Approve drafts, watch posts go live, and see the views each one delivered."],
];

export default function ForBrandsPage() {
  const { items, ready } = useCollaborations();
  return (
    <PublicFrame>
      <main className="landing">
        <section className="intro-band">
          <div>
            <p className="eyebrow">For brands</p>
            <h2>Find the right creators.<br />Agree on the plan.<br /><em>Grow with every post.</em></h2>
            <p className="lede">We match your brand with creators from nano to mega tier, run the campaign end to end, and show you what each post delivered.</p>
          </div>
          <div className="intro-action">
            <Link className="join" href="/contact">Work with us →</Link>
            <small>Tell us about your brand and we will put a campaign plan together.</small>
          </div>
        </section>
        <StepGrid steps={steps} />
        <section className="brand-section">
          <div className="brand-section-head">
            <h2>Collaborations and case studies</h2>
            <Link className="text-link" href="/collaborations">See all collaborations</Link>
          </div>
          {ready ? <CollabGrid items={items.filter((item) => item.published)} /> : null}
        </section>
        <section className="brand-section">
          <div className="brand-section-head"><h2>Campaign films</h2></div>
        </section>
      </main>
      <ViralStage />
      <PublicFooter />
    </PublicFrame>
  );
}
