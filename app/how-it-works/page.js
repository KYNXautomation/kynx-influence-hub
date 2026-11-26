"use client";

import { PublicFrame } from "../../components/PublicFrame";
import { PublicFooter } from "../../components/PublicFooter";
import { HowItWorks } from "../../components/HowItWorks";

export default function HowItWorksPage() {
  return (
    <PublicFrame>
      <main className="landing">
        <HowItWorks />
      </main>
      <PublicFooter />
    </PublicFrame>
  );
}
