"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Workspace } from "../../components/Workspace";
import { CreatorDesk } from "../../components/CreatorDesk";
import { Avatar } from "../../components/Avatar";
import { ProgressRail } from "../../components/ProgressRail";
import { useRole } from "../../components/RoleProvider";
import { useLedger } from "../../lib/useLedger";
import { canSeeRecord } from "../../lib/roles";
import { categoryOptions } from "../../lib/model";
import { creatorPath, href } from "../../lib/paths";
import { progressMove } from "../../lib/progress";
import { formatFollowers, formatNumber, formatRate } from "../../lib/format";

function numberParam(value, fallback) {
  if (value === undefined || value === null || value === "") return fallback;
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

export default function CreatorsPage() {
  const router = useRouter();
  const [params, setParams] = useState(new URLSearchParams());
  const [notice, setNotice] = useState("");
  const [railNote, setRailNote] = useState(null);

  useEffect(() => {
    setParams(new URLSearchParams(window.location.search));
  }, []);

  const { role, creatorId, specialist } = useRole();
  const { listRecords, getCampaign, listCampaigns, patchRecord, markPosted } = useLedger();
  const niche = params.get("niche") || "";
  const program = params.get("program") || "";
  const stage = params.get("stage") || "";
  const q = params.get("q") || "";
  const sort = params.get("sort") || "followers_desc";
  let min = numberParam(params.get("min"), 0);
  let max = numberParam(params.get("max"), 100_000_000);
  if (min > max) [min, max] = [max, min];
  const from = params.get("from") || "";
  const campaign = from ? getCampaign(from) : null;
  const records = listRecords({ niche, min, max, q, program, stage, sort }).filter((record) => canSeeRecord(role, record, { creatorId, specialist }));
  const programChoices = [...new Set(listCampaigns().flatMap((campaign) => campaign.programs || []))];
  const openRecord = params.get("record") || "";

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

  if (openRecord) return <CreatorDesk id={openRecord} />;

  function applyFilters(event) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const query = { sort: String(data.get("sort") || "followers_desc") };
    ["q", "niche", "program", "stage", "min", "max", "from"].forEach((key) => {
      const value = String(data.get(key) || "").trim();
      if (value) query[key] = value;
    });
    const text = new URLSearchParams(query).toString();
    const route = text ? `/creators?${text}` : "/creators";
    window.history.pushState(null, "", href(route));
    setParams(new URLSearchParams(text));
    router.replace(route);
  }

  return (
    <Workspace active="/creators">
      <header className="page-head">
        <p className="eyebrow">Roster</p>
        <h1>Creators</h1>
        <p className="lede">Slide a creator along the shared steps: pitch, confirmation, KYNX, brand, draft, and post. Affiliate details stay on the internal form and never appear for the brand.</p>
      </header>
      {campaign ? (
        <p className="banner">
          <strong>{campaign.name}</strong> for {campaign.brand}
          {campaign.minFollowers > 0 ? ` looks for creators with at least ${formatFollowers(campaign.minFollowers)} TikTok followers` : ""}.
        </p>
      ) : null}
      <form className="filters" onSubmit={applyFilters}>
        {from ? <input type="hidden" name="from" value={from} /> : null}
        <label>
          Search
          <input name="q" defaultValue={q} placeholder="Name, handle, or campaign" />
        </label>
        <label>
          Category
          <select name="niche" defaultValue={niche}>
            <option value="">All categories</option>
            {categoryOptions.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </label>
        <label>
          Program
          <select name="program" defaultValue={program}>
            <option value="">All programs</option>
            {programChoices.map((item) => <option key={item}>{item}</option>)}
          </select>
        </label>
        <label>
          Stage
          <select name="stage" defaultValue={stage}>
            <option value="">All stages</option>
            {["Pitching", "Awaiting KYNX", "Awaiting brand", "Negotiating", "Pending draft", "Draft submitted", "Under revision", "Approved for posting", "Posted", "Dropped", "Rejected"].map((item) => <option key={item}>{item}</option>)}
          </select>
        </label>
        <label>
          Min followers
          <input name="min" type="number" min="0" step="1000" defaultValue={params.get("min") || ""} placeholder="0" />
        </label>
        <label>
          Max followers
          <input name="max" type="number" min="0" step="1000" defaultValue={params.get("max") || ""} placeholder="Any" />
        </label>
        <label>
          Sort
          <select name="sort" defaultValue={sort}>
            <option value="followers_desc">Followers, high to low</option>
            <option value="followers_asc">Followers, low to high</option>
            <option value="views_desc">Views generated</option>
            <option value="name">Name</option>
          </select>
        </label>
        <button className="apply" type="submit">Apply</button>
      </form>
      {notice ? <p className="notice">{notice}</p> : null}
      <p className="result-line">{records.length} {records.length === 1 ? "record" : "records"}</p>
      {records.length === 0 ? <p className="empty">No creators match that category and follower range.</p> : (
        <table>
          <thead>
            <tr>
              <th>Creator</th>
              <th>Program</th>
              <th>Tier</th>
              <th>PIC</th>
              <th>Progress</th>
              <th>Stage</th>
              <th className="num">Generated views</th>
              <th className="num">Rate</th>
            </tr>
          </thead>
          <tbody>
            {records.map((record) => (
              <tr key={record.id}>
                <td>
                  <span className="who">
                    <Avatar name={record.creator.name} />
                    <span>
                      <Link href={creatorPath(record.id)}><b>{record.creator.name}</b></Link>
                      <span className="handle">@{record.creator.handle} · {record.creator.location}</span>
                    </span>
                  </span>
                </td>
                <td>{record.program}</td>
                <td>{record.tier}<div className="handle">{formatFollowers(record.creator.followers)}</div></td>
                <td>{record.owner}</td>
                <td><ProgressRail record={record} compact message={railNote?.id === record.id ? railNote.message : ""} onMove={(index) => move(record, index)} /></td>
                <td><span className="pill">{record.status}</span>{record.action && record.onTracker ? <div className="handle">{record.action}</div> : null}</td>
                <td className="num">{formatNumber(record.views)}</td>
                <td className="num">{role === "brands" ? "—" : formatRate(record.rate)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </Workspace>
  );
}
