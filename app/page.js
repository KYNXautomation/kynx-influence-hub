"use client";

import { AboutContact } from "../components/AboutContact";
import { PublicFrame } from "../components/PublicFrame";
import { PublicFooter } from "../components/PublicFooter";
import { Award } from "../components/Award";
import { awards } from "../lib/awards";

export default function HomePage() {
  return (
    <PublicFrame>
      <main className="landing home-award">
        <Award award={awards[0]} featured />
      </main>
      <AboutContact />
      <PublicFooter />
    </PublicFrame>
  );
}
