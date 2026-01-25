# Discrepancy Analysis: Prototype vs. GoldSource

**Date**: 2026-01-25
**Status**: DISCREPANCY CONFIRMED

## Executive Summary
The user's hypothesis is correct. There is a significant technical disparity between the **Prototype HTML** (Input) and the **GoldSource Build** (Outcome). The root cause is a **failure in the Discovery Docs (Visual Guide)** to accurately capture the Prototype's advanced layout logic, resulting in a conflicting specification that led to a degraded implementation.

---

## 1. The Core Discrepancy: Layout Engine
The most visible difference is how the Card Canvas renders its grid.

| Component | Technology | Visual Result |
| :--- | :--- | :--- |
| **Prototype (`SPEC-004-prototype.html`)** | **CSS Columns** (`column-count: 3`) | **True Masonry**. Cards stack vertically like a Pinterest layout. Variable height cards tuck into empty spaces naturally. |
| **Visual Guide (`VISUAL-GUIDE.md`)** | **CONTRADICTORY** | **Section 3.1** mandates `display: grid`.<br>**Section 5** (CSS Reference) pastes the Prototype's `column-count: 3`. |
| **GoldSource Build (`canvas.css`)** | **CSS Grid** (`display: grid`) | **Rigid Rows**. Cards are forced into row bands. If one card is tall, it expands the row for *everyone*, creating ugly whitespace gaps. |

### Evidence
**Prototype Source (Lines 373-376):**
```css
.nexus-canvas.grid-mode {
    display: block;
    column-count: 3; /* Masonry */
}
```

**visual-GUIDE.md (Section 3.1):**
```css
.nexus-canvas {
  display: grid; /* Strict Grid directly conflicts with Prototype */
  grid-template-columns: repeat(auto-fill, ...);
}
```

---

## 2. Missing Richness (CSS & Interactions)
The Prototype contains ~1400 lines of Code/CSS, while the current GoldSource files (`card.css` + `canvas.css`) total ~230 lines.

- **Missing Animations**: Prototype defines `bubbleFloat` (plasma), `pulse-border` (SLA), and smooth layout transitions (`view-transition` API hints). GoldSource implemented only basic hover lifts.
- **Missing Interaction Logic**: Prototype demonstrates "Drag and Drop" with visual insertion markers (`border-top` on dragover). GoldSource currently lacks these specific visual feedbacks (as observed in Phase 32 verification).
- **Styling Nuance**: Prototype uses `mix-blend-mode: screen` for plasma bubbles; GoldSource implementation is simplified.

---

## 3. Root Cause Analysis
The "Discovery Phase" produced a high-fidelity HTML Prototype but failed to "back-port" those learnings into the `VISUAL-GUIDE.md` effectively.

1.  **Stale Spec**: The YAML/MD specs were likely written *before* the Prototype reached its final "Masonry" iteration.
2.  **Bad Translation**: When writing the `VISUAL-GUIDE`, the author defaulted to standard `CSS Grid` (safe, modular) but copy-pasted sections of the Prototype's CSS (Masonry) without reconciling the two.
3.  **Implementation Confusion**: The Phase 32 implementation followed the `VISUAL-GUIDE`'s explicitly defined Section 3.1 (`display: grid`) and ignored the contradictory code later in the doc or the Prototype itself.

## 4. Recommendation
The "GoldSource Outcome" is currently inferior to the Input Prototype.

**Next Steps (Phase 33 Proposal):**
1.  **Adopt Prototype layout**: Refactor `canvas.css` to use `column-count` (Masonry) instead of `display: grid` to match the visual target.
2.  **Port Interactions**: Copy the drag-and-drop feedback styles (insertion markers) from Prototype to `card.css`.
3.  **Clean Specs**: Mark `VISUAL-GUIDE.md` as "Corrected" to remove the CSS Grid recommendation.

**Verdict**: The HTML Prototype **WAS** the superior driver, and the Docs **DID** confuse the build.
