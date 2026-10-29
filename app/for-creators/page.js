"use client";

import Link from "next/link";
import { PublicFrame } from "../../components/PublicFrame";
import { PublicFooter, StepGrid } from "../../components/PublicFooter";

const steps = [
  ["Make your account", "Sign up as a creator and add your handles so we can match you to the right briefs."],
  ["Get invited or apply", "Accept a campaign invite, or apply when a campaign opens applications."],
  ["Create and get paid", "Send your draft, post once it is approved, and follow your payment to the end."],
];

export default function ForCreatorsPage() {
  return (
    <PublicFrame>
      <main className="landing">
        <section className="intro-band">
          <div>
            <p className="eyebrow">For content creators</p>
            <h2>See the opportunity.<br />Understand the terms.<br /><em>Make something great.</em></h2>
            <p className="lede">When we invite you to a campaign, or open applications, review the brief and respond from your creator account.</p>
          </div>
          <div className="intro-action">
            <Link className="join" href="/signup">Get started →</Link>
            <small>New to Kynx? Create a creator account to apply for campaigns.</small>
          </div>
        </section>
        <StepGrid steps={steps} />
      </main>
      <PublicFooter />
    </PublicFrame>
  );
}
