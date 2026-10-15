"use client";

import { useState } from "react";
import Link from "next/link";
import { Workspace } from "../../components/Workspace";
import { useLedger } from "../../lib/useLedger";
import { formatPeso } from "../../lib/format";

export default function PaymentsPage() {
  const { listRecords, markPaid } = useLedger();
  const records = listRecords({ sort: "name" });
  const ready = records.filter((record) => record.status === "Ready to pay");
  const [notice, setNotice] = useState("");

  function exportRecords() {
    const header = ["Creator", "Handle", "Campaign", "Status", "Rate", "Blockers"];
    const lines = records.map((record) => [record.creator.name, record.creator.handle, record.campaign.name, record.status, record.rate, record.blockers.join("; ")]);
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
        <p className="eyebrow">Payments</p>
        <h1>Ready when the record is clear</h1>
        <p className="lede">Payment tracking comes before payment execution. {ready.length} sample records are cleared. Nothing here sends money.</p>
      </header>
      {notice ? <p className="notice">{notice}</p> : null}
      <div className="section-label">
        <h2>{formatPeso(ready.reduce((sum, record) => sum + record.rate, 0))} ready</h2>
        <button className="ghost" type="button" onClick={exportRecords}>Export payment records</button>
      </div>
      <table>
        <thead>
          <tr>
            <th>Creator</th>
            <th>Campaign</th>
            <th>Status</th>
            <th className="num">Rate</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {records.map((record) => (
            <tr key={record.id}>
              <td>
                <Link href={`/creators/${record.id}`}><b>{record.creator.name}</b></Link>
                <div className="handle">@{record.creator.handle}</div>
              </td>
              <td>{record.campaign.name}</td>
              <td>
                <span className="pill">{record.status}</span>
                {record.blockers.length > 0 ? <div className="handle">{record.blockers[0]}</div> : null}
              </td>
              <td className="num">{formatPeso(record.rate)}</td>
              <td className="num">
                {record.status === "Ready to pay" ? (
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
