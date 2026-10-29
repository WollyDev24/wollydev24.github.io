# YouShade Network — Central Hub

## Goal
A brand-new, fully self-contained sub-site at `network/` (served at `wolly.is-a.dev/network/`) that acts as the central hub for the YouShade brand:
1. **Projects** — all YouShade projects with status, tags and links
2. **Collaborators** — people in the channel (placeholder data for now)
3. **Updates (Blog)** — posts about YouShade project progress

**Design:** Aurora glass — evolved from `aurora.html` (dark bg, drifting blurred blobs, cyan/violet/pink gradients, glass cards, animated conic rims). Completely independent from `material.css`/`material.js`. No shared assets, no Material Symbols font — inline SVG + emoji only.

**Structure:** Single scrolling page with a sticky glass nav that anchors to each section. Content loaded client-side from JSON files.

## New files

```
network/
├── index.html              # single-page hub
├── network.css             # aurora glass design system (self-contained)
├── network.js              # JSON loading, rendering, interactions
└── data/
    ├── projects.json       # YouShade projects
    ├── collaborators.json  # channel collaborators (placeholder)
    └── posts.json          # YouShade update posts
```

No changes to existing site files (optional link on main `index.html` offered at the end).

## Page anatomy (index.html)

1. **Sticky glass nav** — brand "YouShade Network" + anchor links (Projects · Collaborators · Updates) + "Main site ↗" back-link to `wolly.dev`
2. **Hero** — gradient headline "YouShade Network", tagline, live stat chips (project / collaborator / post counts, filled from JSON), pulsing "Active" status pill
3. **Projects section** (`#projects`) — responsive glass card grid; each card: emoji/initials avatar with gradient ring, name, description, status chip (Active / In Development / Discontinued), tag pills, arrow → external link. Cards get cursor-glare + hover lift (from aurora.html)
4. **Collaborators section** (`#collaborators`) — glass cards: gradient-ring initials avatar, name, role, short bio, tag pills, optional social link icons (GitHub/Telegram/Discord inline SVGs)
5. **Updates section** (`#updates`) — expandable glass list rows (same interaction as your `blog.html`): emoji icon, title, date chip, excerpt; click expands content + images. Accordion behavior — one open at a time
6. **Footer** — back to main site, GitHub, Discord, Telegram links
7. Background layer: fixed drifting blobs + faint grid overlay + vignette (reused pattern from aurora.html), `prefers-reduced-motion` respected

## JSON schemas

`data/projects.json` — seeded from your real projects (YouShadeKWGT, YouShade Expressive, Sharky/YouShadeBot + one in-dev placeholder):
```json
{
  "projects": [
    {
      "name": "YouShadeKWGT",
      "description": "A modern KWGT widget pack with Material You styling.",
      "icon": "🌙",
      "status": "discontinued",
      "tags": ["KWGT", "Kustom"],
      "url": "https://github.com/wollydev24/YouShadeKWGT"
    }
  ]
}
```

`data/collaborators.json` — 3 placeholder entries:
```json
{
  "collaborators": [
    {
      "name": "Placeholder Name",
      "role": "Designer",
      "initials": "PN",
      "bio": "Short description of what they contribute.",
      "tags": ["Art", "Widgets"],
      "links": { "github": "https://...", "telegram": "https://t.me/..." }
    }
  ]
}
```
Avatars are CSS gradient initials rings — zero external requests, you replace with real people later.

`data/posts.json` — array matching the shape of your existing `data/blog.json` (title, date, emoji, excerpt, content, images), seeded with 2 placeholder YouShade update posts.

## network.js behavior
- Vanilla JS, no dependencies (matches site conventions — XHR/fetch of local JSON like `blog.html`)
- `fetch('data/*.json')` → render all three sections; graceful "Failed to load" chips on error
- Accordion expand/collapse for posts
- Stat counters in hero derived from loaded JSON
- Optional per-card mouse glare (only when `hover: hover` + no reduced motion)
- All user-editable JSON fields rendered as text via `textContent`-safe paths where practical; content field allows the same simple HTML passthrough as existing `blog.json` (trusted own data)

## Verification
1. `jq . network/data/*.json` — valid JSON
2. Serve locally: `python3 -m http.server` from repo root → open `http://localhost:8000/network/`
3. Check all three sections render from JSON, accordion works, nav anchors scroll, mobile width (~375px) holds up
4. Confirm no requests to `material.css` / fonts — fully standalone

## Optional (ask after build)
Add a small "YouShade Network" card/link on the main `index.html` featured-work grid pointing to `/network`.
