# Bug Fix Session Audit & Root Cause Analysis

**Date**: 2026-01-25
**Session Scope**: GoldSource Scaffold Repair (Spec-003/Spec-004)

## Abstract
This report documents the defects resolved during the current session, analyzing their technical root causes and systemic origins. The primary theme of these defects was **Legacy V1 Retention**—code patterns from the previous grid-based or prototype implementations persisting into the V2 Masonry build.

---

## 1. Defect: Initialization Hang ("Initializing..." forever)
**Symptom**: The application stuck on the loading screen, though logs showed `init execution`.
**Fix**: Updated `canvas-ui.js` to use `state.subscribe()` instead of `window.addEventListener('card-update')`.
**Root Cause (Race Condition)**:
The `CanvasUI` component initialized *after* the initial data load event fired. The native DOM event listener missed the `card-update` event because it wasn't subscribed in time.
**Systemic Origin**:
Reliance on ephemeral window events for critical state synchronization is fragile.
**Prevention**:
Enforce observable state patterns (like `state.subscribe`) for all core data bindings. UI components must subscribe to the *store*, not the *event stream*.

## 2. Defect: Content Overlap (Cards behind Header/Sidebar)
**Symptom**: Verified `nexus-card` elements were positioned at `(0,0)`, hidden behind the fixed header and sidebar.
**Fix**: Added `.canvas` CSS rule with calculated padding:
```css
padding-top: calc(var(--header-height) + var(--space-lg));
padding-left: calc(var(--sidebar-pill-width) + var(--sidebar-gap) * 2);
```
**Root Cause (Missing Layout Context)**:
The `.nexus-canvas` container had no awareness of the fixed application shell (Header/Sidebar). It treated the window as an empty canvas.
**Systemic Origin**:
Component isolation. The `Canvas` component was developed in isolation from the `App Shell` (Spec-003) and didn't inherit the shell's spacing constraints.
**Prevention**:
Define a global `layout-shell.css` or `scaffold.css` that enforces the "Keep Out" zones for fixed UI elements, rather than relying on individual components to pad themselves.

## 3. Defect: "Narrow Horizon" (1/3 Width Canvas)
**Symptom**: The entire card canvas (header + cards) appeared squashed into the left ~30% of the screen.
**Fix**: Updated `canvas-ui.js` to reset `container.className = 'canvas-wrapper'`.
**Root Cause (CSS Cascade Collision)**:
The parent container `#nexus-canvas` retained the class `nexus-canvas-grid` from the static `index.html`.
In `canvas.css`, `.nexus-canvas-grid` defines `column-count: 3`.
Therefore, the **entire UI** (Header + Scroll Area) was being treated as a single "item" inside the first column of a masonry layout.
**Systemic Origin**:
Static HTML artifacts (`index.html`) clashing with dynamic JS rendering. The container had pre-assigned classes that were conflicting with the JS logic.
**Prevention**:
JS-driven components should religiously clean/reset their container's class list on `init`.

## 4. Defect: List View Constrained Width
**Symptom**: "All" and "Done" views were stuck at ~1000px width.
**Fix**: Removed `max-width: 1000px` from `.nexus-canvas.list-mode` in `canvas.css`.
**Root Cause (Legacy Constraint)**:
The `max-width` rule was an intentional design choice for readability in V1 (List View), but it conflicted with the V2 requirement for "Full Width / Masonry Consistency".
**Systemic Origin**:
V1 Design patterns persisting in V2 code.
**Prevention**:
When overriding a major version (V1 -> V2), all layout constraints should be explicitly challenged.

## 5. Defect: Missing Specific Visuals (Header/Toggles/Colors)
**Symptom**: User requested features (Fixed Header, Toggles, Colored Counters) were missing.
**Fix**:
- Implemented `Horizon Header` generation in `canvas-ui.js`.
- Added logic for P1(Red)/P2(Amber) counters in `card-service.js` and `sidebar-ui.js`.
**Root Cause (Feature Gap)**:
These were not "bugs" but unimplemented features from the prototype that were missed during the scaffold build.
**Systemic Origin**:
Incomplete "Deconstruction". The visual details of the prototype (like specific badge colors or the toggle buttons) were not fully captured in the initial requirements list.

---

## Summary of Changes
| File | Change | Purpose |
| :--- | :--- | :--- |
| `scaffold/ui/components/canvas/canvas-ui.js` | Added `state.subscribe` | Fix Init Hang |
| `scaffold/ui/components/canvas/canvas-ui.js` | Reset `className` | Fix Narrow Column Bug |
| `scaffold/ui/components/canvas/canvas-ui.js` | Render `Horizon Header` | Add Missing UI |
| `scaffold/ui/components/canvas/canvas.css` | Added padded `.canvas` rule | Fix Layout Overlap |
| `scaffold/ui/components/canvas/canvas.css` | Removed `max-width` | Fix List Width |
| `scaffold/features/card/card-service.js` | Calc P1/P2/P3 stats | Support Colored Badges |
| `scaffold/ui/components/sidebar/sidebar-ui.js` | Add color logic | Render Colored Badges |
