"use client";

import Link from "next/link";
import { PublicFrame } from "../../components/PublicFrame";
import { PublicFooter, StepGrid } from "../../components/PublicFooter";

const steps = [
  ["Share your goal", "Tell us what you want to grow: sales, sign-ups, installs, or awareness for a launch."],
  ["We pick the creators", "We shortlist creators from nano to mega tier, agree the terms, and brief them."],
  ["Track every post", "Approve drafts, watch posts go live, and see the views each one delivered."],
];

export default function ForBrandsPage() {
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
      </main>
      <PublicFooter />
    </PublicFrame>
  );
}
