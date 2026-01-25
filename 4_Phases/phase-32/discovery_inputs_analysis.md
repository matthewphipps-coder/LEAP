# Discovery Inputs Analysis: Phase 1 (Card & Canvas)

**Date**: 2026-01-25
**Context**: Validation of Phase 32 inputs against Discovery artifacts.

## Overview
This document analyzes the three core input artifacts defined in `stage-1-discovery.yaml` for the Card & Canvas UI implementation.

| Artifact Type | File | Purpose | Key Directive |
| :--- | :--- | :--- | :--- |
| **SPEC (What)** | `SPEC-004-card-canvas.yaml` | Defines core requirements, data model, and logic. | **Source of Truth** for behavior and logic. |
| **GUIDE (How)** | `VISUAL-GUIDE.md` | Defines integration strategy and modular architecture. | **Strictly modular**. Do NOT copy prototype structure. |
| **PROTO (Ref)** | `SPEC-004-prototype.html` | Provides visual target and interaction reference. | **Monolithic Reference**. Visuals must match, code must not. |

---

## 1. SPEC-004-card-canvas.yaml (The Requirements)
**Status**: Draft (v1.0.0)
**Core Vision**: "The canvas is the human-centric view of work."

### Key Constraints & Logic
- **Data Model**: Cards have `horizon` (inbox, now, next, later, done) and `state`.
- **AI Presentation**: Presentation (size, color, position) is driven by an AI `importance_score`, not hardcoded logic.
- **R11 (Relative Prominence)**: Visual weight is distributed relative to other cards. Not all high-priority cards can be large.
- **Stability**: No automatic bouncing. Updates go to Inbox; user manually re-sorts.

### Critical Gaps/Notes
- **"Tombstone" Component**: Defined in Spec (grayscale, strikethrough) but requires specific handling for "source record inaccessible".
- **Header Scope**: Explicitly limits header changes to *just* the "My Work" page title and specific badges.

---

## 2. VISUAL-GUIDE.md (The Implementation Strategy)
**Status**: Authoritative Build Guide

### Integration Strategy
- **Modular vs Monolithic**: Explicitly warns against copying the monolithic prototype HTML/CSS.
- **File Structure**: Mandates a specific folder structure (`ui/components/`, `ui/styles/`, `core/`).
- **CSS Architecture**: New styles must extend GoldSource tokens (`var(--glass-bg)`, etc.).

### Critical Styling Rules
- **Grid Layout**: Defines a responsive CSS Grid that changes column count (1-4) based on viewport.
- **Card Variants**: Defines `compact`, `medium`, `large` sizes controlled by `data-size` attributes.
- **Badge Logic**: Complex logic provided for calculating badge colors (Red/Amber/Neutral) based on *max priority* in the set.

---

## 3. SPEC-004-prototype.html (The Visual Target)
**Status**: Visual Reference Only

### Observations
- **Single File**: Contains all CSS/JS in one file (for portability).
- **Interactions**: Demonstrates the "drag-and-drop" feeling and "AI Re-sort" animation.
- **Aesthetic**: Establishes the "Glassmorphism" look, plasma background, and specific gradients.

### Discrepancy Risk
- **Code reuse**: Copying JS from the prototype will fail because it lacks the modular separation required by the `VISUAL-GUIDE`.
- **State Management**: Prototype likely uses simplified in-memory arrays; implementation requires proper state management (as hinted in `canvas-controller.js` in the Guide).

---

## Synthesis & Recommendations

### Consistency Check
- **Alignment**: The SPEC and GUIDE are well-aligned. The GUIDE properly translates abstract logic (SPEC) into concrete code patterns.
- **Visuals**: The PROTO matches the GUIDE's screenshots.

### Implementation Watchlist
1.  **Drag & Drop Implementation**: The PROTO sets a high bar for smoothness. The GUIDE acknowledges this is "CRITICAL" and provides specific logic (`updateBadgeCounts`, `updateBadgeColor`) that must be ported carefully.
2.  **Badge Logic**: The logic for header badges (highest priority across ALL cards) vs page badges (highest on page) is subtle and prone to bugs.
3.  **Modular CSS**: Ensure `nexus-card` styles are added to `components.css` (or separate file) and not inline, to maintain the Design System.

### Conclusion
The inputs form a complete and consistent triad. The primary risk is structural: developers must resist the temptation to "eject" the prototype code and instead build the modular system described in the Visual Guide.
