"use client";

import { Workspace } from "../../components/Workspace";
import { GeneratedViews } from "../../components/GeneratedViews";

export default function ImpactPage() {
  return (
    <Workspace active="/impact">
      <GeneratedViews />
    </Workspace>
  );
}
