"use client";

import { useState } from "react";
import Link from "next/link";
import { Workspace } from "./Workspace";
import { Avatar } from "./Avatar";
import { ProgressRail } from "./ProgressRail";
import { useRole } from "./RoleProvider";
import { useLedger } from "../lib/useLedger";
import { canSeeRecord } from "../lib/roles";
import { creatorPath } from "../lib/paths";
import { progressMove } from "../lib/progress";
import { creators } from "../lib/model";
import { formatDate, formatFollowers, formatNumber, formatPeso, formatRate } from "../lib/format";

export function CampaignDesk({ id }) {
  const { role, creatorId, specialist } = useRole();
  const { ready, getCampaign, addNomination, patchRecord, markPosted } = useLedger();
  const [notice, setNotice] = useState("");
  const [railNote, setRailNote] = useState(null);
  const campaign = getCampaign(id);
  const records = campaign ? campaign.records.filter((record) => canSeeRecord(role, record, { creatorId, specialist })) : [];
  const tracker = records.filter((record) => record.onTracker);
  const pitching = records.filter((record) => !record.onTracker);

  if (!ready) {
    return (
      <Workspace active="/campaigns">
        <header className="page-head">
          <p className="eyebrow">Campaign</p>
          <h1>Opening the campaign.</h1>
        </header>
      </Workspace>
    );
  }

  if (!campaign) {
    return (
      <Workspace active="/campaigns">
        <header className="page-head">
          <p className="eyebrow">Missing</p>
          <h1>That campaign is not on the desk.</h1>
          <p className="lede"><Link className="text-link" href="/campaigns">Back to campaigns</Link></p>
        </header>
      </Workspace>
    );
  }

  const money = role === "admin" || role === "finance";
  const operations = role === "admin" || role === "specialists";
  const showViews = role !== "admin";

  function move(record, index) {
    const result = progressMove(record, index, role);
    if (!result.ok) {
      setNotice(result.message);
      setRailNote({ id: record.id, message: result.message });
      return;
    }
    if (!result.patch && !result.post) return;
    setRailNote(null);
    if (result.post) {
      markPosted(record.id);
      setNotice("Marked posted in this browser.");
      return;
    }
    patchRecord(record.id, result.patch);
    setNotice("Progress updated in this browser.");
  }

  function nominate(event) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const creator = String(data.get("creator") || "");
    const program = String(data.get("program") || "");
    const owner = role === "specialists" && specialist !== "all" ? specialist : String(data.get("owner") || "Annie");
    if (!creator || !program) return;
    addNomination({ campaignId: campaign.id, creatorId: creator, program, owner });
    event.currentTarget.reset();
    setNotice("Nomination added in this browser. It starts at Pitching.");
  }

  return (
    <Workspace active="/campaigns">
      {notice ? <p className="notice">{notice}</p> : null}
      <header className="page-head">
        <p className="eyebrow">{campaign.client}</p>
        <h1>{campaign.name}</h1>
        <p className="lede">{campaign.description}</p>
      </header>
      <section className="stats" aria-label="Campaign summary">
        <div className="stat"><b>{campaign.campaignStatus}</b><span>{formatDate(campaign.start)} – {formatDate(campaign.end)}</span></div>
        <div className="stat"><b>{campaign.confirmed}/{campaign.targetKols}</b><span>On the tracker</span></div>
        <div className="stat"><b>{showViews ? formatNumber(records.reduce((sum, record) => sum + record.views, 0)) : campaign.posted}</b><span>{showViews ? "Generated views" : "Posted"}</span></div>
        <div className="stat"><b>{campaign.paymentStatus}</b><span>Brand payment</span></div>
      </section>
      {money ? (
        <section className="fact-grid" aria-label="Campaign money">
          <div className="fact"><span>Brand payment</span><b>{formatPeso(campaign.revenue)}</b></div>
          <div className="fact"><span>Creator cost</span><b>{formatPeso(campaign.creatorCost)}</b></div>
          <div className="fact"><span>Boosting</span><b>{formatPeso(campaign.boosting)}</b></div>
          <div className="fact"><span>VAT and other</span><b>{formatPeso(campaign.vat)}</b></div>
        </section>
      ) : null}
      {campaign.byProgram?.length > 1 ? (
        <>
          <div className="section-label"><h2>Programs</h2></div>
          <table>
            <thead>
              <tr>
                <th>Program</th>
                <th className="num">Nominations</th>
                <th className="num">On tracker</th>
                <th className="num">Posted</th>
                {showViews ? <th className="num">Generated views</th> : null}
                {money ? <th className="num">Creator cost</th> : null}
              </tr>
            </thead>
            <tbody>
              {campaign.byProgram.filter((row) => row.nominations > 0).map((row) => (
                <tr key={row.program}>
                  <td>{row.program}</td>
                  <td className="num">{row.nominations}</td>
                  <td className="num">{row.confirmed}</td>
                  <td className="num">{row.posted}</td>
                  {showViews ? <td className="num">{formatNumber(row.views)}</td> : null}
                  {money ? <td className="num">{formatPeso(row.creatorCost)}</td> : null}
                </tr>
              ))}
            </tbody>
          </table>
        </>
      ) : null}
      <div className="section-label">
        <h2>On the tracker</h2>
        {role === "admin" || role === "specialists" ? <Link href={{ pathname: "/creators", query: { from: campaign.id } }}>Find creators</Link> : null}
      </div>
      {tracker.length === 0 ? <p className="empty">No creator has cleared confirmation, KYNX approval, and brand approval.</p> : (
        <table>
          <thead>
            <tr>
              <th>Creator</th>
              <th>Program</th>
              <th>PIC</th>
                <th>Progress</th>
                <th>Stage</th>
                <th>Action</th>
              {showViews ? <th className="num">Generated views</th> : null}
              {money || role === "specialists" ? <th className="num">Rate</th> : null}
            </tr>
          </thead>
          <tbody>
            {tracker.map((record) => (
              <tr key={record.id}>
                <td>
                  <span className="who">
                    <Avatar name={record.creator.name} />
                    <span>
                      <Link href={creatorPath(record.id)}><b>{record.creator.name}</b></Link>
                      <span className="handle">@{record.creator.handle} · {record.tier} · {formatFollowers(record.creator.followers)}</span>
                    </span>
                  </span>
                </td>
                <td>{record.program}</td>
                <td>{record.owner}</td>
                <td><ProgressRail record={record} compact message={railNote?.id === record.id ? railNote.message : ""} onMove={(index) => move(record, index)} /></td>
                <td><span className="pill">{record.stage}</span></td>
                <td>{record.action}{record.late ? ` · ${record.late}d` : ""}</td>
                {showViews ? <td className="num">{formatNumber(record.views)}</td> : null}
                {money || role === "specialists" ? <td className="num">{formatRate(record.rate)}</td> : null}
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {pitching.length > 0 ? (
        <>
          <div className="section-label"><h2>Still outside the tracker</h2></div>
          <table>
            <thead>
              <tr>
                <th>Creator</th>
                <th>Program</th>
                <th>PIC</th>
                <th>Progress</th>
                <th>Where it sits</th>
              </tr>
            </thead>
            <tbody>
              {pitching.map((record) => (
                <tr key={record.id}>
                  <td><Link href={creatorPath(record.id)}><b>{record.creator.name}</b></Link><div className="handle">@{record.creator.handle}</div></td>
                  <td>{record.program}</td>
                  <td>{record.owner}</td>
                  <td><ProgressRail record={record} compact message={railNote?.id === record.id ? railNote.message : ""} onMove={(index) => move(record, index)} /></td>
                  <td><span className="pill">{record.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      ) : null}
      {operations ? (
        <form className="panel create-form" onSubmit={nominate} style={{ marginTop: 18 }}>
          <h2>Nominate a creator</h2>
          <p className="meta">The row starts as Pitching. These are the columns the client sheet shares. Affiliate details stay on the creator record. This public desk does not write the private sheet.</p>
          <div className="filters">
            <label>
              Creator
              <select name="creator" defaultValue="">
                <option value="" disabled>Choose</option>
                {creators.map((creator) => <option key={creator.id} value={creator.id}>{creator.name}</option>)}
              </select>
            </label>
            <label>
              Program
              <select name="program" defaultValue={campaign.programs[0] || ""}>
                {campaign.programs.map((program) => <option key={program}>{program}</option>)}
              </select>
            </label>
            <label>
              PIC
              <select name="owner" defaultValue={role === "specialists" && specialist !== "all" ? specialist : "Annie"}>
                {["Annie", "Nisha", "Daneca"].map((name) => <option key={name}>{name}</option>)}
              </select>
            </label>
          </div>
          <div className="button-row" style={{ justifyContent: "flex-start" }}>
            <button className="apply" type="submit">Add to campaign</button>
          </div>
        </form>
      ) : null}
    </Workspace>
  );
}
