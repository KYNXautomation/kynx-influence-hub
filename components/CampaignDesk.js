"use client";

import Link from "next/link";
import { Workspace } from "./Workspace";
import { useLedger } from "../lib/useLedger";
import { formatFollowers, formatNumber, formatPeso } from "../lib/format";

export function CampaignDesk({ id }) {
  const { getCampaign } = useLedger();
  const campaign = getCampaign(id);

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

  return (
    <Workspace active="/campaigns">
      <header className="page-head">
        <p className="eyebrow">{campaign.brand}</p>
        <h1>{campaign.name}</h1>
        <p className="lede">{campaign.description}</p>
      </header>
      <section className="stats" aria-label="Campaign summary">
        <div className="stat"><b>{campaign.owner}</b><span>Lead specialist</span></div>
        <div className="stat"><b>{formatPeso(campaign.budget)}</b><span>Sample budget</span></div>
        <div className="stat"><b>{formatNumber(campaign.views)}</b><span>Documented views</span></div>
        <div className="stat"><b>{campaign.records.length}</b><span>Creator records</span></div>
      </section>
      <div className="section-label">
        <h2>Creator records</h2>
        <Link href={{ pathname: "/creators", query: { niche: campaign.category || undefined, min: campaign.minFollowers || undefined, from: campaign.id } }}>
          Find creators
        </Link>
      </div>
      {campaign.applicationsOpen ? <p className="banner">Applications are open on this sample campaign. Records you already have stay in this browser.</p> : null}
      {campaign.records.length === 0 ? <p className="empty">No creator records on this campaign yet.</p> : (
        <table>
          <thead>
            <tr>
              <th>Creator</th>
              <th>Specialist</th>
              <th>Status</th>
              <th className="num">Published</th>
              <th className="num">Views</th>
              <th className="num">Rate</th>
            </tr>
          </thead>
          <tbody>
            {campaign.records.map((record) => (
              <tr key={record.id}>
                <td>
                  <span className="who">
                    <Link href={`/creators/${record.id}`}><b>{record.creator.name}</b></Link>
                    <span className="handle">@{record.creator.handle} · {formatFollowers(record.creator.followers)}</span>
                  </span>
                </td>
                <td>{record.owner}</td>
                <td><span className="pill">{record.status}</span></td>
                <td className="num">{record.publishedCount}/{record.deliverables.length}</td>
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
