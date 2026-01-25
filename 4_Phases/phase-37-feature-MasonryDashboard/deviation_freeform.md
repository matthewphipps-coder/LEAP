# Freeform & Persistence Deviation Log

## Deviation 003: "Freeform" Mode is Random, Not Resistant
**Severity:** Critical (Feature Broken)
**Component:** `canvas-ui.js`
**Spec Reference:** `SPEC-006` Requirement 6.1 (implied) and 6.4.

### The Requirement
"Freeform" implies user-defined placement. If a user moves a card to `(100, 200)`, it must stay there.

### The Implementation Gap
1.  **Placement Logic:** `createCardHTML` uses `Math.random()` to generate Top/Left coordinates every time.
2.  **Persistence:** There is NO code to save coordinates when a card is dragged.
3.  **State:** `state.js` stores `viewPreferences` (e.g., "grid" or "freeform"), but has no schema to store `cardPositions: { 'card-1': {x,y} }`.

### Impact
Every time the page refreshes or the user switches tabs, the "Freeform" layout scrambles itself. It is chaotic, not useful.
