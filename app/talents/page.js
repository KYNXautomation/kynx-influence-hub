"use client";

import { useState } from "react";
import Link from "next/link";
import { Workspace } from "../../components/Workspace";
import { Avatar } from "../../components/Avatar";
import { useRole } from "../../components/RoleProvider";
import { useLedger } from "../../lib/useLedger";
import { useTalents } from "../../lib/useTalents";
import { blankTalent, contractOptions, presentTalent, rateChannels, talentManagers } from "../../lib/talents";
import { categoryOptions } from "../../lib/model";
import { campaignPath } from "../../lib/paths";
import { formatDate, formatFollowers, formatNumber, formatPeso } from "../../lib/format";

function TalentForm({ talent, standalone, canAssign, onSave, onCancel, onRemove }) {
  const [draft, setDraft] = useState(talent);
  const [error, setError] = useState("");

  function update(key, value) {
    setDraft((current) => ({ ...current, [key]: value }));
    setError("");
  }

  function updateRate(key, value) {
    setDraft((current) => ({ ...current, rates: { ...current.rates, [key]: value } }));
    setError("");
  }

  function submit(event) {
    event.preventDefault();
    if (standalone && !String(draft.name || "").trim()) {
      setError("Give the talent a name.");
      return;
    }
    const rates = {};
    for (const [key] of rateChannels) {
      const value = draft.rates[key] === "" ? 0 : Number(draft.rates[key]);
      if (!Number.isFinite(value) || value < 0) {
        setError("Rates need a number, like 8000.");
        return;
      }
      rates[key] = Math.round(value);
    }
    const followers = Number(draft.followers || 0);
    onSave({
      ...draft,
      name: String(draft.name || "").trim(),
      handle: String(draft.handle || "").trim().replace(/^@/, ""),
      followers: Number.isFinite(followers) && followers >= 0 ? followers : 0,
      email: draft.email.trim(),
      phone: draft.phone.trim(),
      rates,
    });
  }

  return (
    <form className="roster-fields talent-form" onSubmit={submit}>
      {standalone ? (
        <>
          <label>Name<input required value={draft.name} onChange={(event) => update("name", event.target.value)} /></label>
          <label>Handle<input value={draft.handle} placeholder="without @" onChange={(event) => update("handle", event.target.value)} /></label>
          <label>Followers<input inputMode="numeric" value={draft.followers} onChange={(event) => update("followers", event.target.value)} /></label>
          <label>
            Niche
            <select value={draft.niche} onChange={(event) => update("niche", event.target.value)}>
              {categoryOptions.map((item) => <option key={item}>{item}</option>)}
            </select>
          </label>
        </>
      ) : null}
      <label>
        Manager
        <select value={draft.manager} disabled={!canAssign} onChange={(event) => update("manager", event.target.value)}>
          {talentManagers.map((name) => <option key={name}>{name}</option>)}
        </select>
      </label>
      <label>
        Contract
        <select value={draft.contract} onChange={(event) => update("contract", event.target.value)}>
          {contractOptions.map((item) => <option key={item}>{item}</option>)}
        </select>
      </label>
      <label>Contract ends<input type="date" value={draft.contractEnd} onChange={(event) => update("contractEnd", event.target.value)} /></label>
      <label className="talent-check">
        <input type="checkbox" checked={draft.onLeave} onChange={(event) => update("onLeave", event.target.checked)} />
        On leave
      </label>
      {rateChannels.map(([key, label]) => (
        <label key={key}>{label} rate (₱)<input inputMode="numeric" value={draft.rates[key]} onChange={(event) => updateRate(key, event.target.value)} /></label>
      ))}
      <label>Email<input type="email" value={draft.email} onChange={(event) => update("email", event.target.value)} /></label>
      <label>Phone<input value={draft.phone} onChange={(event) => update("phone", event.target.value)} /></label>
      <label className="wide">Notes<textarea value={draft.notes} placeholder="Preferences, brands to avoid, renewal talks…" onChange={(event) => update("notes", event.target.value)} /></label>
      {error ? <p className="wide sheet-error">{error}</p> : null}
      <div className="wide button-row" style={{ justifyContent: "flex-start" }}>
        <button className="apply" type="submit">Save talent</button>
        <button className="ghost" type="button" onClick={onCancel}>Cancel</button>
        {onRemove ? <button className="ghost" type="button" onClick={onRemove}>Remove from roster</button> : null}
      </div>
    </form>
  );
}

export default function TalentsPage() {
  const { role, talentManager } = useRole();
  const { listRecords } = useLedger();
  const { talents, saveTalent, removeTalent } = useTalents();
  const [q, setQ] = useState("");
  const [managerFilter, setManagerFilter] = useState("all");
  const [contractFilter, setContractFilter] = useState("");
  const [editingId, setEditingId] = useState("");
  const [adding, setAdding] = useState(false);
  const [notice, setNotice] = useState("");

  const isAdmin = role === "admin";
  const manager = isAdmin ? managerFilter : talentManager;
  const records = listRecords();
  const query = q.trim().toLowerCase();
  const mine = talents
    .map((talent) => presentTalent(talent, records))
    .filter((talent) => manager === "all" || talent.manager === manager);
  const shown = mine
    .filter((talent) => !contractFilter || talent.contract === contractFilter)
    .filter((talent) => !query || `${talent.name} ${talent.handle} ${talent.niche}`.toLowerCase().includes(query))
    .sort((a, b) => Number(b.endingSoon) - Number(a.endingSoon) || b.followers - a.followers);

  function save(fields) {
    const { id, creatorId, name, handle, niche, followers, manager: owner, contract, contractEnd, onLeave, rates, email, phone, notes } = fields;
    const ok = saveTalent({ id, creatorId, name, handle, niche, followers, manager: owner, contract, contractEnd, onLeave, rates, email, phone, notes });
    setEditingId("");
    setAdding(false);
    setNotice(ok ? `${fields.name || "Talent"} saved in this browser.` : "The browser is out of room, so this was not saved.");
  }

  function remove(talent) {
    if (!window.confirm(`Remove ${talent.name} from the talent roster?`)) return;
    removeTalent(talent.id);
    setEditingId("");
    setNotice(`${talent.name} removed from the roster.`);
  }

  return (
    <Workspace active="/talents">
      <header className="page-head">
        <p className="eyebrow">Talent management</p>
        <h1>{manager === "all" ? "Every talent." : `${manager}’s talents.`}</h1>
        <p className="lede">Contracts, availability, rate cards, and contacts for each talent. Campaigns come straight from the live tracker.</p>
      </header>

      <div className="stats">
        <div className="stat"><b>{mine.length}</b><span>Talents</span></div>
        <div className="stat"><b>{mine.filter((talent) => talent.contract === "Exclusive").length}</b><span>Exclusive</span></div>
        <div className="stat"><b>{mine.filter((talent) => talent.availability === "On a campaign").length}</b><span>On a campaign</span></div>
        <div className="stat"><b>{mine.filter((talent) => talent.endingSoon).length}</b><span>Contracts ending in 30 days</span></div>
      </div>

      <div className="filters">
        <label>Search<input value={q} placeholder="Name, handle, or niche" onChange={(event) => setQ(event.target.value)} /></label>
        {isAdmin ? (
          <label>
            Manager
            <select value={managerFilter} onChange={(event) => setManagerFilter(event.target.value)}>
              <option value="all">All managers</option>
              {talentManagers.map((name) => <option key={name}>{name}</option>)}
            </select>
          </label>
        ) : null}
        <label>
          Contract
          <select value={contractFilter} onChange={(event) => setContractFilter(event.target.value)}>
            <option value="">Any contract</option>
            {contractOptions.map((item) => <option key={item}>{item}</option>)}
          </select>
        </label>
        <button className="apply" type="button" onClick={() => { setAdding(true); setEditingId(""); }}>Add talent</button>
      </div>

      {notice ? <p className="notice">{notice}</p> : null}

      {adding ? (
        <section className="panel talent-card">
          <h3>New talent</h3>
          <TalentForm
            talent={blankTalent(manager === "all" ? "" : manager)}
            standalone
            canAssign={isAdmin}
            onSave={save}
            onCancel={() => setAdding(false)}
          />
        </section>
      ) : null}

      <p className="result-line">{shown.length} {shown.length === 1 ? "talent" : "talents"}</p>
      {shown.length === 0 ? <p className="empty">No talents match. Try another search or contract type.</p> : (
        <div className="stack">
          {shown.map((talent) => (
            <article className="panel talent-card" key={talent.id}>
              <div className="talent-row">
                <span className="who">
                  <Avatar name={talent.name} />
                  <span>
                    <strong>{talent.name}</strong>
                    <span className="meta">
                      {talent.handle ? `@${talent.handle} · ` : ""}{talent.niche}{talent.followers ? ` · ${formatFollowers(talent.followers)}` : ""}
                    </span>
                  </span>
                </span>
                <span className="talent-tags">
                  <span className={talent.contract === "Exclusive" ? "status ready" : "status"}>{talent.contract}</span>
                  <span className={talent.availability === "Available" ? "status" : "status hold"}>{talent.availability}</span>
                </span>
                <span>
                  <strong>{talent.contractEnd ? formatDate(talent.contractEnd) : "No end date"}</strong>
                  <span className="meta">
                    {talent.daysLeft === null ? "Contract" : talent.daysLeft < 0 ? "Contract ended" : talent.endingSoon ? `Ends in ${talent.daysLeft} days` : "Contract ends"}
                  </span>
                </span>
                <span>
                  <strong>{talent.rates.tiktok ? formatPeso(talent.rates.tiktok) : "No rate"}</strong>
                  <span className="meta">TikTok rate · {manager === "all" ? talent.manager : `${talent.campaigns.length} campaigns`}</span>
                </span>
                <Link
                  className="ghost talent-campaigns-button"
                  href={`/talents/campaigns/?id=${encodeURIComponent(talent.id)}`}
                  target="_blank"
                  rel="noopener"
                  title={`Open ${talent.name}’s campaigns in a new tab`}
                >
                  <span className={talent.ongoing.length ? "count-badge" : "count-badge zero"}>{talent.ongoing.length}</span>
                  Campaigns ↗
                </Link>
                <button className="ghost" type="button" onClick={() => { setEditingId(editingId === talent.id ? "" : talent.id); setAdding(false); }}>
                  {editingId === talent.id ? "Close" : "Manage"}
                </button>
              </div>

              {editingId === talent.id ? (
                <>
                  <div className="talent-detail">
                    <p className="meta">
                      <strong>Campaigns:</strong>{" "}
                      {talent.campaigns.length ? talent.campaigns.map((item, index) => (
                        <span key={item.id}>{index ? ", " : ""}<Link className="text-link" href={campaignPath(item.id)}>{item.name}</Link></span>
                      )) : "None yet"}
                      {talent.views ? ` · ${formatNumber(talent.views)} generated views` : ""}
                    </p>
                    {talent.notes ? <p className="meta"><strong>Notes:</strong> {talent.notes}</p> : null}
                  </div>
                  <TalentForm
                    talent={talent}
                    standalone={!talent.creatorId}
                    canAssign={isAdmin}
                    onSave={save}
                    onCancel={() => setEditingId("")}
                    onRemove={() => remove(talent)}
                  />
                </>
              ) : null}
            </article>
          ))}
        </div>
      )}
    </Workspace>
  );
}
