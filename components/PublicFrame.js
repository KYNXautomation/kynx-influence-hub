"use client";

import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";

export function PublicFrame({ children, gate = false }) {
  return (
    <div className={gate ? "public gate" : "public"}>
      <header className="public-bar">
        <Link className="wordmark" href="/" aria-label="Kynx home">KYN<span>X.</span></Link>
        {gate ? null : (
          <nav className="public-nav" aria-label="Main">
            <Link href="/how-it-works">How it works</Link>
            <Link href="/for-creators">For creators</Link>
            <Link href="/for-brands">For brands</Link>
            <Link href="/artists">Artists</Link>
            <Link href="/news">News</Link>
            <Link href="/contact">Contact</Link>
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
