# Prototype Audit (Deconstruction Report)

**Source**: `SPEC-004-prototype.html`
**Date**: 2026-01-25

## 1. CSS Layout Engine
**Finding**: The prototype uses **CSS Multi-column Layout** (`column-count`) for the Masonry effect, NOT CSS Grid.

| Feature | Prototype Code | GoldSource Implementation |
| :--- | :--- | :--- |
| **Grid Logic** | `.grid-mode { column-count: 3; display: block; }` | `.nexus-canvas-grid { display: grid; grid-template-columns: repeat(...); }` |
| **Masonry Behavior** | Cards flow vertically. `break-inside: avoid` prevents splitting. | Cards flow horizontally then wrap (row bands). Tall cards break the row layout. |
| **Resolution** | **Must usage `column-count` for true masonry.** |

## 2. Visual Fidelity & Magic Values
**Finding**: `card.css` must inherit specific transparency and animation tokens found in the prototype.

- **Plasma Colors**: Prototype uses specific keyframe animations (`float`) and `mix-blend-mode: screen`. GoldSource `plasma.css` has these but they need verification against the prototype's exact timing.
- **Card Background**: Prototype uses `rgba(20, 20, 25, 0.8)` for dark mode. This is hardcoded in the prototype but should be tokenized in `design-system.css` as `--card-bg-dark`.
- **SLA Pulse**: Prototype defines `@keyframes pulse-border`. This is missing in GoldSource.

## 3. Interaction Mechanics (DnD)
**Finding**: Prototype implements a custom HTML5 Drag-and-Drop system that is *not* present in the current build.

*   **Logic**:
    *   `dragstart`: Sets `e.dataTransfer.effectAllowed = 'move'`.
    *   `dragover` on Card: Adds `.drop-before` class (Visual: `border-top: 4px solid var(--brand-primary)`).
    *   `drop`: Calls `insertCardBefore(activeId, targetId)`.
*   **Missing in Build**: The current GoldSource build attempts to use standard list reordering without the specific visual insertion markers (`.drop-before`) that give the user confidence.

## 4. Token Audit
The following "Magic Values" were found in the prototype and need to be formalized in the V2 Spec:
*   `--sidebar-width: 68px` (Standard is usually 64px or 72px, verify alignment).
*   `--glass-bg: rgba(255, 255, 255, 0.05)` (Very subtle).
*   `--badge-urgent: #ef4444`.

## Action Plan
The **V2 Visual Guide** must explicitly instruct the developer to:
1.  Abandon `display: grid` for the main canvas in favor of `column-count`.
2.  Implement the `handleDragStart`, `handleCardDragOver` (class toggling), and `handleCardDrop` logic exactly as written in the prototype.
