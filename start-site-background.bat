@echo off
rem Starts the Kynx site when Windows starts, without opening the browser.
rem Open http://localhost:3000/kynx-influence-hub/ whenever you need it. Closing this window stops the site.
title KYNX site (keep open)
cd /d "%~dp0"
npm run dev
