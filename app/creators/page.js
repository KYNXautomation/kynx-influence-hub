"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Workspace } from "../../components/Workspace";
import { Avatar } from "../../components/Avatar";
import { useRole } from "../../components/RoleProvider";
import { useLedger } from "../../lib/useLedger";
import { canSeeRecord } from "../../lib/roles";
import { categoryOptions } from "../../lib/model";
import { href } from "../../lib/paths";
import { formatFollowers, formatNumber, formatPeso } from "../../lib/format";

function numberParam(value, fallback) {
  if (value === undefined || value === null || value === "") return fallback;
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

export default function CreatorsPage() {
  const router = useRouter();
  const [params, setParams] = useState(new URLSearchParams());

  useEffect(() => {
    setParams(new URLSearchParams(window.location.search));
  }, []);

  const { role, creatorId, specialist } = useRole();
  const { listRecords, getCampaign } = useLedger();
  const niche = params.get("niche") || "";
  const brand = params.get("brand") || "";
  const q = params.get("q") || "";
  const sort = params.get("sort") || "followers_desc";
  let min = numberParam(params.get("min"), 0);
  let max = numberParam(params.get("max"), 100_000_000);
  if (min > max) [min, max] = [max, min];
  const from = params.get("from") || "";
  const campaign = from ? getCampaign(from) : null;
  const records = listRecords({ niche, min, max, q, brand, sort }).filter((record) => canSeeRecord(role, record, { creatorId, specialist }));

  function applyFilters(event) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const query = { sort: String(data.get("sort") || "followers_desc") };
    ["q", "niche", "brand", "min", "max", "from"].forEach((key) => {
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
        <p className="lede">One row is one creator on one campaign. Filter by category, brand, and TikTok followers.</p>
      </header>
      {campaign ? (
        <p className="banner">
          <strong>{campaign.name}</strong> for {campaign.brand}
          {campaign.category ? ` looks for ${campaign.category} creators` : ""}
          {campaign.minFollowers > 0 ? ` with at least ${formatFollowers(campaign.minFollowers)} TikTok followers` : ""}.
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
          Brand
          <select name="brand" defaultValue={brand}>
            <option value="">All brands</option>
            <option>Shopee</option>
            <option>Demo brand</option>
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
      <p className="result-line">{records.length} {records.length === 1 ? "record" : "records"}</p>
      {records.length === 0 ? <p className="empty">No creators match that category and follower range.</p> : (
        <table>
          <thead>
            <tr>
              <th>Creator</th>
              <th>Campaign</th>
              <th>Category</th>
              <th className="num">TikTok followers</th>
              <th>Status</th>
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
                      <Link href={`/creators/${record.id}`}><b>{record.creator.name}</b></Link>
                      <span className="handle">@{record.creator.handle} · {record.creator.location}</span>
                    </span>
                  </span>
                </td>
                <td><Link href={`/campaigns/${record.campaign.id}`}>{record.campaign.name}</Link></td>
                <td>{record.categoryLabel}</td>
                <td className="num">{formatFollowers(record.creator.followers)}</td>
                <td><span className="pill">{record.status}</span></td>
                <td className="num">{formatNumber(record.views)}</td>
                <td className="num">{formatPeso(record.rate)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </Workspace>
  );
}
