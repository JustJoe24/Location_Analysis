---
target: website
total_score: 30
p0_count: 0
p1_count: 2
timestamp: 2026-07-19T02-43-33Z
slug: website-index-html
---
Method: dual-agent (A: design-review sub-agent · B: detector sub-agent)

# Design Critique — website/index.html (NYC Food Cart Location Analysis)

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 4 | n/a — loading status, live upload progress, dataset meta, "(N shown)" heading |
| 2 | Match System / Real World | 3 | "Score 0.876" has no unit/intuition until the details disclosure; "Casual trips" jargon undecoded in popups |
| 3 | User Control and Freedom | 3 | Reset-to-demo good; no undo beyond reset, no URL state to restore a view |
| 4 | Consistency and Standards | 2 | "All locations" behaves identically to "Top locations" (same sort, same top-N cap) — the label lies |
| 5 | Error Prevention | 3 | Column validation + fitted slider good; silently dropped rows never surfaced |
| 6 | Recognition Rather Than Recall | 3 | Results heading never restates active view mode; legend scrolls away with long lists |
| 7 | Flexibility and Efficiency | 2 | No keyboard shortcuts, no permalink/share, no export; slider-only threshold (~54 keypresses to sweep) |
| 8 | Aesthetic and Minimalist Design | 4 | n/a — genuinely disciplined; map holds ~70% of viewport |
| 9 | Error Recovery | 3 | Excellent error copy (names file + missing columns); mid-file failure has no partial-result explanation |
| 10 | Help and Documentation | 3 | Methodology disclosure + privacy hint good; "Least active" mode unexplained |
| **Total** | | **30/40** | **Good — solid foundation; consistency and efficiency are the drags** |

## Anti-Patterns Verdict

Does NOT read as AI-generated. No gradient hero, no purple accent, no shadow card grid; one typeface, hairlines, data-owns-color, tabular numerals — a deliberate hand following DESIGN.md. Caveat: personality is entirely negative space; nothing says *this tool* vs *a well-behaved analyst tool*.

Deterministic scan: static markup scan of website/index.html CLEAN (0 findings). Runtime in-page detector: 2 findings, both discounted — (1) Leaflet map overflow-clipping is by-design library behavior (false positive); (2) h1→h3 heading skip came from a stale cached pre-redesign page; current markup verified h1→h2→h3. Both assessments independently hit the stale-cache issue: the static server sends no cache headers.

## Priority Issues

1. **[P1] "All locations" is a broken promise.** viewMode "all" falls into the same branch as "top": sort desc + slice(0, topN). Selecting it with N=10 shows the top 10. Silently corrupts the user's mental model ("none in Brooklyn scored well" — false). Fix: bypass the topN slice in all-mode (and repurpose/disable the count select), or delete the option. → /impeccable polish
2. **[P1] White-on-green rank numerals fail contrast: 3.30:1** (#fff on #16a34a at 11–12px) — below WCAG AA 4.5:1, and these numerals ARE the promised second channel for colorblind users. White-on-red passes (4.83:1), ink-on-amber passes (6.83:1). Fix: darken green to ~#15803d/#166534 or use ink text on all bands. → /impeccable polish
3. **[P2] Mobile severs the core feedback loop.** At 375×812 the first filter sits at y≈835 (below fold), so filtering happens with the map scrolled away; the full-width 55vh map also intercepts touch-drag, making the page hard to scroll. Fix: collapse header/upload into a disclosure on mobile so filters sit near the map fold; add gesture handling. → /impeccable adapt
4. **[P2] Rank semantics silently invert in "Least active" mode.** Worst station becomes red marker "1"; heading and legend never acknowledge the flip; first-timers read "#1" as "best". Fix: heading restates mode ("Least active — 10 shown") and/or number from the bottom. → /impeccable clarify
5. **[P3] Integrity leaks:** Leaflet default popup ships a box-shadow (only shadow on screen; violates No-Shadow Rule — restyle .leaflet-popup-content-wrapper); methodology says "11am–2pm" but code counts hours 11–14 inclusive (through 2:59pm); map.flyTo duration ignores prefers-reduced-motion (CSS kill-switch can't reach Leaflet JS animation). → /impeccable polish

## Persona Red Flags

**Alex (power user):** slider-only threshold (no numeric entry); nothing addressable — no URL state, no export (deliverable trapped in sidebar); tabs through up to 100 card buttons to reach the map.

**Sam (screen reader / keyboard):** aria-live="polite" on the whole locationList container + innerHTML rebuild on every slider tick → potential re-announcement of up to 100 cards (live region should be a summary); marker focus never announces popup stats (no aria-describedby/focus move); active card = 1px border change with no aria-current; failing 3.3:1 green numerals; mobile visual order (map first via order:-1) disagrees with DOM/focus order. Positives: real button cards, labeled output, tokenized focus ring, role=alert/status.

**Jordan (first-timer):** score units/range hidden behind closed details ("of 1" never stated in legend); "Casual trips" unexplained at point of use; "Least active" mode gives no clue why it exists; "All locations" showing 10 items teaches a false fact. Positive: upload hint answers the two real questions (format? privacy?) precisely.

## Cognitive Load

1 of 8 failures. Real decision point without help: "which of 100 markers do I look at" — at N=100, 72 marker pairs overlap at default zoom with no clustering/sizing/dimming.

## Emotional Journey

Strong opening peak (zero-setup live map). Best moment: the upload flow (privacy line, streaming progress, 4s success reward). Weak ending: no export/permalink/shortlist — the "I found my corner" peak has no end to pair with (peak-end miss).

## Minor Observations

- DESIGN.md prose says Headline 24px, frontmatter/CSS say 20px (internal inconsistency)
- h1 "Food Cart Location Analysis" vs title "NYC Food Cart Location Analysis" — pick one
- No favicon
- Silent quality filtering: "3 of 53 trips excluded" one-liner would fit the analyst brand
- Legend boundary overlap: Medium "0.33–0.66" and High "≥0.66" both claim 0.66 (code gives it to High)
- Empty-state advice hardcodes "lower lunch trips" — becomes wrong if a second filter can ever empty results
- No cache headers on the static server; stale builds served after updates

## Questions to Consider

1. If the map is the hero, why do all the *reasons* live off-map? Could marker size or an on-map detail panel let the map argue the case?
2. The product's success is "the user reaches their own conclusions" — but a conclusion you can't export, link, or shortlist evaporates on tab-close. What artifact does this tool produce?
3. Would "Least active" earn its place better as a comparison tool (pin two stations, diff their stats) than as a mirror-image ranked list whose rank numbers lie?
