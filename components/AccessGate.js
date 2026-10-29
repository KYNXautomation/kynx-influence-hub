"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PublicFrame } from "./PublicFrame";
import { useRole } from "./RoleProvider";
import { roleById } from "../lib/roles";

const managementSides = [
  ["admin", "Admin", "Approvals, the live tracker, and campaign money"],
  ["brands", "Brand", "Your campaigns, nominations, and generated views"],
  ["specialists", "Specialist", "Your creators from the pitch through the post"],
  ["finance", "Finance", "Brand payments, creator costs, and VAT"],
];

function Choice({ title, detail, onClick }) {
  return (
    <button className="choice" type="button" onClick={onClick}>
      <span><b>{title}</b><small>{detail}</small></span>
      <span aria-hidden="true">→</span>
    </button>
  );
}

export function AccessGate({ mode }) {
  const router = useRouter();
  const { setRole } = useRole();
  const signup = mode === "signup";
  const [picking, setPicking] = useState(false);

  function enter(role) {
    setRole(role);
    router.push(roleById(role).home);
  }

  return (
    <PublicFrame gate>
      <main className="gate-main">
        <section className="gate-card">
          {picking ? (
            <button className="text-link gate-back" type="button" onClick={() => setPicking(false)}>← Back</button>
          ) : (
            <Link className="text-link" href="/">← Back to Kynx</Link>
          )}
          <p className="eyebrow">{signup ? "Creator access" : picking ? "Management demo" : "Welcome back"}</p>
          <h1>{signup ? "Your next campaign starts here." : picking ? "Which side are you on?" : "Welcome to Kynx."}</h1>
          <p className="lede">
            {signup
              ? "Create a creator account to apply for open campaigns and respond to agency invitations."
              : picking
                ? "Each side sees the parts of a campaign it works on."
                : "Choose the workspace you want to preview."}
          </p>
          {picking ? null : (
            <div className="notice">
              <strong>Account access is not connected yet.</strong>
              <p className="meta">This prototype does not create real accounts or collect passwords.</p>
            </div>
          )}
          {signup ? (
            <Choice title="Preview creator access" detail="Try campaign applications with sample profiles" onClick={() => enter("creators")} />
          ) : picking ? (
            managementSides.map(([id, title, detail]) => <Choice key={id} title={title} detail={detail} onClick={() => enter(id)} />)
          ) : (
            <>
              <Choice title="Creator preview" detail="Browse campaigns and try the application flow" onClick={() => enter("creators")} />
              <Choice title="Management demo" detail="Admin, brand, specialist, or finance" onClick={() => setPicking(true)} />
            </>
          )}
          <p className="meta">Sample information only · No email or password required</p>
          {signup ? <p className="meta">Already previewing? <Link className="text-link" href="/login">Log in</Link></p> : <p className="meta">New here? <Link className="text-link" href="/signup">Join as a creator</Link></p>}
        </section>
      </main>
    </PublicFrame>
  );
}
