// The Google Apps Script that goes into the campaign Google Sheet (Extensions → Apps Script).
// The campaign page shows a "Copy script" button for this text. Keep the header names in sync with lib/sheetSync.js.
export const sheetScript = String.raw`// KYNX Influence Hub · two-way sync for this Google Sheet.
// Setup: Project Settings → Script properties → add KYNX_KEY with any long secret.
// Then Deploy → New deployment → Web app · Execute as: Me · Who has access: Anyone.

var HEADERS = ["Record ID", "Creator", "Handle", "Program", "PIC", "KOL Confirmation", "KYNX Approval", "Brand Approval", "Rate", "Invoice", "MOA", "Draft Status", "Post Due", "Post Date", "Views", "Updated At"];
var DATE_COLUMNS = ["Post Due", "Post Date"];

// The spreadsheet to sync. Left alone, it's the sheet this script is attached to.
// A standalone script sets KYNX_SHEET_ID in another file and runs setup() once.
function book() {
  if (typeof KYNX_SHEET_ID === "string" && KYNX_SHEET_ID) return SpreadsheetApp.openById(KYNX_SHEET_ID);
  return SpreadsheetApp.getActiveSpreadsheet();
}

// Standalone scripts only: run once from the editor to approve access and start stamping edits.
function setup() {
  if (typeof KYNX_SHEET_ID !== "string" || !KYNX_SHEET_ID) return "Attached scripts need no setup.";
  ScriptApp.getProjectTriggers().forEach(function (trigger) {
    if (trigger.getHandlerFunction() === "onEdit") ScriptApp.deleteTrigger(trigger);
  });
  ScriptApp.newTrigger("onEdit").forSpreadsheet(KYNX_SHEET_ID).onEdit().create();
  return "Connected to " + book().getName();
}

function doGet() {
  return out({ ok: true, message: "KYNX sheet sync is running. The site talks to it with POST." });
}

function doPost(e) {
  var body;
  try {
    body = JSON.parse(e.postData.contents);
  } catch (err) {
    return out({ ok: false, error: "The request was not JSON." });
  }
  // A script property wins; a KYNX_KEY_FILE constant in another script file works too (used by command-line setup).
  var key = PropertiesService.getScriptProperties().getProperty("KYNX_KEY") || (typeof KYNX_KEY_FILE === "string" ? KYNX_KEY_FILE : "");
  if (!key) return out({ ok: false, error: "Add KYNX_KEY under Project Settings → Script properties." });
  if (body.key !== key) return out({ ok: false, error: "The sync key does not match KYNX_KEY." });

  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    var sheet = tabFor(body.tab);
    var skipped = Array.isArray(body.rows) ? write(sheet, body.rows) : 0;
    return out({ ok: true, tab: sheet.getName(), skipped: skipped, rows: read(sheet) });
  } finally {
    lock.releaseLock();
  }
}

// Stamps "Updated At" when a person edits a row, so the site knows the sheet is newer.
function onEdit(e) {
  var sheet = e.range.getSheet();
  var map = headerMap(sheet);
  if (!map["Record ID"] || !map["Updated At"]) return;
  var stampColumn = map["Updated At"];
  if (e.range.getColumn() === stampColumn && e.range.getNumColumns() === 1) return;
  var first = Math.max(2, e.range.getRow());
  var last = e.range.getLastRow();
  if (last < first) return;
  var now = new Date().toISOString();
  var stamps = [];
  for (var row = first; row <= last; row++) stamps.push([now]);
  sheet.getRange(first, stampColumn, stamps.length, 1).setNumberFormat("@").setValues(stamps);
}

function tabFor(name) {
  var spreadsheet = book();
  var title = String(name || "KYNX tracker").replace(/[\[\]\*\?\/\\:]/g, " ").slice(0, 90).trim() || "KYNX tracker";
  var sheet = spreadsheet.getSheetByName(title) || spreadsheet.insertSheet(title);
  var width = Math.max(sheet.getLastColumn(), 1);
  var current = sheet.getRange(1, 1, 1, width).getValues()[0].map(function (cell) { return String(cell).trim(); });
  var missing = HEADERS.filter(function (header) { return current.indexOf(header) < 0; });
  if (missing.length) {
    var start = current.join("") ? current.length + 1 : 1;
    sheet.getRange(1, start, 1, missing.length).setValues([missing]).setFontWeight("bold");
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function headerMap(sheet) {
  var width = sheet.getLastColumn();
  var map = {};
  if (!width) return map;
  sheet.getRange(1, 1, 1, width).getValues()[0].forEach(function (cell, index) {
    var name = String(cell).trim();
    if (name && !map[name]) map[name] = index + 1;
  });
  return map;
}

function cellText(value, header) {
  if (value instanceof Date) {
    if (header === "Updated At") return value.toISOString();
    return Utilities.formatDate(value, Session.getScriptTimeZone(), "yyyy-MM-dd");
  }
  return value === null || value === undefined ? "" : String(value).trim();
}

function read(sheet) {
  var map = headerMap(sheet);
  var lastRow = sheet.getLastRow();
  var lastColumn = sheet.getLastColumn();
  if (lastRow < 2 || !lastColumn) return [];
  var values = sheet.getRange(2, 1, lastRow - 1, lastColumn).getValues();
  var rows = [];
  values.forEach(function (line, index) {
    var row = { _row: index + 2 };
    var filled = false;
    HEADERS.forEach(function (header) {
      if (!map[header]) return;
      row[header] = cellText(line[map[header] - 1], header);
      if (row[header]) filled = true;
    });
    if (filled) rows.push(row);
  });
  return rows;
}

function write(sheet, rows) {
  var map = headerMap(sheet);
  var lastColumn = sheet.getLastColumn();
  var lastRow = sheet.getLastRow();
  var byId = {};
  if (lastRow >= 2) {
    sheet.getRange(2, map["Record ID"], lastRow - 1, 1).getValues().forEach(function (line, index) {
      var id = String(line[0]).trim();
      if (id) byId[id] = index + 2;
    });
  }
  var skipped = 0;
  var next = lastRow + 1;
  rows.forEach(function (row) {
    var target = byId[row["Record ID"]] || (row._row && row._row >= 2 ? row._row : 0);
    if (!target) target = next++;
    var line = target <= lastRow ? sheet.getRange(target, 1, 1, lastColumn).getValues()[0] : new Array(lastColumn).fill("");
    var existingId = cellText(line[map["Record ID"] - 1], "Record ID");
    if (existingId && existingId !== row["Record ID"]) {
      target = next++;
      line = new Array(lastColumn).fill("");
    } else {
      // Someone edited this row in the sheet after the site read it: keep the person's edit.
      var sheetTime = Date.parse(cellText(line[map["Updated At"] - 1], "Updated At")) || 0;
      var siteTime = Date.parse(row["Updated At"] || "") || 0;
      if (sheetTime > siteTime) {
        skipped++;
        return;
      }
    }
    HEADERS.forEach(function (header) {
      if (map[header] && Object.prototype.hasOwnProperty.call(row, header)) line[map[header] - 1] = row[header];
    });
    var range = sheet.getRange(target, 1, 1, lastColumn);
    if (map["Updated At"]) sheet.getRange(target, map["Updated At"]).setNumberFormat("@");
    DATE_COLUMNS.forEach(function (header) {
      if (map[header]) sheet.getRange(target, map[header]).setNumberFormat("yyyy-mm-dd");
    });
    range.setValues([line]);
    if (target > lastRow) lastRow = target;
  });
  return skipped;
}

function out(value) {
  return ContentService.createTextOutput(JSON.stringify(value)).setMimeType(ContentService.MimeType.JSON);
}
`;
