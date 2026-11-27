"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "./ThemeToggle";

const links = [
  ["/how-it-works", "How it works"],
  ["/for-creators", "Creators"],
  ["/for-brands", "Brands"],
  ["/artists", "Artists"],
  ["/talent-management", "Talent management"],
  ["/collaborations", "Collaborations"],
  ["/awards", "Awards"],
  ["/news", "News"],
  ["/about", "About"],
  ["/contact", "Contact"],
];

export function PublicFrame({ children, gate = false }) {
  const pathname = (usePathname() || "").replace(/\/$/, "");
  return (
    <div className={gate ? "public gate" : "public"}>
      <header className="public-bar">
        <Link className="wordmark" href="/" aria-label="Kynx home">KYN<span>X.</span></Link>
        {gate ? null : (
          <nav className="public-nav" aria-label="Main">
            {links.map(([href, label]) => (
              <Link key={href} href={href} aria-current={pathname === href || pathname.startsWith(`${href}/`) ? "page" : undefined}>{label}</Link>
            ))}
          </nav>
        )}
        <div className="public-actions">
          <ThemeToggle />
          {gate ? null : (
            <>
              <Link href="/login">Log in</Link>
              <Link className="join" href="/signup">Join as a creator</Link>
            </>
          )}
        </div>
      </header>
      {children}
    </div>
  );
}
