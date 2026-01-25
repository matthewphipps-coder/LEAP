# Phase 33 Proposal: Spec Recovery & Alignment

**Objective**: Reverse-engineer the `SPEC-004-prototype.html` into accurate, authoritative `v2` specifications to resolve the "Discrepancy Gap" before resuming development.

**Rationale**: The Prototype (`.html`) currently effectively represents the "Client Sign-off" quality, while the Docs (`.yaml` / `.md`) are stale and misleading. Proceeding with the current docs will result in a "Broken" build. The most cautious path is to halt coding and fix the blueprints first.

---

## The Recovery Protocol

### Step 1: Deconstruction (The Audit)
We will treat `SPEC-004-prototype.html` as the "Gold Master".
*   **CSS Extraction**: Map every CSS rule (especially `column-count`, `keyframes`, `mix-blend-mode`) to a requirement.
*   **Interaction Mapping**: document the exact logic of the drag-and-drop "insertion markers" and "updates badge" behavior.
*   **Token Audit**: Identify any "magic values" in the prototype that aren't in the official Design System.

### Step 2: Spec Regeneration (The Rewrite)
We will create new versions of the input documents. We will NOT overwrite the old ones yet; we will create `v2` candidates.

*   **`SPEC-004-card-canvas-v2.yaml`**:
    *   Update `requirements` to explicitly mandate "Masonry Layout" (not Grid).
    *   Add "Plasma Effects" and "SLA Pulse" as strict visual requirements.
*   **`VISUAL-GUIDE-v2.md`**:
    *   **Architecture Update**: Change the recommended CSS approach from `display: grid` to `column-count`.
    *   **Modularization Strategy**: Explicitly show how to break the Prototype's monolithic CSS into `components.css` and `plasma.css` without losing fidelity.

### Step 3: Validation (The Check)
*   Compare `v2` Specs against the `v1` Specs to produce a "Diff Report".
*   User reviews `v2` Specs. *Do they accurately capture the Prototype's magic?*

### Step 4: Refactor (The Fix)
*   Only **AFTER** `v2` Specs are approved do we touch the GoldSource code.
*   We then "Refactor to Spec", changing `canvas.css` and `card.css` to match the new authoritative guide.

---

## Why this is "Safest"
1.  **Isolation**: We fix the understanding before we fix the code.
2.  **Truth**: It re-establishes the "Spec" as the Source of Truth, preventing future "drift" where the code matches the prototype but the docs say something else.
3.  **Backup**: We work in parallel (v2 files) within a new Phase folder, leaving the current Phase 32 and GoldSource backups untouched until we are ready to apply.

## Suggested Next Command
*   "Proceed with Phase 33 to generate v2 specs."
