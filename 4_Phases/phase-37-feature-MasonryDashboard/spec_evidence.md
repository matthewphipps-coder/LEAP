# Spec Requirement Verification Log

## Deviation 001: Sidebar Drop (Requirement 6.1)
- **Spec Quote:** "Must support Drag & Drop from Canvas to Sidebar." (Line 19)
- **Status:** Explicitly Required.

## Deviation 003: Freeform Persistence (Requirement 6.4)
- **Spec Quote:** "User's layout choice (Grid/Freeform/List) is saved independently for EACH horizon." (Line 22)
- **Implicit Requirement:** "Freeform" by definition means user-positioned. If positions aren't saved, it's not a layout choice, it's a randomization.
- **Status:** Strongly Implied by Feature Name.

## Deviation 004: Reactive Badges (Section 4)
- **Spec Quote:** "card-update: payload: stats: object ... for badge updates" (Line 47-49)
- **Status:** Explicitly Required (Event Contract).

## Deviation 005: Global Persistence (Requirement 6.4)
- **Spec Quote:** "...is saved independently..." (Line 22)
- **Status:** Explicitly Required.
