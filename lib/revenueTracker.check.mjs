// Run: node lib/revenueTracker.check.mjs — checks the formulas against rows from the finance sheet.
import assert from "node:assert/strict";
import { trackers, computeRow, rowsFromPaste, toIsoDate } from "./revenueTracker.js";

const tab = (id) => trackers.find((t) => t.id === id);

// Exclusive without SI: Net Pay 10,000.
const a = computeRow(tab("excl"), { netPay: 10000 });
assert.deepEqual([a.kynxRevenue, a.tmCommission, a.kynxNet, a.talentPay], [1500, 225, 1275, 8500]);

// Exclusive with SI: Net Receivable 36,266.67, VAT 4,266.67.
const b = computeRow(tab("excl-si"), { netReceivable: 36266.67, vat: 4266.67 });
assert.deepEqual([b.netAfterVat, b.kynxRevenue, b.tmCommission, b.kynxNet, b.talentPay], [32000, 4800, 720, 4080, 27200]);

// Non-exclusive with SI: KYNX Revenue 19,000 gives 15% commission.
const c = computeRow(tab("nonexcl-si"), { kynxRevenue: 19000 });
assert.deepEqual([c.tmCommission, c.kynxNet], [2850, 16150]);

// Paste: header skipped, quoted multi-line cell stays one cell, dates and pesos parsed.
const pasted = rowsFromPaste(tab("excl"), 'Project Date\tCreator Name\n46203\tCreator A\t"https://a\nhttps://b"\tExclusive\tBrand A\tAndrea\tCampaign A\t₱10,000\n');
assert.equal(pasted.length, 1);
assert.equal(pasted[0].projectDate, "2026-06-30");
assert.equal(pasted[0].postedLink, "https://a\nhttps://b");
assert.equal(pasted[0].netPay, 10000);
assert.equal(toIsoDate("July 21, 2026"), "2026-07-21");
assert.equal(toIsoDate("Aug. 11, 2026"), "2026-08-11");
console.log("revenue tracker checks pass");
