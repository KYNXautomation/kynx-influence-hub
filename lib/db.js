import fs from "fs";
import path from "path";
import { DatabaseSync } from "node:sqlite";

const file = path.join(process.cwd(), "data", "kynx.sqlite");

const creators = [
  [1, "Sofia Cruz", "sofiasunday", "Beauty", 42800, "Manila", 3000, "Beauty routines and everyday product trials."],
  [2, "Maya Santos", "mayamakes", "Lifestyle", 18600, "Quezon City", 3000, "Home, routines, and day-in-the-life stories."],
  [3, "Leo Reyes", "leofinds", "Tech", 92000, "Cebu", 8000, "Gadgets, telco offers, and plain-language explainers."],
  [4, "Eli Navarro", "everydayeli", "Lifestyle", 12400, "Makati", 3000, "City errands, cafes, and weekly resets."],
  [5, "Isla Mendoza", "islaeats", "Food", 31000, "Davao", 3500, "Home cooking and grocery finds."],
  [6, "Noah Flores", "noahplays", "Gaming", 156000, "Pasig", 4000, "Mobile games and short reaction clips."],
  [7, "Chloe Lim", "chloeincolor", "Fashion", 67000, "Manila", 5000, "Outfit repeats, shopping edits, and beauty crossovers."],
  [8, "Luca Garcia", "lucaliving", "Lifestyle", 22100, "Baguio", 3000, "Slow weekends and product-in-use scenes."],
  [9, "Amara Tan", "amarastudio", "Beauty", 88000, "Makati", 10000, "Skin, makeup, and campaign-ready tutorials."],
  [10, "Finn Ramos", "finntalks", "Student life", 9800, "Quezon City", 5000, "Campus life and budget finds."],
  [11, "Zoe Rivera", "zoeonthego", "Travel", 54000, "Cebu", 12000, "City guides and trip diaries."],
  [12, "Kai Diaz", "kaicreates", "Tech", 41000, "Manila", 8000, "Setup tours and app walkthroughs."],
];

const extraNiches = [
  [1, "Lifestyle"],
  [7, "Beauty"],
];

const clients = [
  [1, "Shopee", "Marketplace"],
  [2, "Glow Lab", "Beauty"],
];

const campaigns = [
  [1, 1, "Shopee TTO · October", "Beauty", "Live", 10000, "2026-10-01", "Beauty creators for the October TikTok shop push."],
  [2, 2, "Glow Lab Launch", "Beauty", "Matching", 20000, "2026-10-20", "New serum launch. Match beauty creators before briefs go out."],
  [3, 1, "Pinakamurang Data", "Tech", "Live", 30000, "2026-10-06", "Tech explainers for a data offer."],
];

const posts = [
  [1, 1, 1, "TikTok", "Morning skin edit", "2026-10-07", 186400],
  [2, 1, 1, "TikTok", "Get ready with the set", "2026-10-08", 242100],
  [3, 1, 1, "TikTok", "Texture check", "2026-10-09", 98000],
  [4, 1, 1, "TikTok", "Night routine", "2026-10-10", 310500],
  [5, 1, 9, "TikTok", "Studio tutorial", "2026-10-11", 154200],
  [6, 3, 12, "TikTok", "What the offer actually is", "2026-10-08", 88000],
  [7, 3, 12, "TikTok", "Setup in two minutes", "2026-10-10", 42000],
  [8, 3, 3, "TikTok", "Which plan fits", "2026-10-09", 210000],
];

function migrate(db) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS clients (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      industry TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS creators (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      handle TEXT NOT NULL UNIQUE,
      primary_niche TEXT NOT NULL,
      tiktok_followers INTEGER NOT NULL,
      location TEXT NOT NULL,
      rate_php INTEGER NOT NULL,
      bio TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS creator_niches (
      creator_id INTEGER NOT NULL,
      niche TEXT NOT NULL,
      PRIMARY KEY (creator_id, niche),
      FOREIGN KEY (creator_id) REFERENCES creators(id)
    );
    CREATE TABLE IF NOT EXISTS campaigns (
      id INTEGER PRIMARY KEY,
      client_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      niche TEXT NOT NULL,
      status TEXT NOT NULL,
      min_tiktok_followers INTEGER NOT NULL,
      starts_on TEXT NOT NULL,
      brief TEXT NOT NULL,
      FOREIGN KEY (client_id) REFERENCES clients(id)
    );
    CREATE TABLE IF NOT EXISTS posts (
      id INTEGER PRIMARY KEY,
      campaign_id INTEGER NOT NULL,
      creator_id INTEGER NOT NULL,
      platform TEXT NOT NULL,
      title TEXT NOT NULL,
      published_on TEXT NOT NULL,
      views INTEGER NOT NULL,
      FOREIGN KEY (campaign_id) REFERENCES campaigns(id),
      FOREIGN KEY (creator_id) REFERENCES creators(id)
    );
  `);

  const count = db.prepare("SELECT COUNT(*) AS n FROM creators").get().n;
  if (count > 0) return;

  const insertClient = db.prepare("INSERT INTO clients (id, name, industry) VALUES (?, ?, ?)");
  const insertCreator = db.prepare(
    "INSERT INTO creators (id, name, handle, primary_niche, tiktok_followers, location, rate_php, bio) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
  );
  const insertNiche = db.prepare("INSERT INTO creator_niches (creator_id, niche) VALUES (?, ?)");
  const insertCampaign = db.prepare(
    "INSERT INTO campaigns (id, client_id, name, niche, status, min_tiktok_followers, starts_on, brief) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
  );
  const insertPost = db.prepare(
    "INSERT INTO posts (id, campaign_id, creator_id, platform, title, published_on, views) VALUES (?, ?, ?, ?, ?, ?, ?)",
  );

  db.exec("BEGIN");
  try {
    for (const row of clients) insertClient.run(...row);
    for (const row of creators) {
      insertCreator.run(...row);
      insertNiche.run(row[0], row[3]);
    }
    for (const row of extraNiches) insertNiche.run(...row);
    for (const row of campaigns) insertCampaign.run(...row);
    for (const row of posts) insertPost.run(...row);
    db.exec("COMMIT");
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }
}

export function getDb() {
  if (!globalThis.__kynxDb) {
    fs.mkdirSync(path.dirname(file), { recursive: true });
    const db = new DatabaseSync(file);
    db.exec("PRAGMA foreign_keys = ON");
    migrate(db);
    globalThis.__kynxDb = db;
  }
  return globalThis.__kynxDb;
}

const creatorOrder = {
  followers_desc: "c.tiktok_followers DESC, c.name COLLATE NOCASE ASC",
  followers_asc: "c.tiktok_followers ASC, c.name COLLATE NOCASE ASC",
  views_desc: "views_generated DESC, c.name COLLATE NOCASE ASC",
  name: "c.name COLLATE NOCASE ASC",
};

export function listCreators({ niche = "", min = 0, max = 100_000_000, q = "", sort = "followers_desc" }) {
  const order = creatorOrder[sort] || creatorOrder.followers_desc;
  const query = q.trim().toLowerCase();
  return getDb()
    .prepare(
      `
      SELECT c.id, c.name, c.handle, c.primary_niche, c.tiktok_followers, c.location, c.rate_php, c.bio,
        (SELECT COALESCE(SUM(views), 0) FROM posts p WHERE p.creator_id = c.id) AS views_generated,
        (
          SELECT GROUP_CONCAT(niche, ' · ')
          FROM creator_niches
          WHERE creator_id = c.id
        ) AS niches
      FROM creators c
      WHERE c.tiktok_followers >= ?
        AND c.tiktok_followers <= ?
        AND (? = '' OR EXISTS (
          SELECT 1 FROM creator_niches n WHERE n.creator_id = c.id AND n.niche = ?
        ))
        AND (? = '' OR lower(c.name) LIKE ? OR lower(c.handle) LIKE ?)
      ORDER BY ${order}
    `,
    )
    .all(min, max, niche, niche, query, `%${query}%`, `%${query}%`);
}

export function listNiches() {
  return getDb()
    .prepare("SELECT DISTINCT niche FROM creator_niches ORDER BY niche")
    .all()
    .map((row) => row.niche);
}

export function getCreator(id) {
  const creator = getDb()
    .prepare(
      `
      SELECT c.*,
        (SELECT COALESCE(SUM(views), 0) FROM posts p WHERE p.creator_id = c.id) AS views_generated,
        (
          SELECT GROUP_CONCAT(niche, ' · ')
          FROM creator_niches
          WHERE creator_id = c.id
        ) AS niches
      FROM creators c
      WHERE c.id = ?
    `,
    )
    .get(id);
  if (!creator) return null;
  const posts = getDb()
    .prepare(
      `
      SELECT p.*, ca.name AS campaign_name, cl.name AS client_name, ca.id AS campaign_id
      FROM posts p
      JOIN campaigns ca ON ca.id = p.campaign_id
      JOIN clients cl ON cl.id = ca.client_id
      WHERE p.creator_id = ?
      ORDER BY p.published_on, p.id
    `,
    )
    .all(id);
  return { ...creator, posts };
}

export function listCampaigns() {
  return getDb()
    .prepare(
      `
      SELECT ca.*, cl.name AS client_name,
        (SELECT COUNT(*) FROM posts p WHERE p.campaign_id = ca.id) AS post_count,
        (SELECT COALESCE(SUM(views), 0) FROM posts p WHERE p.campaign_id = ca.id) AS views
      FROM campaigns ca
      JOIN clients cl ON cl.id = ca.client_id
      ORDER BY ca.starts_on DESC, ca.id DESC
    `,
    )
    .all();
}

export function getCampaign(id) {
  const campaign = getDb()
    .prepare(
      `
      SELECT ca.*, cl.name AS client_name, cl.industry
      FROM campaigns ca
      JOIN clients cl ON cl.id = ca.client_id
      WHERE ca.id = ?
    `,
    )
    .get(id);
  if (!campaign) return null;
  const posts = getDb()
    .prepare(
      `
      SELECT p.*, c.name AS creator_name, c.handle, c.primary_niche, c.tiktok_followers
      FROM posts p
      JOIN creators c ON c.id = p.creator_id
      WHERE p.campaign_id = ?
      ORDER BY p.published_on, p.id
    `,
    )
    .all(id);
  const creatorsForForm = getDb()
    .prepare(
      `
      SELECT c.id, c.name, c.handle, c.primary_niche, c.tiktok_followers,
        EXISTS (
          SELECT 1 FROM creator_niches n WHERE n.creator_id = c.id AND n.niche = ?
        ) AS niche_match
      FROM creators c
      ORDER BY niche_match DESC, c.tiktok_followers DESC
    `,
    )
    .all(campaign.niche);
  const views = posts.reduce((sum, post) => sum + post.views, 0);
  return { ...campaign, posts, creatorsForForm, views };
}

export function listImpact() {
  const clients = getDb()
    .prepare(
      `
      SELECT cl.id, cl.name, cl.industry,
        COALESCE(SUM(p.views), 0) AS views,
        COUNT(p.id) AS post_count
      FROM clients cl
      LEFT JOIN campaigns ca ON ca.client_id = cl.id
      LEFT JOIN posts p ON p.campaign_id = ca.id
      GROUP BY cl.id
      ORDER BY views DESC, cl.name
    `,
    )
    .all();
  const posts = getDb()
    .prepare(
      `
      SELECT p.id, p.title, p.views, p.published_on, p.platform, p.campaign_id,
        c.name AS creator_name, c.handle,
        ca.name AS campaign_name, cl.id AS client_id
      FROM posts p
      JOIN creators c ON c.id = p.creator_id
      JOIN campaigns ca ON ca.id = p.campaign_id
      JOIN clients cl ON cl.id = ca.client_id
      ORDER BY p.published_on, p.id
    `,
    )
    .all();
  return clients.map((client) => ({
    ...client,
    posts: posts.filter((post) => post.client_id === client.id),
  }));
}

export function overviewStats() {
  const db = getDb();
  const creators = db.prepare("SELECT COUNT(*) AS n FROM creators").get().n;
  const views = db.prepare("SELECT COALESCE(SUM(views), 0) AS n FROM posts").get().n;
  const campaigns = db.prepare("SELECT COUNT(*) AS n FROM campaigns WHERE status != 'Closed'").get().n;
  return { creators, views, campaigns };
}
