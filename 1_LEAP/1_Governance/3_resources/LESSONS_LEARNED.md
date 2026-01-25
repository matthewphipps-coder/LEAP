# LEAP Master Lessons Registry

## Purpose
This file prevents "Systemic Amnesia." AI Agents must read this before starting research.

## Registry

### [Phase 31] Layout Engine: Masonry vs Grid
- **Context:** Canvas card layout implementation.
- **Failure:** CSS Grid causes gaps because it aligns rows.
- **Success:** CSS Columns (`column-count: 3`) creates a true masonry packing.
- **Rule:** Use `column-count` and `break-inside: avoid` for card walls.

### [Phase 33] Architecture: Unidirectional Flow
- **Context:** Sidebar initialization race conditions.
- **Failure:** Router calling `sidebar.update()` directly.
- **Rule:** UI components must *subscribe* to state. Never push updates to them.
