# Implementation Plan: Phase 33 (Spec Recovery)

**Goal**: Align GoldSource implementation with the high-fidelity Prototype by first correcting the Specifications (v2).

## User Review Required
> [!IMPORTANT]
> This phase freezes coding until Specs are "Healed". We are reversing the flow: Prototype -> Spec -> Code.

## Proposed Changes

### 1. Spec Regeneration (The "Truth" Layer)
We will generate new "v2" artifacts in `phase-33/inputs/`:
- `SPEC-004-card-canvas-v2.yaml`: Updates requirements to mandate Masonry layout and specific animations.
- `VISUAL-GUIDE-v2.md`: Rewrites integration instructions to use `column-count` instead of `grid`, and details interaction logic.

### 2. Code Refactoring (The "Build" Layer) - *Conditional on Spec Approval*
Once Specs are approved, we will apply changes to `2_GoldSource/scaffold/`:
#### [MODIFY] `src/ui/styles/canvas.css`
- **Change**: Replace `display: grid` with `column-count: 3`.
- **Reason**: Match prototype's "pinterest-style" masonry layout.

#### [MODIFY] `src/ui/styles/components.css` / `card.css`
- **Change**: Add `mix-blend-mode`, `break-inside: avoid` (for masonry), and insertion marker styles.
- **Change**: Implement `plasma.css` specific gradients if missing.

#### [MODIFY] `src/core/canvas-controller.js`
- **Change**: Update drag-and-drop logic to handle masonry columns instead of grid cells.

## Verification Plan

### Automated Verification
- **Browser Agent**:
    - Verify `column-count` is applied.
    - Test drag-and-drop behaves as expected in masonry layout.
    - Check Plasma background integration match.

### Manual Verification
- **Visual Compare**: User compares `localhost` build against `SPEC-004-prototype.html` side-by-side.
