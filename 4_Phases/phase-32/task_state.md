# Phase 33: Spec Recovery & Alignment

**Objective**: Reverse-engineer `SPEC-004-prototype.html` into authoritative `v2` validation inputs (`SPEC-004-v2.yaml` and `VISUAL-GUIDE-v2.md`) to resolve discrepancies before resuming code implementation.

- [x] **1. Initialization**
    - [x] Create Phase 33 directory <!-- id: 0 -->
    - [x] Initialize `stage-1-discovery.yaml` for Phase 33 <!-- id: 1 -->

- [/] **2. Deconstruction (The Audit)**
    - [x] **CSS Extraction**: Analyze prototype CSS (Columns vs Grid, Plasma, Animations) <!-- id: 2 -->
    - [x] **Interaction Mapping**: Document Drag & Drop logic and insertion markers <!-- id: 3 -->
    - [x] **Token Audit**: Identify magic values vs Design System tokens (e.g. `rgba(20, 20, 25, 0.8)` for card bg) <!-- id: 4 -->

- [ ] **3. Spec Regeneration (The Rewrite)**
    - [ ] Draft `SPEC-004-card-canvas-v2.yaml` (Behavior/Requirements) <!-- id: 5 -->
    - [ ] Draft `VISUAL-GUIDE-v2.md` (Implementation/Architecture) <!-- id: 6 -->

- [ ] **4. Validation**
    - [ ] Generate "Diff Report" (v1 vs v2) <!-- id: 7 -->
    - [ ] **USER REVIEW**: detailed Spec verification <!-- id: 8 -->

- [ ] **5. Refactor (Execution - Pending Approval)**
    - [ ] Apply changes to GoldSource `canvas.css` <!-- id: 9 -->
    - [ ] Apply changes to `card.css` <!-- id: 10 -->
    - [ ] Verify fix <!-- id: 11 -->
