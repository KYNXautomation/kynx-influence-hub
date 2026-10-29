"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { creators } from "../lib/model";
import { roleById } from "../lib/roles";
import { talentManagers } from "../lib/talents";

const RoleContext = createContext(null);
const roleKey = "kynx-role";
const creatorKey = "kynx-role-creator";
const specialistKey = "kynx-role-specialist";
const managerKey = "kynx-role-talent-manager";

export function RoleProvider({ children }) {
  const [role, setRole] = useState("admin");
  const [creatorId, setCreatorId] = useState("c03");
  const [specialist, setSpecialist] = useState("all");
  const [talentManager, setTalentManager] = useState(talentManagers[0]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const savedRole = localStorage.getItem(roleKey);
      const savedCreator = localStorage.getItem(creatorKey);
      const savedSpecialist = localStorage.getItem(specialistKey);
      if (roleById(savedRole).id === savedRole) setRole(savedRole);
      if (creators.some((creator) => creator.id === savedCreator)) setCreatorId(savedCreator);
      if (savedSpecialist) setSpecialist(savedSpecialist);
      const savedManager = localStorage.getItem(managerKey);
      if (talentManagers.includes(savedManager)) setTalentManager(savedManager);
    } catch {
      /* keep the operations side */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(roleKey, role);
    localStorage.setItem(creatorKey, creatorId);
    localStorage.setItem(specialistKey, specialist);
    localStorage.setItem(managerKey, talentManager);
  }, [ready, role, creatorId, specialist, talentManager]);

  const creator = creators.find((item) => item.id === creatorId) || creators[2];
  return (
    <RoleContext.Provider value={{ role, setRole, creatorId, setCreatorId, creator, specialist, setSpecialist, talentManager, setTalentManager }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const value = useContext(RoleContext);
  if (!value) throw new Error("useRole must be used inside RoleProvider");
  return value;
}
