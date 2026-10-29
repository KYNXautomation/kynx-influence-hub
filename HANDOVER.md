# Handover: KYNX Influence Hub website

Read this first. When you finish a step, add a short note under "Progress log" at the bottom.

## The project

- Next.js 15 static site (`output: "export"`, basePath `/kynx-influence-hub`).
- Folder: `C:\Users\USER\OneDrive\Documents\KYNX automation\kynx-influence-hub`
- Run it: double-click `start-site.bat` (or `npm run dev`), then open http://localhost:3000/kynx-influence-hub/
- Do **not** run `next build` while the dev server is running. It corrupts the dev server's `.next` folder.
- Git branch: `brand-public-pages`. Nothing from the latest work is committed yet.

## Current task: connect the campaign Google Sheet to the site

The Google Sheet is for **campaign management only**. Do not put artist profiles in it.

What already exists:
- Two-way campaign sync: `components/SheetSync.js` and `lib/sheetSync.js`.
- It shows as a "Google Sheet" panel on each campaign page (staff workspace → Campaigns → open a campaign), for Admin and Specialists.
- It syncs one sheet tab per campaign every 30 seconds. Columns: Record ID, Creator, Handle, Program, PIC, KOL Confirmation, KYNX Approval, Brand Approval, Rate, Invoice, MOA, Draft Status, Post Due, Post Date, Views, Updated At.
- When both sides changed, the newer edit wins (the sheet's "Updated At" against the site's).
- The Apps Script for the sheet is in `lib/sheetScript.js`. The panel's "Copy script" button copies it.

Setup steps for the sheet:
1. Open the campaign Google Sheet → Extensions → Apps Script (from inside the sheet, not script.google.com).
2. Paste the script, name the project (for example "KYNX Sync"), and save.
3. Project Settings → Script properties → add `KYNX_KEY` with a secret value.
4. Deploy → New deployment → Web app · Execute as: Me · Who has access: Anyone.
5. Approve access. If Google says "hasn't verified this app": Advanced → Go to project → Allow.

**Blocker:** the user's deploy fails with Google's "Something went wrong — please reload the page". The project was still named "Untitled project". Likely causes:
- Several Google accounts signed in at once. Retry in an Incognito window with only the sheet owner's account.
- The project wasn't saved or named before deploying.
- The script was created on script.google.com instead of from inside the sheet.

Next step after the deploy works:
- Get the web app URL (ends in `/exec`).
- Today each staff member pastes the URL and key into the panel on their own browser (saved in localStorage).
- The user may want the URL built into the site so every staff member is connected automatically and only types the key once.

## Done in the last session (working, checked on the dev server)

- Public pages: `/how-it-works`, `/for-creators`, `/for-brands`, and `/news`.
  - News uses a two-column card layout. Data is in `lib/news.js`. Thumbnails are the articles' own preview images, loaded from the publishers' sites.
- Home page: video slider, then "Who we are", then a "Contact us" form. The form opens the visitor's email app; there is no server.
- Staff pages use the home page colors (navy with coral `#ef633d` in light mode and `#ff9978` in dark mode).
- New "Talent manager" role and `/talents` page (`lib/talents.js`, `lib/useTalents.js`, saved in the browser). Manager names Bea, Carlo and Jaz are placeholders; ask the user for the real names.
- Reviews page: choose a brand first. Each brand shows a count badge of creators waiting for approval.
- Artist photos are in `public/artists/<id>.jpg` (3:4 portrait).
  - Clean photos were taken from the KYNX "Creator Showcase" videos, and bios and followers were updated in `lib/model.js`.
  - Added artists `c34` Andrea So and `c35` Julia Montes.

## Still open

- **Señorito Karlo (`c22`):** the photo fits the frame but still has a smudge on the corset. The user will download his Instagram showcase video to Downloads. Take the clean photo from a frame about 5 seconds in; the photo box is about x 211, y 340, width 298, height 397 in the 720×1280 frame.
- **Criza Taa:** the user mentioned a document for her profile that never arrived.
- **Admin artist edits** (staff Artists / Roster page) save only in the admin's own browser. A shared place to store them still needs deciding; it must **not** be the campaign sheet.

## Progress log

- (add notes here)
