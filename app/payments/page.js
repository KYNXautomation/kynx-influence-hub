"use client";

import { useState } from "react";
import Link from "next/link";
import { Workspace } from "../../components/Workspace";
import { useLedger } from "../../lib/useLedger";
import { formatPeso, formatRate } from "../../lib/format";
import { campaignPath, creatorPath } from "../../lib/paths";

export default function PaymentsPage() {
  const { listCampaigns, listRecords, markPaid, setCampaignPayment } = useLedger();
  const campaigns = listCampaigns();
  const creators = listRecords({ sort: "name" }).filter((record) => record.onTracker);
  const ready = creators.filter((record) => record.payStatus === "Ready to pay");
  const [notice, setNotice] = useState("");

  function exportRecords() {
    const header = ["Creator", "Handle", "Program", "Stage", "Pay status", "Rate", "Blockers"];
    const lines = creators.map((record) => [record.creator.name, record.creator.handle, record.program, record.stage, record.payStatus, record.rate, record.blockers.join("; ")]);
    const csv = [header, ...lines].map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "kynx-payment-records.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <Workspace active="/payments">
      <header className="page-head">
        <p className="eyebrow">Finance</p>
        <h1>Brand payment, then creator cost</h1>
        <p className="lede">A creator rate counts after confirmation, KYNX approval, and brand approval. Sample amounts only. Nothing here sends money.</p>
      </header>
      {notice ? <p className="notice">{notice}</p> : null}
      <div className="section-label"><h2>Campaigns</h2></div>
      <table>
        <thead>
          <tr>
            <th>Campaign</th>
            <th>Client</th>
            <th>Payment</th>
            <th className="num">Brand payment</th>
            <th className="num">Creator cost</th>
            <th className="num">Boosting</th>
            <th className="num">VAT</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {campaigns.map((campaign) => (
            <tr key={campaign.id}>
              <td><Link href={campaignPath(campaign.id)}><b>{campaign.name}</b></Link></td>
              <td>{campaign.client}</td>
              <td><span className="pill">{campaign.paymentStatus}</span></td>
              <td className="num">{formatPeso(campaign.revenue)}</td>
              <td className="num">{formatPeso(campaign.creatorCost)}</td>
              <td className="num">{formatPeso(campaign.boosting)}</td>
              <td className="num">{formatPeso(campaign.vat)}</td>
              <td className="num">
                {campaign.paymentStatus !== "Paid" ? (
                  <button className="save" type="button" onClick={() => { setCampaignPayment(campaign.id, "Paid"); setNotice(`${campaign.name} marked paid in this browser.`); }}>Mark paid</button>
                ) : null}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="section-label">
        <h2>{formatPeso(ready.reduce((sum, record) => sum + record.rate, 0))} ready for creators</h2>
        <button className="ghost" type="button" onClick={exportRecords}>Export creator cost</button>
      </div>
      <table>
        <thead>
          <tr>
            <th>Creator</th>
            <th>Program</th>
            <th>Stage</th>
            <th>Pay status</th>
            <th className="num">Rate</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {creators.map((record) => (
            <tr key={record.id}>
              <td>
                <Link href={creatorPath(record.id)}><b>{record.creator.name}</b></Link>
                <div className="handle">@{record.creator.handle}</div>
              </td>
              <td>{record.program}</td>
              <td>{record.stage}</td>
              <td>
                <span className="pill">{record.payStatus}</span>
                {record.payStatus !== "Ready to pay" && record.payStatus !== "Paid" ? <div className="handle">{record.blockers[0]}</div> : null}
              </td>
              <td className="num">{formatRate(record.rate)}</td>
              <td className="num">
                {record.payStatus === "Ready to pay" ? (
                  <button className="save" type="button" onClick={() => { markPaid(record.id); setNotice(`${record.creator.name} marked paid in this browser.`); }}>Mark paid</button>
                ) : null}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Workspace>
  );
}
