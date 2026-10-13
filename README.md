# Sam Walker — Portfolio

Static portfolio in HTML, CSS and vanilla JavaScript with GSAP, ScrollTrigger and Lenis (loaded from CDN).
No build step: open `index.html`, or upload the folder to GitHub Pages, Netlify, Vercel or any web host.

## Files
- `index.html` — page structure
- `css/style.css` — all styles
- `js/data.js` — **edit this**: name, email, GitHub/LinkedIn, projects, skills
- `js/main.js` — animations and interactions

## What moves
Preloader counter and curtain wipe · interactive thread canvas in the hero (move the cursor through it) ·
letter-by-letter name reveal and scrambled role text · custom blend-mode cursor with labels · magnetic buttons ·
velocity-reactive marquee · word-by-word About reveal and count-up stats · pinned horizontal project gallery ·
project index with a floating preview that follows the cursor · stacking skill cards · process line that draws itself ·
a red "trace" thread down the left edge that tracks scroll · contact letter wave and copy-to-clipboard ·
sliding project detail panel with "next project".

Reduced-motion users get a calm, static version; the custom cursor only appears on mouse devices.

## Project links
Ten projects link to live previews hosted on claude.ai. Those links are private until shared:
open each one in Claude and use **Share** to make it public, or host the projects yourself
(e.g. GitHub Pages) and replace the `live` URLs in `js/data.js`.
Projects with no `live` link (StockRoom, LinkLite, Clinic API, Expense Tracker) show a
"code on request" note; add a GitHub URL as `source` to show a View source button.
