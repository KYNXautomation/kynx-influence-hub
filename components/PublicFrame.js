"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "./ThemeToggle";

// A link is [href, label]; a dropdown is [label, [[href, label], ...]].
const links = [
  ["/how-it-works", "How it works"],
  ["/for-creators", "Creators"],
  ["/for-brands", "Brands"],
  ["/artists", "Artists"],
  ["Services", [["/talent-management", "Talent management"], ["/affiliate-marketing", "Affiliate marketing"]]],
  ["/collaborations", "Our works"],
  ["/awards", "Awards"],
  ["/news", "News"],
  ["/about", "About"],
  ["/contact", "Contact"],
];

export function PublicFrame({ children, gate = false }) {
  const pathname = (usePathname() || "").replace(/\/$/, "");
  const current = (href) => (pathname === href || pathname.startsWith(`${href}/`) ? "page" : undefined);
  return (
    <div className={gate ? "public gate" : "public"}>
      <header className="public-bar">
        <Link className="wordmark" href="/" aria-label="Kynx home">KYN<span>X.</span></Link>
        {gate ? null : (
          <nav className="public-nav" aria-label="Main">
            {links.map(([first, second]) => Array.isArray(second) ? (
              // Keyed by the page, so the dropdown closes after picking one of its links.
              <details key={`${first}-${pathname}`} className="nav-drop">
                <summary aria-current={second.some(([href]) => current(href)) ? "page" : undefined}>{first}</summary>
                <div className="nav-drop-menu">
                  {second.map(([href, label]) => <Link key={href} href={href} aria-current={current(href)}>{label}</Link>)}
                </div>
              </details>
            ) : (
              <Link key={first} href={first} aria-current={current(first)}>{second}</Link>
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
