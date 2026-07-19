# Product

## Register

product

## Platform

web

## Users

Two audiences. The primary user is the author, exploring their own Citi Bike trip analysis in a desktop browser session — adjusting filters, comparing station areas, and sanity-checking the scoring model. The secondary audience is external visitors who reach the deployed site: they explore the bundled NYC demo dataset, and can upload their own bike-share trip CSVs to run the same analysis entirely in their browser. External users get no setup instructions, so the interface must explain itself: what the score means, what data is loaded, and what uploading does.

## Product Purpose

An interactive dashboard that ranks Citi Bike station areas in NYC as potential food-cart locations, scored on trip volume, lunch-hour demand, weekday traffic, and casual rider activity. Success is deep exploration: the user can slice and filter the data thoroughly — by view mode, result count, and minimum lunch-hour trips — and reach their own conclusions about where a cart would thrive.

## Positioning

Scored, ranked recommendations: it turns raw Citi Bike trip data into an actionable ranked list of cart locations, not just a map of stations.

## Brand Personality

Clean, analytical, trustworthy. The interface should read like a well-made analytics tool: neutral chrome, precise numbers, and a map that carries the signal. Tone is quiet confidence — the data speaks, the UI stays out of the way.

## Anti-references

Not a generic Bootstrap dashboard: no default-widget clutter, no admin-panel chrome, no stacked panels of unstyled controls.

## Design Principles

- **The map is the hero.** Every screen decision defends the map's share of attention; controls are instruments, not furniture.
- **Numbers earn trust through precision.** Scores and trip counts are always legible, aligned, and consistently formatted.
- **Every control earns its place.** A filter exists only if it changes what the user sees; no speculative widgets.
- **Exploration without friction.** Changing a filter gives immediate, visible feedback on both map and list.

## Accessibility & Inclusion

Sensible defaults: good text contrast, keyboard-friendly controls, and colorblind-safe score encoding — the current green/orange/red score dots are a known issue and should be paired with a non-color channel (position, label, or shape) as the design evolves.
