"use client";

import { ShowcaseDesk } from "../../components/ShowcaseDesk";
import { Workspace } from "../../components/Workspace";
import { useRole } from "../../components/RoleProvider";

export default function RosterPage() {
  const { role } = useRole();

  return (
    <Workspace active="/roster">
      {role === "admin" ? <ShowcaseDesk /> : <p className="lede">Only an admin can arrange the public artists.</p>}
    </Workspace>
  );
}
