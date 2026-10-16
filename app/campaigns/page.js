"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Workspace } from "../../components/Workspace";
import { CampaignDesk } from "../../components/CampaignDesk";
import { useRole } from "../../components/RoleProvider";
import { useLedger } from "../../lib/useLedger";
import { canSeeRecord } from "../../lib/roles";
import { campaignPath, href } from "../../lib/paths";
import { formatPeso } from "../../lib/format";

export default function CampaignsPage() {
  const router = useRouter();
  const [open, setOpen] = useState("");
  const [notice, setNotice] = useState("");
  const { role, creatorId, specialist } = useRole();
  const { listCampaigns, createCampaign } = useLedger();

  useEffect(() => {
    setOpen(new URLSearchParams(window.location.search).get("open") || "");
  }, []);

  if (open) return <CampaignDesk id={open} />;

  const campaigns = listCampaigns()
    .map((campaign) => ({ ...campaign, records: campaign.records.filter((record) => canSeeRecord(role, record, { creatorId, specialist })) }))
    .filter((campaign) => role === "admin" || role === "finance" || role === "specialists" || (role === "brands" && campaign.brand === "Shopee") || campaign.records.length > 0);

  function openCampaign(event) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const id = createCampaign({
      name: data.get("name"),
      client: data.get("client"),
      objective: data.get("objective"),
      start: data.get("start"),
      end: data.get("end"),
      target: data.get("target"),
      programs: data.get("programs"),
      revenue: data.get("revenue"),
      boosting: data.get("boosting"),
      vat: data.get("vat"),
      brand: "Shopee",
    });
    if (!id) {
      setNotice("Name the campaign first.");
      return;
    }
    const route = campaignPath(id);
    window.history.pushState(null, "", href(route));
    setOpen(id);
    router.replace(route);
  }

  return (
    <Workspace active="/campaigns">
      <header className="page-head">
        <p className="eyebrow">Work</p>
        <h1>Campaigns</h1>
        <p className="lede">One row per campaign. Programs live inside it. The shared nomination columns match the client sheet. Affiliate details stay internal. Edits stay in this browser. Amounts here are samples.</p>
      </header>
      {notice ? <p className="notice">{notice}</p> : null}
      {role === "admin" ? (
        <form className="panel create-form" onSubmit={openCampaign}>
          <h2>Open a campaign</h2>
          <p className="meta">Admin only. The new campaign stays in this browser and specialists can nominate into it.</p>
          <div className="filters">
            <label>Name<input name="name" required placeholder="November Shopee Campaigns" /></label>
            <label>Client<input name="client" placeholder="BM Shopee" /></label>
            <label>
              Objective
              <select name="objective" defaultValue="Awareness">
                <option>Awareness</option>
                <option>Acquisition</option>
              </select>
            </label>
            <label>Start<input name="start" type="date" defaultValue="2026-11-01" /></label>
            <label>End<input name="end" type="date" defaultValue="2026-11-30" /></label>
            <label>Target creators<input name="target" type="number" min="0" step="1" defaultValue="10" /></label>
            <label>Programs<input name="programs" placeholder="Shopee VIP, Pinakamurang Data - Piso" /></label>
            <label>Brand payment<input name="revenue" type="number" min="0" step="1" placeholder="0" /></label>
            <label>Boosting<input name="boosting" type="number" min="0" step="1" placeholder="0" /></label>
            <label>VAT<input name="vat" type="number" min="0" step="1" placeholder="0" /></label>
          </div>
          <div className="button-row" style={{ justifyContent: "flex-start" }}>
            <button className="apply" type="submit">Create campaign</button>
          </div>
        </form>
      ) : null}
      <div className="campaign-list">
        {campaigns.map((campaign) => (
          <article key={campaign.id} className="campaign-row">
            <div>
              <h3><Link href={campaignPath(campaign.id)}>{campaign.name}</Link></h3>
              <p className="meta">{campaign.client} · {campaign.objective} · {campaign.owner}</p>
            </div>
            <div>
              <span className="pill">{campaign.campaignStatus}</span>
              <p className="meta">{campaign.paymentStatus} · {campaign.confirmed} on the tracker · {campaign.posted} posted</p>
            </div>
            <div>
              {role === "admin" || role === "finance" ? (
                <>
                  <b>{formatPeso(campaign.gross)}</b>
                  <p className="meta">{Math.round(campaign.margin * 100)}% after creator cost, boosting, and VAT</p>
                </>
              ) : (
                <>
                  <b>{campaign.confirmed}/{campaign.targetKols}</b>
                  <p className="meta">{campaign.posted} posted</p>
                </>
              )}
            </div>
            <div className="actions">
              <Link href={campaignPath(campaign.id)}>Open</Link>
            </div>
          </article>
        ))}
      </div>
    </Workspace>
  );
}
