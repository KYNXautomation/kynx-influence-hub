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

export const campaigns = [
  { id: "tto", name: "Shopee TTO · October", short: "TTO", brand: "Shopee", description: "Everyday discoveries, told in each creator’s own voice.", deadline: "2026-10-13", owner: "Annie", budget: 48000, category: "Beauty", minFollowers: 10000 },
  { id: "vip", name: "Shopee VIP", short: "VIP", brand: "Shopee", description: "Introduce the benefits of being a Shopee VIP.", deadline: "2026-10-18", owner: "Nisha", budget: 60000, category: "Lifestyle", minFollowers: 20000 },
  { id: "data", name: "Pinakamurang Data", short: "DATA", brand: "Shopee", description: "Help audiences discover affordable mobile data.", deadline: "2026-10-20", owner: "Annie", budget: 80000, category: "Tech", minFollowers: 30000 },
  { id: "plus", name: "Shopee VIP+", short: "VIP+", brand: "Shopee", description: "Bring the extra perks of VIP+ to life.", deadline: "2026-10-23", owner: "Nisha", budget: 50000, category: "Fashion", minFollowers: 20000 },
  { id: "creator-open-demo", name: "Creator call · Demo", short: "DEMO", brand: "Demo brand", description: "A fictional open campaign for trying the creator application flow.", deadline: "2026-11-01", owner: "Demo Specialist", budget: 15000, category: "", minFollowers: 0, applicationsOpen: true },
];

export const creators = [
  { id: "c01", name: "Maya Santos", handle: "mayamakes", niche: "Lifestyle", followers: 86400, location: "Quezon City" },
  { id: "c02", name: "Leo Reyes", handle: "leofinds", niche: "Tech", followers: 124000, location: "Cebu" },
  { id: "c03", name: "Sofia Cruz", handle: "sofiasunday", niche: "Beauty", followers: 42800, location: "Manila" },
  { id: "c04", name: "Eli Navarro", handle: "everydayeli", niche: "Lifestyle", followers: 217000, location: "Makati" },
  { id: "c05", name: "Isla Mendoza", handle: "islaeats", niche: "Food", followers: 65400, location: "Davao" },
  { id: "c06", name: "Noah Flores", handle: "noahplays", niche: "Gaming", followers: 312000, location: "Pasig" },
  { id: "c07", name: "Chloe Lim", handle: "chloeincolor", niche: "Fashion", followers: 98300, location: "Manila" },
  { id: "c08", name: "Luca Garcia", handle: "lucaliving", niche: "Lifestyle", followers: 37400, location: "Baguio" },
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
      postedAt: published ? `2026-10-${String(7 + index).padStart(2, "0")}` : "",
      videoId: published ? `DEMO-${recordId.toUpperCase()}-${index + 1}` : "",
      views: published ? views[index] || 0 : 0,
    };
  });
}

const published = ["Published", "Published", "Published", "Published"];

export const seedRecords = [
  { id: "e01", creatorId: "c01", campaignId: "tto", owner: "Annie", rate: 3000, moa: "Needs review", billing: "Missing", deliverables: videos("e01", ["Not submitted", "Not submitted", "Not submitted", "Not submitted"]), accountHold: false, payment: "Pending", notes: [] },
  { id: "e02", creatorId: "c02", campaignId: "tto", owner: "Annie", rate: 3000, moa: "Verified", billing: "Missing", deliverables: videos("e02", ["In review", "In review", "Approved", "Not submitted"]), accountHold: false, payment: "Pending", notes: [] },
  { id: "e03", creatorId: "c03", campaignId: "tto", owner: "Annie", rate: 3000, moa: "Verified", billing: "Verified", deliverables: videos("e03", published, [186400, 242100, 98000, 310500]), accountHold: false, payment: "Pending", notes: [] },
  { id: "e04", creatorId: "c04", campaignId: "tto", owner: "Annie", rate: 3000, moa: "Missing", billing: "Verified", deliverables: videos("e04", published, [64000, 41000, 28000, 52000]), accountHold: false, payment: "Pending", notes: [] },
  { id: "e05", creatorId: "c05", campaignId: "tto", owner: "Annie", rate: 3000, moa: "Verified", billing: "Needs review", deliverables: videos("e05", published, [33000, 27000, 19000, 44000]), accountHold: false, payment: "Pending", notes: [] },
  { id: "e06", creatorId: "c06", campaignId: "tto", owner: "Annie", rate: 4000, moa: "Verified", billing: "Missing", deliverables: videos("e06", ["Changes requested", "Approved", "Not submitted", "Not submitted"]), accountHold: false, payment: "Pending", notes: [] },
  { id: "e07", creatorId: "c07", campaignId: "tto", owner: "Annie", rate: 3000, moa: "Verified", billing: "Verified", deliverables: videos("e07", published, [88000, 76000, 91000, 54000]), accountHold: true, payment: "Pending", notes: [] },
  { id: "e08", creatorId: "c08", campaignId: "tto", owner: "Annie", rate: 3000, moa: "Verified", billing: "Verified", deliverables: videos("e08", published, [12000, 15000, 9000, 18000]), accountHold: false, payment: "Paid", notes: [] },
  { id: "e09", creatorId: "c09", campaignId: "vip", owner: "Nisha", rate: 10000, moa: "Verified", billing: "Missing", deliverables: videos("e09", ["In review"]), accountHold: false, payment: "Pending", notes: [] },
  { id: "e10", creatorId: "c10", campaignId: "vip", owner: "Nisha", rate: 5000, moa: "Needs review", billing: "Missing", deliverables: videos("e10", ["Not submitted"]), accountHold: false, payment: "Pending", notes: [] },
  { id: "e11", creatorId: "c11", campaignId: "data", owner: "Annie", rate: 12000, moa: "Verified", billing: "Missing", deliverables: videos("e11", ["Approved"]), accountHold: false, payment: "Pending", notes: [] },
  { id: "e12", creatorId: "c12", campaignId: "data", owner: "Annie", rate: 8000, moa: "Needs review", billing: "Missing", deliverables: videos("e12", ["Not submitted"]), accountHold: false, payment: "Pending", notes: [] },
  { id: "e13", creatorId: "c01", campaignId: "plus", owner: "Nisha", rate: 10000, moa: "Missing", billing: "Missing", deliverables: videos("e13", ["Not submitted"]), accountHold: false, payment: "Pending", notes: [] },
  { id: "e14", creatorId: "c03", campaignId: "plus", owner: "Nisha", rate: 8000, moa: "Verified", billing: "Missing", deliverables: videos("e14", ["In review"]), accountHold: false, payment: "Pending", notes: [] },
  { id: "e15", creatorId: "c09", campaignId: "data", owner: "Annie", rate: 10000, moa: "Verified", billing: "Verified", deliverables: videos("e15", ["Published"], [154200]), accountHold: false, payment: "Pending", notes: [] },
  { id: "e16", creatorId: "c12", campaignId: "vip", owner: "Nisha", rate: 5000, moa: "Verified", billing: "Missing", deliverables: videos("e16", ["Approved"]), accountHold: false, payment: "Pending", notes: [] },
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

export function paymentBlockers(record) {
  const blockers = [];
  if (record.moa !== "Verified") blockers.push("Signed MOA needs verification");
  if (!record.deliverables.length || record.deliverables.some((item) => item.state !== "Published")) blockers.push("All deliverables must be published");
  if (record.billing !== "Verified") blockers.push("Signed billing statement needs verification");
  if (record.accountHold) blockers.push("Payment account needs review");
  if (record.rate <= 0) blockers.push("Agreed rate is missing");
  return blockers;
}

export function recordStatus(record) {
  if (record.payment === "Paid") return "Paid";
  if (paymentBlockers(record).length === 0) return "Ready to pay";
  if (record.accountHold) return "Payment on hold";
  if (record.moa === "Missing") return "Awaiting MOA";
  if (record.moa === "Needs review") return "MOA review";
  if (record.deliverables.some((item) => item.state === "Changes requested")) return "Revisions needed";
  if (record.deliverables.some((item) => item.state === "In review")) return "Content review";
  if (record.deliverables.every((item) => item.state === "Published")) return "Billing review";
  return "Creating content";
}

function campaignById(id) {
  return campaigns.find((campaign) => campaign.id === id);
}

function creatorById(id) {
  return creators.find((creator) => creator.id === id);
}

export function withDesk(records, categories) {
  function present(record) {
    const creator = creatorById(record.creatorId);
    const campaign = campaignById(record.campaignId);
    const creatorCategories = categories[record.creatorId] || [creator.niche];
    const views = record.deliverables.reduce((sum, item) => sum + (item.state === "Published" ? item.views : 0), 0);
    const brands = [...new Set(records.filter((item) => item.creatorId === record.creatorId).map((item) => campaignById(item.campaignId).brand))];
    return {
      ...record,
      creator,
      campaign,
      categories: creatorCategories,
      categoryLabel: creatorCategories.join(" · "),
      views,
      status: recordStatus(record),
      blockers: paymentBlockers(record),
      brands,
      publishedCount: record.deliverables.filter((item) => item.state === "Published").length,
    };
  }

  function listRecords({ niche = "", min = 0, max = 100_000_000, q = "", brand = "", sort = "followers_desc" } = {}) {
    const query = q.trim().toLowerCase();
    const rows = records
      .map(present)
      .filter((row) => row.creator.followers >= min && row.creator.followers <= max)
      .filter((row) => !niche || row.categories.includes(niche))
      .filter((row) => !brand || row.campaign.brand === brand)
      .filter((row) => !query || row.creator.name.toLowerCase().includes(query) || row.creator.handle.toLowerCase().includes(query) || row.campaign.name.toLowerCase().includes(query));
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

  function listCampaigns() {
    return campaigns.map((campaign) => {
      const rows = records.filter((record) => record.campaignId === campaign.id).map(present);
      return {
        ...campaign,
        records: rows,
        views: rows.reduce((sum, row) => sum + row.views, 0),
        ready: rows.filter((row) => row.status === "Ready to pay").length,
      };
    });
  }

  function getCampaign(id) {
    const campaign = campaignById(id);
    if (!campaign) return null;
    const summary = listCampaigns().find((item) => item.id === id);
    const roster = creators
      .map((creator) => ({ ...creator, categories: categories[creator.id] || [creator.niche] }))
      .sort((a, b) => Number(b.categories.includes(campaign.category)) - Number(a.categories.includes(campaign.category)) || b.followers - a.followers);
    return { ...summary, roster };
  }

  function listImpact() {
    const brands = [...new Set(campaigns.map((campaign) => campaign.brand))];
    return brands.map((brand) => {
      const posts = records.flatMap((record) => {
        const campaign = campaignById(record.campaignId);
        if (campaign.brand !== brand) return [];
        const creator = creatorById(record.creatorId);
        return record.deliverables
          .filter((item) => item.state === "Published")
          .map((item) => ({ ...item, recordId: record.id, campaignId: campaign.id, campaignName: campaign.name, creatorName: creator.name, handle: creator.handle }));
      });
      return {
        name: brand,
        views: posts.reduce((sum, post) => sum + post.views, 0),
        posts,
      };
    }).sort((a, b) => b.views - a.views);
  }

  function listReviews() {
    const items = [];
    records.forEach((record) => {
      const row = present(record);
      if (record.moa === "Needs review") items.push({ key: `${record.id}-moa`, recordId: record.id, kind: "moa", label: "Memorandum of agreement", detail: row.creator.name, campaign: row.campaign.name });
      if (record.billing === "Needs review") items.push({ key: `${record.id}-billing`, recordId: record.id, kind: "billing", label: "Billing statement", detail: row.creator.name, campaign: row.campaign.name });
      record.deliverables.filter((item) => item.state === "In review").forEach((item) => {
        items.push({ key: item.id, recordId: record.id, deliverableId: item.id, kind: "deliverable", label: item.title, detail: row.creator.name, campaign: row.campaign.name });
      });
    });
    return items;
  }

  function overviewStats() {
    const rows = records.map(present);
    const ready = rows.filter((row) => row.status === "Ready to pay");
    return {
      campaigns: campaigns.length,
      collaborations: rows.length,
      creators: new Set(rows.map((row) => row.creatorId)).size,
      ready: ready.length,
      readyAmount: ready.reduce((sum, row) => sum + row.rate, 0),
      views: rows.reduce((sum, row) => sum + row.views, 0),
      reviews: listReviews().length,
    };
  }

  return { listRecords, getRecord, listCampaigns, getCampaign, listImpact, listReviews, overviewStats };
}
