// Puts the site's public artist and collaboration data into the chatbot's instructions.
// Run: node n8n/sync-knowledge.mjs            (updates n8n/kynx-chatbot.json)
//      N8N_API_KEY=... node n8n/sync-knowledge.mjs   (also updates the live n8n workflow)
// shortcut: reads the code's seed data, not edits saved in browsers from the staff editor; rerun after changing lib/model.js or lib/collaborations.js.
import fs from "node:fs";
import { creators } from "../lib/model.js";

const site = "https://kynxautomation.github.io/kynx-influence-hub";
const workflowFile = new URL("./kynx-chatbot.json", import.meta.url);
const n8n = { base: "https://kynx.app.n8n.cloud/api/v1", workflowId: "n03bSeEx9wjmqLNj" };
const marker = "\n\n## Site data";

// collaborations.js imports React, so take its seed array as plain data.
const collabSource = fs.readFileSync(new URL("../lib/collaborations.js", import.meta.url), "utf8");
const collabArray = collabSource.match(/export const seedCollaborations = (\[[\s\S]*?\n\]);/)[1];
const collaborations = new Function(`return ${collabArray}`)().filter((item) => item.published);

const byId = Object.fromEntries(creators.map((c) => [c.id, c]));
const handle = (url, platform) => url ? `${platform} ${url.replace(/\/$/, "").split("/").pop()}` : "";

// Public fields only: never manager, rates or anything from the finance sheet.
const artistLines = creators.filter((c) => c.manager).map((c) => [
  `- ${c.name}`,
  c.niche,
  c.location,
  c.followers ? `${Math.round(c.followers / 1000)}K Instagram followers` : "",
  [handle(c.instagram, "IG"), handle(c.tiktok, "TikTok"), handle(c.facebook, "FB")].filter(Boolean).join(", "),
  `profile ${site}/artists/${c.id}/`,
  c.bio,
].filter(Boolean).join(" | "));

const collabLines = collaborations.map((item) => [
  `- ${item.brand}: ${item.title}`,
  item.date,
  item.summary,
  item.artistIds.length ? `artists: ${item.artistIds.map((id) => byId[id]?.name).filter(Boolean).join(", ")}` : "",
  item.did.length ? `made: ${item.did.join("; ")}` : "",
  item.results.length ? `results: ${item.results.join("; ")}` : "",
  `case study ${site}/collaborations/case/?id=${item.id}`,
].filter(Boolean).join(" | "));

const knowledge = `${marker} (public, from the website)

KYNX exclusive creators (${artistLines.length}). Follower counts are approximate; send exact numbers and rates questions to /contact/:
${artistLines.join("\n")}

Collaborations and case studies (${collabLines.length}). Only state results listed here:
${collabLines.join("\n")}`;

const withKnowledge = (message) => message.split(marker)[0] + knowledge;
const agentOf = (workflow) => workflow.nodes.find((node) => node.type.endsWith(".agent"));

const local = JSON.parse(fs.readFileSync(workflowFile, "utf8"));
agentOf(local).parameters.options.systemMessage = withKnowledge(agentOf(local).parameters.options.systemMessage);
fs.writeFileSync(workflowFile, JSON.stringify(local, null, 2) + "\n");
console.log(`n8n/kynx-chatbot.json: ${artistLines.length} artists, ${collabLines.length} collaborations`);

const key = process.env.N8N_API_KEY;
if (key) {
  const url = `${n8n.base}/workflows/${n8n.workflowId}`;
  const headers = { "X-N8N-API-KEY": key, "Content-Type": "application/json" };
  const live = await (await fetch(url, { headers })).json();
  if (!live.nodes) throw new Error(`n8n read failed: ${JSON.stringify(live).slice(0, 200)}`);
  const agent = agentOf(live);
  agent.parameters.options.systemMessage = withKnowledge(agent.parameters.options.systemMessage || "");
  const response = await fetch(url, { method: "PUT", headers, body: JSON.stringify({ name: live.name, nodes: live.nodes, connections: live.connections, settings: { executionOrder: "v1" } }) });
  if (!response.ok) throw new Error(`n8n update failed: HTTP ${response.status} ${(await response.text()).slice(0, 200)}`);
  console.log("live n8n workflow updated");
}
