# AJ Mendes Portfolio

A static HTML, CSS, and JavaScript portfolio focused on secure software, tested systems, and applied computer science. The site is designed as an interactive systems lab: each featured project has a dimensional homepage portal and a dedicated case-study page.

## Local preview

Run the site through a local server so navigation, URL state, and view transitions behave consistently:

```bash
python3 -m http.server 8000
```

Then open `http://127.0.0.1:8000/index.html`.

## Project pages

- `secure-chat-app.html` — encrypted client/relay/client communication model with Operator and Builder perspectives.
- `clue-game.html` — Java Swing board-game system emphasizing configuration, graph movement, OOP, and testing.
- `call-for-fire-trainer.html` — privacy-conscious training-aid case study with intentionally abstracted implementation details.

## Signature interactions

- A full-page project stage with overlapping, isometric project portals.
- Drag/swipe, previous/next controls, numbered project controls, and arrow-key navigation.
- Project-specific animated visuals that run only for the selected project.
- Shared-element transitions from the selected homepage project into its case-study page, with normal links as the fallback.
- URL-addressable Operator and Builder perspectives on each project page.
- A staged Secure Chat communication model showing endpoint and relay responsibilities.

## Interaction quality rules

- Decorative planes must never cover project evidence or controls.
- Every homepage project portal uses a stable, flat sibling-layer group inside the isometric card. Project-specific illustrations keep their own depth cues, but no parent plane can rotate across or cover them during pointer movement.
- Project animation must communicate project behavior; generic scanner overlays are disabled.
- Homepage portals do not use pointer-driven parent rotation. Secure Chat packets, ClueGame tokens, and the Call for Fire reticle remain project-specific animations.
- Navigation must remain usable by mouse, drag, visible controls, and keyboard.
- Motion is a progressive enhancement and must respect reduced-motion preferences.

## Current verification

The homepage project stage has been checked with:

- Pointer movement at opposite corners of the ClueGame visual.
- Drag navigation from ClueGame to Call for Fire.
- Previous/next control navigation.
- Arrow-key navigation in both directions.
- Multiple frames of the selected-project animation cycle.
- Browser console inspection and JavaScript syntax validation.

The same compositor-safe portal rule and cache version are shared by Secure Chat, ClueGame, and Call for Fire. All four HTML entry points load `site-portal-stability-v1` assets.

## Planning documents

Local working notes are maintained in `status.md` and `PORTFOLIO-UI-UX-PLAN.md`. Markdown working files are ignored by default; this README remains tracked as the repository overview.
