"use client";

import { AboutContact } from "../components/AboutContact";
import { PublicFrame } from "../components/PublicFrame";
import { PublicFooter } from "../components/PublicFooter";
import { Award } from "../components/Award";
import { HowItWorks } from "../components/HowItWorks";
import { awards } from "../lib/awards";

export default function HomePage() {
  return (
    <PublicFrame>
      <section className="landing home-how">
        <HowItWorks />
      </section>
      <section className="landing home-award">
        <Award award={awards[0]} featured />
      </section>
      <AboutContact />
      <PublicFooter />
    </PublicFrame>
  );
}
