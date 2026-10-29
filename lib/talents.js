import { creators, deskToday } from "./model";

export const talentManagers = ["Bea", "Carlo", "Jaz"];
export const contractOptions = ["Exclusive", "Non-exclusive", "Prospect", "Inactive"];
export const rateChannels = [["tiktok", "TikTok"], ["instagram", "Instagram"], ["facebook", "Facebook"]];

const seedEnds = ["2027-03-31", "2026-11-15", "2027-06-30", "2026-11-20", "2027-01-31"];

// Starting profile for every creator already in the model, spread across the managers.
export function seedTalents() {
  return creators.map((creator, index) => {
    const exclusive = creator.showcase === true;
    return {
      id: creator.id,
      creatorId: creator.id,
      manager: talentManagers[index % talentManagers.length],
      contract: exclusive ? "Exclusive" : "Non-exclusive",
      contractEnd: exclusive ? seedEnds[index % seedEnds.length] : "",
      onLeave: false,
      rates: { tiktok: 0, instagram: 0, facebook: 0 },
      email: "",
      phone: "",
      notes: "",
    };
  });
}

export function blankTalent(manager) {
  return {
    id: `t${Date.now()}`,
    creatorId: "",
    name: "",
    handle: "",
    niche: "Lifestyle",
    followers: 0,
    manager: manager || talentManagers[0],
    contract: "Prospect",
    contractEnd: "",
    onLeave: false,
    rates: { tiktok: 0, instagram: 0, facebook: 0 },
    email: "",
    phone: "",
    notes: "",
  };
}

// Days until the contract ends, or null when there is no end date.
export function daysLeft(contractEnd) {
  if (!contractEnd) return null;
  const end = Date.parse(`${contractEnd}T00:00:00Z`);
  const today = Date.parse(`${deskToday}T00:00:00Z`);
  if (!Number.isFinite(end)) return null;
  return Math.round((end - today) / 86_400_000);
}

// Joins a saved talent with its creator profile and the tracker rows for that creator.
export function presentTalent(talent, records) {
  const creator = creators.find((item) => item.id === talent.creatorId);
  const rows = talent.creatorId ? records.filter((record) => record.creatorId === talent.creatorId) : [];
  const live = rows.filter((record) => record.kolConfirmation !== "Dropped" && !record.postDate);
  // One line per ongoing booking: still active and not posted yet.
  const ongoing = live
    .filter((record) => record.kolConfirmation !== "Rejected" && record.kynxApproval !== "Rejected")
    .map((record) => ({
      recordId: record.id,
      campaignId: record.campaign.id,
      name: record.campaign.name,
      brand: record.campaign.brand,
      program: record.program,
      stage: record.stage,
      postDue: record.postDue,
    }));
  const left = daysLeft(talent.contractEnd);
  const campaigns = [];
  rows.forEach((record) => {
    if (!campaigns.some((item) => item.id === record.campaign.id)) campaigns.push({ id: record.campaign.id, name: record.campaign.name });
  });
  return {
    ...talent,
    name: creator?.name || talent.name || "Unnamed talent",
    handle: creator?.handle ?? talent.handle ?? "",
    niche: creator?.niche || talent.niche || "Lifestyle",
    followers: creator?.followers ?? talent.followers ?? 0,
    availability: talent.onLeave ? "On leave" : live.length ? "On a campaign" : "Available",
    liveCount: live.length,
    views: rows.reduce((sum, record) => sum + record.views, 0),
    campaigns,
    ongoing,
    daysLeft: left,
    endingSoon: left !== null && left <= 30,
  };
}
