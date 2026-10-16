"use client";

import Link from "next/link";
import { Workspace } from "./Workspace";
import { Avatar } from "./Avatar";
import { useRole } from "./RoleProvider";
import { useLedger } from "../lib/useLedger";
import { canSeeRecord } from "../lib/roles";
import { formatDate, formatFollowers, formatNumber, formatPeso, formatRate } from "../lib/format";

export function CampaignDesk({ id }) {
  const { role, creatorId, specialist } = useRole();
  const { getCampaign } = useLedger();
  const campaign = getCampaign(id);
  const records = campaign ? campaign.records.filter((record) => canSeeRecord(role, record, { creatorId, specialist })) : [];
  const tracker = records.filter((record) => record.onTracker);
  const pitching = records.filter((record) => !record.onTracker);

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

  return (
    <Workspace active="/campaigns">
      <header className="page-head">
        <p className="eyebrow">{campaign.client}</p>
        <h1>{campaign.name}</h1>
        <p className="lede">{campaign.description}</p>
      </header>
      <section className="stats" aria-label="Campaign summary">
        <div className="stat"><b>{campaign.campaignStatus}</b><span>{formatDate(campaign.start)} – {formatDate(campaign.end)}</span></div>
        <div className="stat"><b>{campaign.confirmed}/{campaign.targetKols}</b><span>On the tracker</span></div>
        <div className="stat"><b>{formatNumber(records.reduce((sum, record) => sum + record.views, 0))}</b><span>Generated views</span></div>
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
                <th className="num">Generated views</th>
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
                  <td className="num">{formatNumber(row.views)}</td>
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
              <th>Stage</th>
              <th>Action</th>
              <th className="num">Generated views</th>
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
                      <Link href={`/creators/${record.id}`}><b>{record.creator.name}</b></Link>
                      <span className="handle">@{record.creator.handle} · {record.tier} · {formatFollowers(record.creator.followers)}</span>
                    </span>
                  </span>
                </td>
                <td>{record.program}</td>
                <td>{record.owner}</td>
                <td><span className="pill">{record.stage}</span></td>
                <td>{record.action}{record.late ? ` · ${record.late}d` : ""}</td>
                <td className="num">{formatNumber(record.views)}</td>
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
                <th>Where it sits</th>
              </tr>
            </thead>
            <tbody>
              {pitching.map((record) => (
                <tr key={record.id}>
                  <td><Link href={`/creators/${record.id}`}><b>{record.creator.name}</b></Link><div className="handle">@{record.creator.handle}</div></td>
                  <td>{record.program}</td>
                  <td>{record.owner}</td>
                  <td><span className="pill">{record.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      ) : null}
    </Workspace>
  );
}
