export const deskToday = "2026-10-16";

export const categoryOptions = [
  "Beauty",
  "Fashion",
  "Lifestyle",
  "Food",
  "Tech",
  "Gaming",
  "Student life",
  "Travel",
  "Fitness",
  "Parenting",
  "Entertainment",
];

export const programs = [
  "Shopee VIP",
  "Shopee VIP+",
  "Shopee VIP Rewards for Referrals",
  "Pinakamurang Data - Piso",
  "Pinakamurang Data - Piso / 10% Data",
];

export const campaigns = [
  {
    id: "october",
    name: "October Shopee Campaigns",
    short: "October",
    brand: "Shopee",
    client: "BM Shopee",
    objective: "Awareness",
    description: "One October file. Each program stays inside this campaign. Only this campaign routes to the client sheet.",
    start: "2026-10-01",
    end: "2026-10-31",
    paymentStatus: "Processing",
    paymentDate: "",
    targetKols: 16,
    revenue: 480000,
    boosting: 42000,
    vat: 57600,
    owner: "Annie",
    campaignStatus: "Active",
    programs,
    category: "",
    minFollowers: 10000,
  },
  {
    id: "tto-may",
    name: "Shopee TTO · May",
    short: "TTO May",
    brand: "Shopee",
    client: "EXT Shopee",
    objective: "Acquisition",
    description: "Completed history. Those bookings stay on the old tracker and are not retyped into pitching.",
    start: "2026-05-01",
    end: "2026-05-31",
    paymentStatus: "Paid",
    paymentDate: "2026-07-15",
    targetKols: 40,
    revenue: 220000,
    boosting: 0,
    vat: 26400,
    creatorCost: 86000,
    owner: "Nisha",
    campaignStatus: "Completed",
    programs: ["Shopee TTO"],
    category: "",
    minFollowers: 0,
  },
];

export const creators = [
  { id: "c01", name: "Maya Santos", handle: "mayamakes", niche: "Lifestyle", followers: 86400, location: "Quezon City" },
  { id: "c02", name: "Leo Reyes", handle: "leofinds", niche: "Tech", followers: 124000, location: "Cebu" },
  { id: "c03", name: "Sofia Cruz", handle: "sofiasunday", niche: "Beauty", followers: 42800, location: "Manila" },
  { id: "c04", name: "Eli Navarro", handle: "everydayeli", niche: "Lifestyle", followers: 217000, location: "Makati" },
  { id: "c05", name: "Isla Mendoza", handle: "islaeats", niche: "Food", followers: 65400, location: "Davao" },
  { id: "c06", name: "Noah Flores", handle: "noahplays", niche: "Gaming", followers: 312000, location: "Pasig" },
  { id: "c07", name: "Chloe Lim", handle: "chloeincolor", niche: "Fashion", followers: 98300, location: "Manila" },
  { id: "c08", name: "Luca Garcia", handle: "lucaliving", niche: "Lifestyle", followers: 8200, location: "Baguio" },
  { id: "c09", name: "Amara Tan", handle: "amarastudio", niche: "Beauty", followers: 156000, location: "Makati" },
  { id: "c10", name: "Finn Ramos", handle: "finntalks", niche: "Student life", followers: 58200, location: "Quezon City" },
  { id: "c11", name: "Zoe Rivera", handle: "zoeonthego", niche: "Travel", followers: 231000, location: "Cebu" },
  { id: "c12", name: "Kai Diaz", handle: "kaicreates", niche: "Tech", followers: 71900, location: "Manila" },
];

function videos(recordId, states, views = []) {
  return states.map((state, index) => {
    const published = state === "Published";
    return {
      id: `${recordId}-v${index + 1}`,
      title: `TikTok video ${index + 1}`,
      state,
      postedAt: published ? `2026-10-${String(8 + index).padStart(2, "0")}` : "",
      videoId: published ? `DEMO-${recordId.toUpperCase()}-${index + 1}` : "",
      views: published ? views[index] || 0 : 0,
    };
  });
}

const published = ["Published", "Published", "Published", "Published"];

export const seedRecords = [
  { id: "e01", creatorId: "c01", campaignId: "october", program: "Pinakamurang Data - Piso", owner: "Annie", kolConfirmation: "Pitching", kynxApproval: "Pending", brandApproval: "", rate: 0, invoice: "No", taxesInclusive: "No", moa: "Missing", draftStatus: "", postDue: "2026-10-20", postDate: "", deliverables: videos("e01", ["Not submitted"]), accountHold: false, payment: "Pending", notes: [] },
  { id: "e02", creatorId: "c02", campaignId: "october", program: "Shopee VIP", owner: "Annie", kolConfirmation: "Confirmed", kynxApproval: "Pending", brandApproval: "For approval", rate: 8000, invoice: "Yes", taxesInclusive: "No", moa: "Needs review", draftStatus: "", postDue: "2026-10-18", postDate: "", deliverables: videos("e02", ["Not submitted"]), accountHold: false, payment: "Pending", notes: [] },
  { id: "e03", creatorId: "c03", campaignId: "october", program: "Pinakamurang Data - Piso", owner: "Annie", kolConfirmation: "Confirmed", kynxApproval: "Approved", brandApproval: "Approved", rate: 8000, invoice: "Yes", taxesInclusive: "No", moa: "Verified", draftStatus: "Approved", postDue: "2026-10-13", postDate: "2026-10-13", deliverables: videos("e03", published, [186400, 242100, 98000, 310500]), accountHold: false, payment: "Pending", notes: [] },
  { id: "e04", creatorId: "c04", campaignId: "october", program: "Shopee VIP+", owner: "Nisha", kolConfirmation: "Confirmed", kynxApproval: "Approved", brandApproval: "Approved", rate: 10000, invoice: "Yes", taxesInclusive: "No", moa: "Verified", draftStatus: "", postDue: "2026-10-12", postDate: "", deliverables: videos("e04", ["Not submitted"]), accountHold: false, payment: "Pending", notes: [] },
  { id: "e05", creatorId: "c05", campaignId: "october", program: "Pinakamurang Data - Piso", owner: "Annie", kolConfirmation: "Confirmed", kynxApproval: "Approved", brandApproval: "Approved", rate: 6000, invoice: "No", taxesInclusive: "No", moa: "Verified", draftStatus: "For review", postDue: "2026-10-18", postDate: "", deliverables: videos("e05", ["In review"]), accountHold: false, payment: "Pending", notes: [] },
  { id: "e06", creatorId: "c06", campaignId: "october", program: "Shopee VIP", owner: "Nisha", kolConfirmation: "Confirmed", kynxApproval: "Approved", brandApproval: "Approved", rate: 9000, invoice: "Yes", taxesInclusive: "Yes", moa: "Verified", draftStatus: "For revision", postDue: "2026-10-14", postDate: "", deliverables: videos("e06", ["Changes requested"]), accountHold: false, payment: "Pending", notes: [] },
  { id: "e07", creatorId: "c07", campaignId: "october", program: "Pinakamurang Data - Piso", owner: "Daneca", kolConfirmation: "Confirmed", kynxApproval: "Approved", brandApproval: "Approved", rate: 7000, invoice: "No", taxesInclusive: "No", moa: "Verified", draftStatus: "Approved", postDue: "2026-10-11", postDate: "2026-10-12", deliverables: videos("e07", published, [88000, 76000, 91000, 54000]), accountHold: true, payment: "Pending", notes: [] },
  { id: "e08", creatorId: "c08", campaignId: "october", program: "Shopee VIP", owner: "Nisha", kolConfirmation: "Confirmed", kynxApproval: "Approved", brandApproval: "Approved", rate: 5000, invoice: "Yes", taxesInclusive: "No", moa: "Verified", draftStatus: "Approved", postDue: "2026-10-10", postDate: "2026-10-10", deliverables: videos("e08", published, [12000, 15000, 9000, 18000]), accountHold: false, payment: "Paid", notes: [] },
  { id: "e09", creatorId: "c09", campaignId: "october", program: "Shopee VIP+", owner: "Nisha", kolConfirmation: "Confirmed", kynxApproval: "Approved", brandApproval: "For approval", rate: 12000, invoice: "Yes", taxesInclusive: "No", moa: "Missing", draftStatus: "", postDue: "2026-10-22", postDate: "", deliverables: videos("e09", ["Not submitted"]), accountHold: false, payment: "Pending", notes: [] },
  { id: "e10", creatorId: "c10", campaignId: "october", program: "Pinakamurang Data - Piso", owner: "Annie", kolConfirmation: "Dropped", kynxApproval: "Approved", brandApproval: "Approved", rate: 0, invoice: "No", taxesInclusive: "No", moa: "Missing", draftStatus: "", postDue: "2026-10-13", postDate: "", deliverables: videos("e10", ["Not submitted"]), accountHold: false, payment: "Pending", notes: [] },
  { id: "e11", creatorId: "c11", campaignId: "october", program: "Pinakamurang Data - Piso / 10% Data", owner: "Annie", kolConfirmation: "Confirmed", kynxApproval: "Approved", brandApproval: "Approved", rate: 11000, invoice: "Yes", taxesInclusive: "No", moa: "Verified", draftStatus: "Approved after revision", postDue: "2026-10-16", postDate: "", deliverables: videos("e11", ["Approved"]), accountHold: false, payment: "Pending", notes: [] },
  { id: "e12", creatorId: "c12", campaignId: "october", program: "Shopee VIP", owner: "Nisha", kolConfirmation: "Confirmed", kynxApproval: "Rejected", brandApproval: "", rate: 4000, invoice: "No", taxesInclusive: "No", moa: "Missing", draftStatus: "", postDue: "2026-10-19", postDate: "", deliverables: videos("e12", ["Not submitted"]), accountHold: false, payment: "Pending", notes: [] },
  { id: "e13", creatorId: "c01", campaignId: "october", program: "Shopee VIP+", owner: "Nisha", kolConfirmation: "Pitching", kynxApproval: "Pending", brandApproval: "", rate: 0, invoice: "No", taxesInclusive: "No", moa: "Missing", draftStatus: "", postDue: "2026-10-23", postDate: "", deliverables: videos("e13", ["Not submitted"]), accountHold: false, payment: "Pending", notes: [] },
  { id: "e14", creatorId: "c03", campaignId: "october", program: "Shopee VIP", owner: "Nisha", kolConfirmation: "Confirmed", kynxApproval: "Approved", brandApproval: "Approved", rate: 0, invoice: "No", taxesInclusive: "No", moa: "Missing", draftStatus: "", postDue: "2026-10-13", postDate: "", deliverables: videos("e14", ["Not submitted"]), accountHold: false, payment: "Pending", notes: [] },
  { id: "e15", creatorId: "c09", campaignId: "october", program: "Pinakamurang Data - Piso", owner: "Annie", kolConfirmation: "Confirmed", kynxApproval: "Approved", brandApproval: "Approved", rate: 10000, invoice: "Yes", taxesInclusive: "No", moa: "Verified", draftStatus: "Approved", postDue: "2026-10-09", postDate: "2026-10-09", deliverables: videos("e15", ["Published"], [154200]), accountHold: false, payment: "Pending", notes: [] },
  { id: "e16", creatorId: "c12", campaignId: "october", program: "Shopee VIP Rewards for Referrals", owner: "Nisha", kolConfirmation: "Confirmed", kynxApproval: "Approved", brandApproval: "Approved", rate: 5000, invoice: "Yes", taxesInclusive: "No", moa: "Verified", draftStatus: "For review", postDue: "2026-10-20", postDate: "", deliverables: videos("e16", ["In review"]), accountHold: false, payment: "Pending", notes: [] },
];

export const seedCategories = {
  ...Object.fromEntries(creators.map((creator) => [creator.id, [creator.niche]])),
  c03: ["Beauty", "Lifestyle"],
  c07: ["Fashion", "Beauty"],
};

export function recordIds() {
  return seedRecords.map((record) => record.id);
}

export function campaignIds() {
  return campaigns.map((campaign) => campaign.id);
}

export function tierFor(followers) {
  if (followers >= 1_000_000) return "Mega";
  if (followers >= 100_000) return "Macro";
  if (followers >= 50_000) return "Mid";
  if (followers >= 10_000) return "Micro";
  if (followers > 0) return "Nano";
  return "";
}

export function platformsFor(program) {
  return String(program).startsWith("Pinakamurang Data") ? "Facebook, Instagram, TikTok" : "TikTok";
}

function dayNumber(iso) {
  if (!iso) return null;
  const [year, month, day] = iso.split("-").map(Number);
  if (!year || !month || !day) return null;
  return Date.UTC(year, month - 1, day) / 86400000;
}

export function onTracker(record) {
  return record.kolConfirmation === "Confirmed" && record.kynxApproval === "Approved" && record.brandApproval === "Approved";
}

export function bookingStage(record) {
  const posted = Boolean(record.postDate) || record.deliverables.some((item) => item.state === "Published");
  if (posted) return "Posted";
  if (record.draftStatus === "Approved" || record.draftStatus === "Approved after revision") return "Approved for posting";
  if (record.draftStatus === "For revision") return "Under revision";
  if (record.draftStatus === "For review") return "Draft submitted";
  if (!record.rate) return "Negotiating";
  return "Pending draft";
}

export function daysLate(record, stage) {
  const due = dayNumber(record.postDue);
  if (due == null) return null;
  const posted = dayNumber(record.postDate);
  if (posted != null) return Math.max(0, posted - due);
  if (stage === "Posted") return 0;
  return Math.max(0, dayNumber(deskToday) - due);
}

export function bookingRisk(late) {
  if (late == null) return "";
  if (late > 3) return "High";
  if (late > 0) return "Medium";
  return "Low";
}

export function bookingAction(stage, late) {
  if (stage === "Posted") return "Done";
  if (late == null) return "";
  if (late >= 3) return "Escalate";
  if (late >= 1) return "Follow up";
  return "On track";
}

export function recordStatus(record) {
  if (record.kolConfirmation === "Dropped" || record.kynxApproval === "Dropped") return "Dropped";
  if (record.kolConfirmation === "Rejected" || record.kynxApproval === "Rejected") return "Rejected";
  if (record.kolConfirmation !== "Confirmed") return "Pitching";
  if (record.kynxApproval !== "Approved") return "Awaiting KYNX";
  if (record.brandApproval !== "Approved") return "Awaiting brand";
  return bookingStage(record);
}

export function creatorPayStatus(record) {
  if (!onTracker(record)) return "Off tracker";
  if (record.payment === "Paid") return "Paid";
  if (record.accountHold) return "On hold";
  const stage = bookingStage(record);
  if (stage === "Posted" && record.rate > 0 && record.invoice === "Yes") return "Ready to pay";
  return "Not ready";
}

export function payBlockers(record) {
  const blockers = [];
  if (!onTracker(record)) blockers.push("Needs creator confirmation, KYNX approval, and brand approval");
  if (bookingStage(record) !== "Posted") blockers.push("Post is not live yet");
  if (record.rate <= 0) blockers.push("Rate is still open");
  if (record.invoice !== "Yes") blockers.push("Service invoice is missing");
  if (record.accountHold) blockers.push("Payment account needs review");
  return blockers;
}

function campaignById(id, patches) {
  const campaign = campaigns.find((item) => item.id === id);
  if (!campaign) return null;
  return { ...campaign, ...(patches[id] || {}) };
}

function creatorById(id) {
  return creators.find((creator) => creator.id === id);
}

export function withDesk(records, categories, campaignPatches = {}) {
  function present(record) {
    const creator = creatorById(record.creatorId);
    const campaign = campaignById(record.campaignId, campaignPatches);
    const creatorCategories = categories[record.creatorId] || [creator.niche];
    const stage = bookingStage(record);
    const late = onTracker(record) ? daysLate(record, stage) : null;
    const views = record.deliverables.reduce((sum, item) => sum + (item.state === "Published" ? item.views : 0), 0);
    const brands = [...new Set(records.filter((item) => item.creatorId === record.creatorId).map((item) => campaignById(item.campaignId, campaignPatches).brand))];
    return {
      ...record,
      creator,
      campaign,
      categories: creatorCategories,
      categoryLabel: creatorCategories.join(" · "),
      tier: tierFor(creator.followers),
      platforms: platformsFor(record.program),
      onTracker: onTracker(record),
      stage,
      late,
      risk: bookingRisk(late),
      action: bookingAction(stage, late),
      views,
      status: recordStatus(record),
      payStatus: creatorPayStatus(record),
      blockers: payBlockers(record),
      brands,
      publishedCount: record.deliverables.filter((item) => item.state === "Published").length,
    };
  }

  function listRecords({ niche = "", min = 0, max = 100_000_000, q = "", brand = "", program = "", stage = "", sort = "followers_desc" } = {}) {
    const query = q.trim().toLowerCase();
    const rows = records
      .map(present)
      .filter((row) => row.creator.followers >= min && row.creator.followers <= max)
      .filter((row) => !niche || row.categories.includes(niche))
      .filter((row) => !brand || row.campaign.brand === brand)
      .filter((row) => !program || row.program === program)
      .filter((row) => !stage || row.status === stage)
      .filter((row) => !query || row.creator.name.toLowerCase().includes(query) || row.creator.handle.toLowerCase().includes(query) || row.program.toLowerCase().includes(query) || row.campaign.name.toLowerCase().includes(query));
    const sorts = {
      followers_desc: (a, b) => b.creator.followers - a.creator.followers || a.creator.name.localeCompare(b.creator.name),
      followers_asc: (a, b) => a.creator.followers - b.creator.followers || a.creator.name.localeCompare(b.creator.name),
      views_desc: (a, b) => b.views - a.views || a.creator.name.localeCompare(b.creator.name),
      name: (a, b) => a.creator.name.localeCompare(b.creator.name),
    };
    return rows.sort(sorts[sort] || sorts.followers_desc);
  }

  function getRecord(id) {
    const record = records.find((item) => item.id === id);
    if (!record) return null;
    const row = present(record);
    const others = records.filter((item) => item.creatorId === record.creatorId && item.id !== record.id).map(present);
    return { ...row, others };
  }

  function summarize(campaign, rows) {
    const tracker = rows.filter((row) => row.onTracker);
    const creatorCost = campaign.creatorCost ?? tracker.reduce((sum, row) => sum + row.rate, 0);
    const gross = campaign.revenue - creatorCost - campaign.boosting - campaign.vat;
    return {
      ...campaign,
      records: rows,
      tracker,
      views: rows.reduce((sum, row) => sum + row.views, 0),
      creatorCost,
      gross,
      margin: campaign.revenue ? gross / campaign.revenue : 0,
      confirmed: tracker.length,
      posted: tracker.filter((row) => row.stage === "Posted").length,
      pitching: rows.filter((row) => row.status === "Pitching").length,
      escalations: tracker.filter((row) => row.action === "Escalate").length,
      followUps: tracker.filter((row) => row.action === "Follow up").length,
      ready: tracker.filter((row) => row.payStatus === "Ready to pay").length,
    };
  }

  function listCampaigns() {
    return campaigns.map((campaign) => {
      const current = campaignById(campaign.id, campaignPatches);
      const rows = records.filter((record) => record.campaignId === campaign.id).map(present);
      return summarize(current, rows);
    });
  }

  function getCampaign(id) {
    const campaign = campaignById(id, campaignPatches);
    if (!campaign) return null;
    const summary = listCampaigns().find((item) => item.id === id);
    const roster = creators
      .map((creator) => ({ ...creator, categories: categories[creator.id] || [creator.niche], tier: tierFor(creator.followers) }))
      .sort((a, b) => b.followers - a.followers);
    const byProgram = (summary.programs || []).map((program) => {
      const rows = summary.records.filter((row) => row.program === program);
      const tracker = rows.filter((row) => row.onTracker);
      return {
        program,
        nominations: rows.length,
        confirmed: tracker.length,
        posted: tracker.filter((row) => row.stage === "Posted").length,
        creatorCost: tracker.reduce((sum, row) => sum + row.rate, 0),
        views: rows.reduce((sum, row) => sum + row.views, 0),
      };
    });
    return { ...summary, roster, byProgram };
  }

  function listImpact() {
    const posts = records.flatMap((record) => {
      const row = present(record);
      return record.deliverables
        .filter((item) => item.state === "Published")
        .map((item) => ({
          ...item,
          recordId: record.id,
          campaignId: row.campaign.id,
          campaignName: row.campaign.name,
          program: row.program,
          creatorName: row.creator.name,
          handle: row.creator.handle,
          brand: row.campaign.brand,
        }));
    });
    const names = [...new Set(posts.map((post) => post.program))];
    return names.map((program) => {
      const rows = posts.filter((post) => post.program === program);
      return { name: program, brand: rows[0]?.brand || "", views: rows.reduce((sum, post) => sum + post.views, 0), posts: rows };
    }).sort((a, b) => b.views - a.views);
  }

  function listReviews() {
    const items = [];
    records.forEach((record) => {
      const row = present(record);
      if (row.status === "Awaiting KYNX") {
        items.push({ key: `${record.id}-kynx`, recordId: record.id, kind: "kynx", label: "KYNX approval", detail: row.creator.name, campaign: row.program, owner: row.owner });
      }
      if (record.brandApproval === "For approval" && record.kolConfirmation === "Confirmed") {
        items.push({ key: `${record.id}-brand`, recordId: record.id, kind: "brand", label: "Brand approval", detail: row.creator.name, campaign: row.program, owner: row.owner });
      }
      if (row.onTracker && record.draftStatus === "For review") {
        items.push({ key: `${record.id}-draft`, recordId: record.id, kind: "draft", label: "Draft for review", detail: row.creator.name, campaign: row.program, owner: row.owner });
      }
      if (row.onTracker && record.draftStatus === "For revision") {
        items.push({ key: `${record.id}-revision`, recordId: record.id, kind: "revision", label: "Revision in progress", detail: row.creator.name, campaign: row.program, owner: row.owner });
      }
    });
    return items;
  }

  function overviewStats() {
    const rows = records.map(present);
    const tracker = rows.filter((row) => row.onTracker);
    const ready = tracker.filter((row) => row.payStatus === "Ready to pay");
    const october = listCampaigns().find((campaign) => campaign.id === "october");
    return {
      campaigns: campaigns.length,
      live: campaigns.filter((campaign) => campaign.campaignStatus === "Active").length,
      nominations: rows.length,
      onTracker: tracker.length,
      posted: tracker.filter((row) => row.stage === "Posted").length,
      escalations: tracker.filter((row) => row.action === "Escalate").length,
      followUps: tracker.filter((row) => row.action === "Follow up").length,
      ready: ready.length,
      readyAmount: ready.reduce((sum, row) => sum + row.rate, 0),
      creatorCost: october ? october.creatorCost : 0,
      views: rows.reduce((sum, row) => sum + row.views, 0),
      reviews: listReviews().length,
    };
  }

  function attention() {
    return records.map(present).filter((row) => row.onTracker && (row.action === "Escalate" || row.action === "Follow up"));
  }

  return { listRecords, getRecord, listCampaigns, getCampaign, listImpact, listReviews, overviewStats, attention };
}
