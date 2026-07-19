---
name: NYC Food Cart Location Analysis
description: A map-first dashboard ranking Citi Bike station areas as food-cart locations.
colors:
  ink: "#1f2937"
  slate-secondary: "#4b5563"
  cool-canvas: "#f4f6f8"
  paper: "#ffffff"
  mist-panel: "#f9fafb"
  hairline: "#e5e7eb"
  score-high: "#15803d"
  score-medium: "#f59e0b"
  score-low: "#dc2626"
  muted: "#6b7280"
  focus-ring: "#2563eb"
typography:
  headline:
    fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"
    fontSize: "20px"
    fontWeight: 700
  title:
    fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"
    fontSize: "15px"
    fontWeight: 700
  body:
    fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"
    fontSize: "14px"
    lineHeight: 1.5
  label:
    fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"
    fontSize: "13px"
    fontWeight: 700
rounded:
  md: "8px"
spacing:
  xs: "12px"
  sm: "14px"
  md: "18px"
  lg: "24px"
components:
  card:
    backgroundColor: "{colors.mist-panel}"
    rounded: "{rounded.md}"
    padding: "12px"
  panel:
    backgroundColor: "{colors.mist-panel}"
    rounded: "{rounded.md}"
    padding: "14px"
---

# Design System: NYC Food Cart Location Analysis

## 1. Overview

**Creative North Star: "The Field Analyst's Map"**

This is a working tool for spatial decisions. The map is the hero: it owns the majority of the viewport, and every other element exists to sharpen what the map shows. The sidebar is a bank of precise instruments — a view-mode selector, a result-count dial, a lunch-trip threshold — rendered in quiet neutrals so the scored markers carry all the color. The personality is clean, analytical, trustworthy: the interface of an analyst who trusts their data and doesn't decorate it.

The system explicitly rejects the generic Bootstrap dashboard: no default-widget clutter, no admin-panel chrome, no panels stacked for their own sake. Density is moderate — enough numbers to support deep exploration, enough whitespace to keep them legible.

**Key Characteristics:**
- Map-first layout: a fixed 380px instrument sidebar, everything else is map.
- Neutral gray-blue chrome; saturated color is reserved for data (score markers).
- Flat surfaces separated by hairline borders and background tints, never shadows.
- Refined and restrained components: minimal styling, function-first.

## 2. Colors

A cool, neutral chrome that cedes all saturation to the data layer.

### Primary
- **Score High — Signal Green** (#15803d): marks the strongest food-cart locations on the map and legend. The most meaningful color on screen; it appears only as data. Deep enough that white 11px rank numerals pass WCAG AA (5.0:1).

### Secondary
- **Score Medium — Amber** (#f59e0b): mid-scoring locations.
- **Score Low — Alert Red** (#dc2626): weak locations.

### Neutral
- **Ink** (#1f2937): primary text.
- **Slate Secondary** (#4b5563): supporting copy and descriptions.
- **Cool Canvas** (#f4f6f8): page background.
- **Paper** (#ffffff): sidebar surface.
- **Mist Panel** (#f9fafb): cards and the legend panel — one tint below Paper.
- **Hairline** (#e5e7eb): every border and divider.

### Named Rules
**The Data-Owns-Color Rule.** Saturated color (green, amber, red) appears only on data: markers, legend dots, and score indicators. Chrome, controls, and text stay neutral. If a button or panel is colorful, it's wrong.

**The Two-Channel Rule.** Score encoding may not rely on hue alone — the green/amber/red trio is a known colorblind hazard. Pair color with rank position, a label, or shape whenever scores are shown.

## 3. Typography

**Display Font:** system-ui stack (Segoe UI / SF Pro / Roboto, Arial fallback)
**Body Font:** system-ui stack — one family everywhere, with `font-variant-numeric: tabular-nums` on all stat values so numbers align

**Character:** A single utilitarian sans used at restrained sizes; hierarchy comes from weight and scale, not typeface changes. Precise and unglamorous, like a well-set report.

### Hierarchy
- **Headline** (700, 20px): the dashboard title, once per page.
- **Title** (700, 15px): location-card headings and section labels.
- **Body** (400, 14px, 1.5 line-height): descriptions and explanatory copy.
- **Label** (700, 13-14px): control labels and card stats; bold labels with regular values.

### Named Rules
**The One-Face Rule.** One font family, everywhere. Hierarchy is weight and size only.

## 4. Elevation

Flat with hairline borders. Surfaces never cast shadows; depth is conveyed by a three-step background ladder (Cool Canvas → Paper → Mist Panel) plus 1px Hairline borders. The sidebar separates from the map with a single hairline, and cards sit one tint below their parent surface. If a surface needs to feel distinct, change its tint or add a hairline — never a shadow.

### Named Rules
**The No-Shadow Rule.** box-shadow is prohibited. Layering is tint plus hairline, nothing else.

## 5. Components

Refined and restrained: minimal styling, tight spacing, function-first.

### Cards / Containers
- **Corner Style:** gently rounded (8px)
- **Background:** Mist Panel (#f9fafb) on Paper
- **Shadow Strategy:** none — hairline border per the Elevation section
- **Border:** 1px Hairline (#e5e7eb)
- **Internal Padding:** 12-14px

### Inputs / Fields
- **Style:** full-width native selects and range sliders under bold 13-14px labels, grouped in control boxes with 18px vertical rhythm
- **Focus:** browser default (an explicit visible focus treatment is a welcome refinement)

### Navigation
- Single-screen tool; no navigation chrome. The sidebar is the sole control surface.

### Map Markers (signature component)
- Rank markers: 24px circles filled in the score-band color, carrying the location's rank number (white text on green/red, ink text on amber for contrast). This satisfies the Two-Channel Rule — score is encoded by color AND rank. Popups carry the station name in bold plus an aligned stat grid (score to three decimals, formatted trip counts). The ranked location list mirrors the markers with matching rank badges; clicking a card flies the map to its marker.

## 6. Do's and Don'ts

### Do:
- **Do** keep the map dominant — the sidebar stays at 380px and never grows extra panels.
- **Do** reserve #15803d / #f59e0b / #dc2626 for data encoding only.
- **Do** separate surfaces with 1px #e5e7eb hairlines and background tints (#f4f6f8 → #ffffff → #f9fafb).
- **Do** format scores to three decimals and keep stat labels bold, values regular.
- **Do** pair score color with rank, label, or shape (The Two-Channel Rule).

### Don't:
- **Don't** build a "generic Bootstrap dashboard" — no default-widget clutter, no admin-panel chrome (PRODUCT.md anti-reference, verbatim).
- **Don't** use box-shadow anywhere (The No-Shadow Rule).
- **Don't** put saturated color on chrome, buttons, or headers.
- **Don't** add controls that don't change what the map or list shows.
- **Don't** introduce a second font family.
