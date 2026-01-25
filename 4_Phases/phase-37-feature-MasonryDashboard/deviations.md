# Phase 37 Deviations Log

**File:** `deviations.md`
**Created:** 2026-01-25
**Scope:** Architecture, Implementation, and Specification alignment for "Masonry Dashboard".

---

## Deviation 001: Functional Failure of Sidebar Drop Workflow
**Severity:** Critical (Feature Broken)
**Component:** `sidebar-ui.js` / `canvas-ui.js` / `card-service.js`
**Spec Reference:** `SPEC-006` > Requirements > Core Features > "Must support Drag & Drop from Canvas to Sidebar."

### The Requirement
The specification requires an interactive workflow where a user can drag a card from the Canvas and drop it onto a Sidebar horizon icon (e.g., dropping an 'Inbox' card onto 'Next'). This action should:
1.  update the card's horizon property.
2.  remove the card from the current view.
3.  increment the badge count on the target sidebar item.

### The Implementation Gap
While the visual affordances exist (draggable cards, highlighting drop zones), the **logic layer is disconnected**.

1.  **Missing Event Listener**:
    - The `sidebar-ui.js` component correctly dispatches a custom `sidebar-drop` event containing `{ cardId, actionId }`.
    - **However**, neither `canvas-ui.js` nor `app.js` listens for this event. The event fires into the void, resulting in no action.

2.  **Stateless Data Service**:
    - `CardService.getCards()` serves purely static mock data defined inside the function scope.
    - Every time the canvas refreshes, `getCards()` creates a *new* set of arrays.
    - There is no mechanism to persist a "move". Even if the listener existed, calling `getCards()` again would simply restore the card to its original position (Amnesiac Data).

---

## Deviation 002: Visual Collapse due to Missing CSS Link
**Severity:** High (UI Broken)
**Component:** `index.html`
**Spec Reference:** `SPEC-004` > Visual Standards > Card UI

### The Requirement
Cards must render with specific visual styling: generic `article` tags with class `nexus-card` should display as dark, glass-morphism panels with 24px padding, specific typography (`Outfit`/`Inter`), and hover lift effects.

### The Implementation Gap
The file `ui/components/card/card.css` was correctly implemented and contained all the necessary tokenized styles. **However, strict governance failure occurred at the integration level:**
- The `index.html` file did not include a `<link>` tag for `card.css`.
- As a result, the browser rendered unstyled HTML blocks. This caused cascading layout failures (Masonry grids collapsing) and a "broken" visual state that did not match the DOM structure's intent.

---

## Deviation 003: "Freeform" Mode is Random, Not Resistant
**Severity:** Critical (Feature Broken)
**Component:** `canvas-ui.js`
**Spec Reference:** `SPEC-006` Requirement 6.1 (implied) and 6.4.

### The Requirement
"Freeform" implies user-defined placement. If a user moves a card to `(100, 200)`, it must stay there.

### The Implementation Gap
1.  **Placement Logic:** `createCardHTML` uses `Math.random()` to generate Top/Left coordinates every time.
2.  **Persistence:** There is NO code to save coordinates when a card is dragged.
3.  **State Schema:** `state.js` has no schema to store `cardPositions: { 'card-1': {x,y} }`.

---

## Deviation 004: Reactive Badge System Failure
**Severity:** Critical (Feature Broken)
**Component:** `sidebar-ui.js` / `header-ui.js` / `card-service.js`
**Spec Reference:** `SPEC-006` Section 4 (Event Contracts)

### The Requirement
The specification defines a `card-update` event that carries statistics (e.g., `{ inbox: 3, now: 2 }`). The Sidebar and Header badges should listen to this event and update their numbers dynamically.

### The Implementation Gap
1.  **No Event Emission:** `CardService` never calculates stats or emits `card-update`.
2.  **No Event Consumption:** Neither `sidebar-ui.js` nor `header-ui.js` contains any `document.addEventListener('card-update', ...)` logic.
3.  **Hardcoded Config:** Badges are currently static integers hardcoded in `constants.js` (e.g., `badge: 3`), rendering them purely decorative.

---

## Deviation 005: Global State Persistence Failure
**Severity:** High (Core Capability)
**Component:** `state.js`
**Spec Reference:** `SPEC-006` Requirement 6.4 (Per-Horizon Layout Persistence)

### The Requirement
User preferences (Dark Mode, Layout Modes per Horizon) must persist across browser reloads.

### The Implementation Gap
The `state.js` module uses in-memory variables (`let state = ...`). There is no utilization of `localStorage` or `sessionStorage` to hydrate this state on initialization. A page refresh resets everything to default.
