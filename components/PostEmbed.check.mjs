// Run: node components/PostEmbed.check.mjs
import assert from "node:assert";
import fs from "node:fs";

const source = fs.readFileSync(new URL("./PostEmbed.js", import.meta.url), "utf8");
const embedUrl = new Function(`${source.slice(source.indexOf("function embedUrl"), source.indexOf("export function PostEmbed"))}; return embedUrl;`)();

assert.equal(embedUrl("https://www.tiktok.com/@pinkprincess720/video/7400000000000000001?lang=en"), "https://www.tiktok.com/embed/v2/7400000000000000001");
assert.equal(embedUrl("https://www.instagram.com/p/DfjiMdIjdGD/?img_index=1"), "https://www.instagram.com/p/DfjiMdIjdGD/embed/captioned/");
assert.equal(embedUrl("https://www.instagram.com/reel/Abc_1-x/"), "https://www.instagram.com/p/Abc_1-x/embed/captioned/");
assert.equal(embedUrl("https://example.com/video/123"), "");
console.log("PostEmbed checks pass");
