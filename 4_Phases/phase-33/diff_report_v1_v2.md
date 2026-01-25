# Diff Report: Spec V1 vs V2 (Phase 33)

**Date**: 2026-01-25
**Context**: "Recovery Protocol" to align Specifications with the Prototype.

## Executive Summary
This report documents the structural and functional changes made to the specifications to resolve the discrepancy where the Build (V1) failed to match the Prototype (Input).

| Feature | V1 Spec (Legacy) | V2 Spec (Recovery) | Impact |
| :--- | :--- | :--- | :--- |
| **Layout Engine** | `display: grid` | **`column-count: 3`** (Masonry) | Enables true "Pinterest-style" vertical stacking. |
| **Freeform Mode** | Not Mentioned | **Explicitly Defined** | Adds User Toggle, Absolute Positioning, and Persistence logic. |
| **Card Sizing** | Defined by Grid Tracks | **Content-Driven** | Cards grow naturally based on content (summary length), enabling dynamic height. |
| **Structure** | Unspecified | **Fixed Header / Scroll Area** | Enforces the "App Shell" feel with independent scrolling. |
| **Interaction** | Generic Drag/Drop | **Visual Markers** | Mandates `.drop-before` (green border) and specific insertion logic. |
| **Animations** | Generic "Hover Lift" | **Plasma + Pulse** | Adds specific Plasma Bubbles and SLA Pulse (`@keyframes pulse-border`) requirements. |

---

## Detailed Changes

### 1. SPEC-004-card-canvas-v2.yaml
*   **Added**: `canvas_modes.freeform_mode` with persistence and z-index rules.
*   **Added**: `structure` section defining Fixed Header vs Scroll Area.
*   **Changed**: `layout.engine` from Grid to "CSS Multi-column".
*   **Refined**: `nexus_card.visuals` now includes specific "Magic Values" found in the prototype (`rgba(20, 20, 25, 0.8)`).
*   **Refined**: `drag_and_drop` now specifies the exact `.drop-before` visual class.

### 2. VISUAL-GUIDE-v2.md
*   **WARNING**: Added explicit warning *against* using CSS Grid.
*   **Architecture**:
    *   Replaced `grid-template-columns` with `column-count`.
    *   Added `break-inside: avoid` to card requirements (critical for Masonry).
*   **Logic**:
    *   Added JavaScript Logic block for "Freeform Dragging" (Mouse Events vs DnD).
    *   Added `handleFreeFormMouseUp` for coordinate persistence.
*   **Structure**:
    *   Added `scaffold.css` guidance for the Fixed Header flexbox layout.

---

## Conclusion
The V2 documents now accurately describe the high-fidelity Prototype. Implementing these specs will require a **Refactor** of the current GoldSource `canvas.css` and `card.css`.
