"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Wordmark } from "./Wordmark";
import { Avatar } from "./Avatar";
import { useRole } from "./RoleProvider";
import { creators } from "../lib/model";
import { allows, navFor, roleById, roles } from "../lib/roles";
import { ThemeToggle } from "./ThemeToggle";
import { talentManagers } from "../lib/talents";

const specialists = ["Annie", "Nisha", "Daneca"];

export function Shell({ children }) {
  const pathname = usePathname() || "/";
  const router = useRouter();
  const { role, setRole, creator, creatorId, setCreatorId, specialist, setSpecialist, talentManager, setTalentManager } = useRole();
  const current = roleById(role);
  const links = navFor(role);
  const allowed = allows(role, pathname);
  const profileName = role === "creators" ? creator.name : role === "specialists" && specialist !== "all" ? specialist : role === "talents" ? talentManager : current.label;

  useEffect(() => {
    if (!allowed) router.replace(current.home);
  }, [allowed, current.home, router]);

  function chooseRole(next) {
    setRole(next);
    router.push(roleById(next).home);
  }

  return (
    <div className="shell">
      <aside className="side">
        <Wordmark />
        <ThemeToggle />
        {role === "brands" ? <p className="tagline">Structured Influence. Scalable Impact.</p> : null}
        <nav className="nav" aria-label="Workspace">
          {links.map(([href, label]) => {
            const active = href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
            return (
              <Link key={href} href={href} className={active ? "active" : undefined}>
                {label}
              </Link>
            );
          })}
        </nav>
        <div className="role-box">
          <label>
            Side
            <select value={role} onChange={(event) => chooseRole(event.target.value)}>
              {roles.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
            </select>
          </label>
          {role === "creators" ? (
            <label>
              Profile
              <select value={creatorId} onChange={(event) => setCreatorId(event.target.value)}>
                {creators.map((item) => <option key={item.id} value={item.id}>{item.handle ? `@${item.handle}` : item.name}</option>)}
              </select>
            </label>
          ) : null}
          {role === "specialists" ? (
            <label>
              Specialist
              <select value={specialist} onChange={(event) => setSpecialist(event.target.value)}>
                <option value="all">All specialists</option>
                {specialists.map((name) => <option key={name}>{name}</option>)}
              </select>
            </label>
          ) : null}
          {role === "talents" ? (
            <label>
              Manager
              <select value={talentManager} onChange={(event) => setTalentManager(event.target.value)}>
                {talentManagers.map((name) => <option key={name}>{name}</option>)}
              </select>
            </label>
          ) : null}
          <div className="profile-card">
            <Avatar name={profileName} />
            <span>
              <strong>{profileName}</strong>
              <small>{role === "admin" ? "Operations" : current.label}</small>
            </span>
          </div>
        </div>
      </aside>
      <main className="main">
        {allowed ? children : (
          <header className="page-head">
            <p className="eyebrow">{current.label}</p>
            <h1>Opening {current.label.toLowerCase()}.</h1>
          </header>
        )}
      </main>
    </div>
  );
}
