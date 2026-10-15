"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Workspace } from "../../components/Workspace";
import { useLedger } from "../../lib/useLedger";
import { href } from "../../lib/paths";
import { formatFollowers, formatNumber, formatPeso } from "../../lib/format";

function numberParam(value, fallback) {
  if (value === undefined || value === null || value === "") return fallback;
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function CreatorsBrowser() {
  const router = useRouter();
  const [params, setParams] = useState(new URLSearchParams());

  useEffect(() => {
    setParams(new URLSearchParams(window.location.search));
  }, []);
  const { listCreators, listNiches, getCampaign } = useLedger();
  const niche = params.get("niche") || "";
  const q = params.get("q") || "";
  const sort = params.get("sort") || "followers_desc";
  let min = numberParam(params.get("min"), 0);
  let max = numberParam(params.get("max"), 100_000_000);
  if (min > max) [min, max] = [max, min];
  const from = numberParam(params.get("from"), 0);
  const campaign = from ? getCampaign(from) : null;
  const niches = listNiches();
  const creators = listCreators({ niche, min, max, q, sort });
  const minLabel = min > 0 ? `${formatFollowers(min)}+` : "any reach";
  const nicheLabel = niche || "every niche";

  function applyFilters(event) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const query = { sort: String(data.get("sort") || "followers_desc") };
    const search = String(data.get("q") || "").trim();
    const selectedNiche = String(data.get("niche") || "");
    const minimum = String(data.get("min") || "");
    const maximum = String(data.get("max") || "");
    const campaignId = String(data.get("from") || "");
    if (search) query.q = search;
    if (selectedNiche) query.niche = selectedNiche;
    if (minimum) query.min = minimum;
    if (maximum) query.max = maximum;
    if (campaignId) query.from = campaignId;
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
        <p className="lede">Search by name, then narrow to a niche and a TikTok follower range.</p>
      </header>
      {campaign ? (
        <p className="banner">
          <strong>{campaign.name}</strong> for {campaign.client_name} needs {campaign.niche} creators
          {campaign.min_tiktok_followers > 0 ? ` with at least ${formatFollowers(campaign.min_tiktok_followers)} TikTok followers` : ""}.
        </p>
      ) : null}
      <form className="filters" onSubmit={applyFilters}>
        {from ? <input type="hidden" name="from" value={from} /> : null}
        <label>
          Search
          <input name="q" defaultValue={q} placeholder="Name or handle" />
        </label>
        <label>
          Niche
          <select name="niche" defaultValue={niche}>
            <option value="">All niches</option>
            {niches.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
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
      <p className="result-line">
        {creators.length} {creators.length === 1 ? "creator" : "creators"} · {nicheLabel} · {minLabel}
      </p>
      {creators.length === 0 ? (
        <p className="empty">No creators match that niche and follower range.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Creator</th>
              <th>Niche</th>
              <th className="num">TikTok followers</th>
              <th className="num">Views generated</th>
              <th className="num">Rate</th>
            </tr>
          </thead>
          <tbody>
            {creators.map((creator) => (
              <tr key={creator.id}>
                <td>
                  <span className="who">
                    <Link href={`/creators/${creator.id}`}><b>{creator.name}</b></Link>
                    <span className="handle">@{creator.handle} · {creator.location}</span>
                  </span>
                </td>
                <td>{creator.niches}</td>
                <td className="num" title={`${formatNumber(creator.tiktok_followers)} followers`}>
                  {formatFollowers(creator.tiktok_followers)}
                </td>
                <td className="num">{formatNumber(creator.views_generated)}</td>
                <td className="num">{formatPeso(creator.rate_php)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </Workspace>
  );
}

export default function CreatorsPage() {
  return <CreatorsBrowser />;
}
