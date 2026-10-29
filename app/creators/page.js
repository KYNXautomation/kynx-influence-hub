"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Workspace } from "../../components/Workspace";
import { CreatorDesk } from "../../components/CreatorDesk";
import { Avatar } from "../../components/Avatar";
import { useRole } from "../../components/RoleProvider";
import { useLedger } from "../../lib/useLedger";
import { canSeeRecord } from "../../lib/roles";
import { categoryOptions } from "../../lib/model";
import { creatorPath, href } from "../../lib/paths";
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
  const [editingId, setEditingId] = useState("");

  useEffect(() => {
    setParams(new URLSearchParams(window.location.search));
  }, []);

  const { role, creatorId, specialist } = useRole();
  const { listRecords, getCampaign, patchRecord } = useLedger();
  const niche = params.get("niche") || "";
  const q = params.get("q") || "";
  const sort = params.get("sort") || "followers_desc";
  let min = numberParam(params.get("min"), 0);
  let max = numberParam(params.get("max"), 100_000_000);
  if (min > max) [min, max] = [max, min];
  const from = params.get("from") || "";
  const campaign = from ? getCampaign(from) : null;
  const records = listRecords({ niche, min, max, q, sort }).filter((record) => canSeeRecord(role, record, { creatorId, specialist }));
  const openRecord = params.get("record") || "";

  if (openRecord) return <CreatorDesk id={openRecord} />;

  const canEditRate = role === "admin" || role === "specialists" || role === "creators";

  function saveRate(event, record) {
    event.preventDefault();
    const rate = Math.round(Number(new FormData(event.currentTarget).get("rate")));
    if (!Number.isInteger(rate) || rate < 0) {
      setNotice("Check the rate, then save again.");
      return;
    }
    patchRecord(record.id, { rate });
    setEditingId("");
    setNotice("Rate saved in this browser.");
  }

  function applyFilters(event) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const query = { sort: String(data.get("sort") || "followers_desc") };
    ["q", "niche", "min", "max", "from"].forEach((key) => {
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
        <p className="lede">Hover a rate to edit it. Campaigns lists every campaign that creator joined, including ones still going.</p>
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
            {role === "admin" ? null : <option value="views_desc">Views generated</option>}
            <option value="name">Name</option>
          </select>
        </label>
        <button className="apply" type="submit">Apply</button>
      </form>
      {notice ? <p className="notice">{notice}</p> : null}
      <p className="result-line">{records.length} {records.length === 1 ? "record" : "records"}</p>
      {records.length === 0 ? <p className="empty">No creators match that category and follower range.</p> : (
        <table className={`roster cols-${role === "admin" ? 6 : 7}`}>
          <thead>
            <tr>
              <th>Creator</th>
              <th>PIC</th>
              <th>Tier</th>
              <th>Niche</th>
              <th>Rate</th>
              <th>Campaigns</th>
              {role === "admin" ? null : <th>Generated views</th>}
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
                <td>{record.owner}</td>
                <td>{record.tier}<div className="handle">{formatFollowers(record.creator.followers)}</div></td>
                <td>{record.categoryLabel || record.creator.niche}</td>
                <td>
                  {role === "brands" ? "—" : editingId === record.id && canEditRate ? (
                    <form className="inline-form" onSubmit={(event) => saveRate(event, record)}>
                      <input aria-label={`Rate for ${record.creator.name}`} name="rate" type="number" min="0" step="1" defaultValue={record.rate || ""} key={`${record.id}-${record.rate}`} autoFocus />
                      <button className="save" type="submit">Save</button>
                    </form>
                  ) : canEditRate ? (
                    <button className="rate-cell" type="button" onClick={() => setEditingId(record.id)}>
                      <span className="rate-value">{formatRate(record.rate)}</span>
                      <span className="rate-edit">Edit rate</span>
                    </button>
                  ) : formatRate(record.rate)}
                </td>
                <td>
                  {(record.participated || []).length === 0 ? "—" : (record.participated || []).map((item) => item.name).join(", ")}
                </td>
                {role === "admin" ? null : <td>{formatNumber(record.views)}</td>}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </Workspace>
  );
}
