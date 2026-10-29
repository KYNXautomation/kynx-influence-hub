"use client";

import { AboutContact } from "../components/AboutContact";
import { PublicFrame } from "../components/PublicFrame";
import { PublicFooter } from "../components/PublicFooter";
import { ViralStage } from "../components/ViralStage";

export default function HomePage() {
  return (
    <PublicFrame>
      <ViralStage />
      <AboutContact />
      <PublicFooter />
    </PublicFrame>
  );
}
