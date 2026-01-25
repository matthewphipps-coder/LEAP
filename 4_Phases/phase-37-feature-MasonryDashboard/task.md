# Phase 37: Masonry Dashboard Build (SPEC-006)

**Objective**: Execute the T-0.5 Flight Plan to build the Masonry Dashboard on the clean Phase 36 architecture.
**Source of Truth**: `specs/SPEC-006.yaml`

## Stage 1: Setup (Safe Start)
- [x] Create Backup: `cp -r 2_GoldSource X_GoldSource_Backup/phase-37-start`
- [x] Verify Clean Slate: Ensure no old 'Masonry' code exists in `2_GoldSource`.
- [x] Handoff Package: `specs/` folder populated.

## Stage 2: Visual Layer (CSS)
- [x] **Port CSS Tokens**: Copy tokens from `specs/SPEC-004-prototype.html` to `ui/styles/variables.css` (or `card.css`).
- [x] **Create Card CSS**: Implement `.nexus-card` class structure in `ui/components/card/card.css`.
- [x] **Create Canvas CSS**: Implement `.nexus-canvas` (Masonry/Freeform) in `ui/components/canvas/canvas.css`.
- [x] **Shell Update**: Add `.count-badge.urgent` styles to `shell.css`.
- [x] **Checkpoint**: `git commit -m 'WIP Phase 37: Visual Layer CSS Port'`

## Stage 3: Data Layer (Schema)
- [x] **Card Service**: Update `features/card/card-service.js` to match `SPEC-006-schema.yaml` (fields: `horizon`, `priority`, `size`).
- [x] **Sidebar Config**: Update `core/constants.js` -> `PAGE_SIDEBAR_ACTIONS` with new schema (`droppable`, `badgeColor`).
- [x] **Header Config**: Update `PAGE_TABS` with `badgeColor`.
- [x] **Checkpoint**: `git commit -m 'WIP Phase 37: Data & Config Schema'`

## Stage 4: Logical Layer (Architecture)
- [x] **Canvas Render Loop**: Implement `canvas-ui.js` to render cards based on `currentHorizon` and `layoutMode`.
- [x] **Render Logic**: Implement "Masonry Filter" (Group by Horizon) logic.
- [x] **Sidebar Event Bus**: Update `sidebar-ui.js` to emit `sidebar-action` events (Decoupled).
- [x] **Drag & Drop**: Implement Native D&D handlers in `sidebar-ui.js` (Drop Zone) and `canvas-ui.js` (Draggable).
- [x] **Checkpoint**: `git commit -m 'WIP Phase 37: Logic & Event Bus'`

## Stage 5: State & Meta-Data (Gov Compliance)
- [/] **State Update**: Add `viewPreferences` to `state.js`.
- [ ] **Per-Horizon Logic**: Ensure switching horizons restores the correct Layout Mode.
- [ ] **Meta-Docs Update**:
    - [ ] `meta/functionality.yaml`: Add 'Masonry Dashboard' feature entry.
    - [ ] `meta/architecture.yaml`: Update 'Module Map' with new dependencies.
    - [ ] `meta/design-system.yaml`: Add 'Masonry' and 'Card' token references.
- [ ] **Checkpoint**: `git commit -m 'WIP Phase 37: State & Meta-Docs'`

## Stage 6: Validation (Gov Check)
- [ ] **Visual Check**: Compare `localhost` vs `specs/SPEC-004-prototype.html`.
- [ ] **Functional Check**: Drag card to "Done" sidebar item -> Log event.
- [ ] **Regression Check**: Verify 'Incidents' and 'Reports' pages still load correctly (no CSS bleed).
- [ ] **Governance Check**: Run `gov-check.sh` to ensure no direct DOM manipulation between modules.

## Stage 7: Testing (Evidence)
- [ ] **Run Server**: `python3 -m http.server 8080` (or 8081).
- [ ] **Capture Evidence**: Record screenshot of "My Work" page.
- [ ] **Create Artifact**: `stage-7-testing.yaml` with results.

## Stage 8: Closure (Handoff)
- [ ] **Final Git Commit**: `git commit -m 'Phase 37: Masonry Dashboard Build complete'`
- [ ] **Factory Check**: Update `Factory/governance/templates/prototype_template.html` if we changed core styles?
- [ ] **Backlog Update**: Mark 'Masonry Dashboard' as Complete.
- [ ] **Status Update**: Info `CURRENT_STATE.yaml` -> "complete".
