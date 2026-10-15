const creators = [
  { id: 1, name: "Sofia Cruz", handle: "sofiasunday", primary_niche: "Beauty", tiktok_followers: 42800, location: "Manila", rate_php: 3000, bio: "Beauty routines and everyday product trials." },
  { id: 2, name: "Maya Santos", handle: "mayamakes", primary_niche: "Lifestyle", tiktok_followers: 18600, location: "Quezon City", rate_php: 3000, bio: "Home, routines, and day-in-the-life stories." },
  { id: 3, name: "Leo Reyes", handle: "leofinds", primary_niche: "Tech", tiktok_followers: 92000, location: "Cebu", rate_php: 8000, bio: "Gadgets, telco offers, and plain-language explainers." },
  { id: 4, name: "Eli Navarro", handle: "everydayeli", primary_niche: "Lifestyle", tiktok_followers: 12400, location: "Makati", rate_php: 3000, bio: "City errands, cafes, and weekly resets." },
  { id: 5, name: "Isla Mendoza", handle: "islaeats", primary_niche: "Food", tiktok_followers: 31000, location: "Davao", rate_php: 3500, bio: "Home cooking and grocery finds." },
  { id: 6, name: "Noah Flores", handle: "noahplays", primary_niche: "Gaming", tiktok_followers: 156000, location: "Pasig", rate_php: 4000, bio: "Mobile games and short reaction clips." },
  { id: 7, name: "Chloe Lim", handle: "chloeincolor", primary_niche: "Fashion", tiktok_followers: 67000, location: "Manila", rate_php: 5000, bio: "Outfit repeats, shopping edits, and beauty crossovers." },
  { id: 8, name: "Luca Garcia", handle: "lucaliving", primary_niche: "Lifestyle", tiktok_followers: 22100, location: "Baguio", rate_php: 3000, bio: "Slow weekends and product-in-use scenes." },
  { id: 9, name: "Amara Tan", handle: "amarastudio", primary_niche: "Beauty", tiktok_followers: 88000, location: "Makati", rate_php: 10000, bio: "Skin, makeup, and campaign-ready tutorials." },
  { id: 10, name: "Finn Ramos", handle: "finntalks", primary_niche: "Student life", tiktok_followers: 9800, location: "Quezon City", rate_php: 5000, bio: "Campus life and budget finds." },
  { id: 11, name: "Zoe Rivera", handle: "zoeonthego", primary_niche: "Travel", tiktok_followers: 54000, location: "Cebu", rate_php: 12000, bio: "City guides and trip diaries." },
  { id: 12, name: "Kai Diaz", handle: "kaicreates", primary_niche: "Tech", tiktok_followers: 41000, location: "Manila", rate_php: 8000, bio: "Setup tours and app walkthroughs." },
];

const extraNiches = { 1: ["Lifestyle"], 7: ["Beauty"] };

const clients = [
  { id: 1, name: "Shopee", industry: "Marketplace" },
  { id: 2, name: "Glow Lab", industry: "Beauty" },
];

const campaigns = [
  { id: 1, client_id: 1, name: "Shopee TTO · October", niche: "Beauty", status: "Live", min_tiktok_followers: 10000, starts_on: "2026-10-01", brief: "Beauty creators for the October TikTok shop push." },
  { id: 2, client_id: 2, name: "Glow Lab Launch", niche: "Beauty", status: "Matching", min_tiktok_followers: 20000, starts_on: "2026-10-20", brief: "New serum launch. Match beauty creators before briefs go out." },
  { id: 3, client_id: 1, name: "Pinakamurang Data", niche: "Tech", status: "Live", min_tiktok_followers: 30000, starts_on: "2026-10-06", brief: "Tech explainers for a data offer." },
];

export const seedPosts = [
  { id: 1, campaign_id: 1, creator_id: 1, platform: "TikTok", title: "Morning skin edit", published_on: "2026-10-07", views: 186400 },
  { id: 2, campaign_id: 1, creator_id: 1, platform: "TikTok", title: "Get ready with the set", published_on: "2026-10-08", views: 242100 },
  { id: 3, campaign_id: 1, creator_id: 1, platform: "TikTok", title: "Texture check", published_on: "2026-10-09", views: 98000 },
  { id: 4, campaign_id: 1, creator_id: 1, platform: "TikTok", title: "Night routine", published_on: "2026-10-10", views: 310500 },
  { id: 5, campaign_id: 1, creator_id: 9, platform: "TikTok", title: "Studio tutorial", published_on: "2026-10-11", views: 154200 },
  { id: 6, campaign_id: 3, creator_id: 12, platform: "TikTok", title: "What the offer actually is", published_on: "2026-10-08", views: 88000 },
  { id: 7, campaign_id: 3, creator_id: 12, platform: "TikTok", title: "Setup in two minutes", published_on: "2026-10-10", views: 42000 },
  { id: 8, campaign_id: 3, creator_id: 3, platform: "TikTok", title: "Which plan fits", published_on: "2026-10-09", views: 210000 },
];

export function creatorIds() {
  return creators.map((creator) => creator.id);
}

export function campaignIds() {
  return campaigns.map((campaign) => campaign.id);
}

function nicheList(creator) {
  return [creator.primary_niche, ...(extraNiches[creator.id] || [])];
}

function clientById(id) {
  return clients.find((client) => client.id === id);
}

function creatorById(id) {
  return creators.find((creator) => creator.id === id);
}

export function withPosts(posts) {
  function viewsForCreator(id) {
    return posts.filter((post) => post.creator_id === id).reduce((sum, post) => sum + post.views, 0);
  }

  function presentCreator(creator) {
    return {
      ...creator,
      niches: nicheList(creator).join(" · "),
      views_generated: viewsForCreator(creator.id),
    };
  }

  function listNiches() {
    return [...new Set(creators.flatMap(nicheList))].sort();
  }

  function listCreators({ niche = "", min = 0, max = 100_000_000, q = "", sort = "followers_desc" } = {}) {
    const query = q.trim().toLowerCase();
    const rows = creators
      .filter((creator) => creator.tiktok_followers >= min && creator.tiktok_followers <= max)
      .filter((creator) => !niche || nicheList(creator).includes(niche))
      .filter((creator) => !query || creator.name.toLowerCase().includes(query) || creator.handle.toLowerCase().includes(query))
      .map(presentCreator);

    const sorts = {
      followers_desc: (a, b) => b.tiktok_followers - a.tiktok_followers || a.name.localeCompare(b.name),
      followers_asc: (a, b) => a.tiktok_followers - b.tiktok_followers || a.name.localeCompare(b.name),
      views_desc: (a, b) => b.views_generated - a.views_generated || a.name.localeCompare(b.name),
      name: (a, b) => a.name.localeCompare(b.name),
    };
    return rows.sort(sorts[sort] || sorts.followers_desc);
  }

  function getCreator(id) {
    const creator = creatorById(id);
    if (!creator) return null;
    const creatorPosts = posts
      .filter((post) => post.creator_id === id)
      .map((post) => {
        const campaign = campaigns.find((item) => item.id === post.campaign_id);
        const client = clientById(campaign.client_id);
        return { ...post, campaign_name: campaign.name, client_name: client.name, campaign_id: campaign.id };
      });
    return { ...presentCreator(creator), posts: creatorPosts };
  }

  function listCampaigns() {
    return campaigns
      .map((campaign) => {
        const campaignPosts = posts.filter((post) => post.campaign_id === campaign.id);
        return {
          ...campaign,
          client_name: clientById(campaign.client_id).name,
          post_count: campaignPosts.length,
          views: campaignPosts.reduce((sum, post) => sum + post.views, 0),
        };
      })
      .sort((a, b) => b.starts_on.localeCompare(a.starts_on) || b.id - a.id);
  }

  function getCampaign(id) {
    const campaign = campaigns.find((item) => item.id === id);
    if (!campaign) return null;
    const campaignPosts = posts
      .filter((post) => post.campaign_id === id)
      .map((post) => {
        const creator = creatorById(post.creator_id);
        return {
          ...post,
          creator_name: creator.name,
          handle: creator.handle,
          primary_niche: creator.primary_niche,
          tiktok_followers: creator.tiktok_followers,
        };
      });
    const creatorsForForm = creators
      .map((creator) => ({
        ...creator,
        niche_match: nicheList(creator).includes(campaign.niche),
      }))
      .sort((a, b) => Number(b.niche_match) - Number(a.niche_match) || b.tiktok_followers - a.tiktok_followers);
    return {
      ...campaign,
      client_name: clientById(campaign.client_id).name,
      industry: clientById(campaign.client_id).industry,
      posts: campaignPosts,
      creatorsForForm,
      views: campaignPosts.reduce((sum, post) => sum + post.views, 0),
    };
  }

  function listImpact() {
    return clients
      .map((client) => {
        const clientPosts = posts
          .filter((post) => campaigns.find((campaign) => campaign.id === post.campaign_id)?.client_id === client.id)
          .map((post) => {
            const campaign = campaigns.find((item) => item.id === post.campaign_id);
            const creator = creatorById(post.creator_id);
            return { ...post, creator_name: creator.name, handle: creator.handle, campaign_name: campaign.name };
          });
        return {
          ...client,
          views: clientPosts.reduce((sum, post) => sum + post.views, 0),
          post_count: clientPosts.length,
          posts: clientPosts,
        };
      })
      .sort((a, b) => b.views - a.views || a.name.localeCompare(b.name));
  }

  function overviewStats() {
    return {
      creators: creators.length,
      views: posts.reduce((sum, post) => sum + post.views, 0),
      campaigns: campaigns.filter((campaign) => campaign.status !== "Closed").length,
    };
  }

  return { listNiches, listCreators, getCreator, listCampaigns, getCampaign, listImpact, overviewStats };
}

const seed = withPosts(seedPosts);

export const listNiches = seed.listNiches;
export const listCreators = seed.listCreators;
export const getCreator = seed.getCreator;
export const listCampaigns = seed.listCampaigns;
export const getCampaign = seed.getCampaign;
export const listImpact = seed.listImpact;
export const overviewStats = seed.overviewStats;
