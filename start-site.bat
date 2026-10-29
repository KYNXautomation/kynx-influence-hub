@echo off
rem Double-click to run the Kynx site on this PC. Keep this window open while you use the site.
cd /d "%~dp0"
start "" "http://localhost:3000/kynx-influence-hub/"
npm run dev
pause
