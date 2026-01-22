# GoldSource Phase: 31 - UI State Patterns

> LEAP-060: Loading, empty, error state CSS utilities + glass variations

## ⚠️ CRITICAL: AI MUST NOT SKIP STAGES

**This checklist enforces 8-stage compliance:**
- ❌ "specOnly" does NOT mean skip stages - it means no prototype
- ❌ Do NOT proceed to next stage without completing current stage
- ✅ Check off EVERY item before requesting !Proceed
- ✅ Create EVERY stage artifact (stage-X-name.yaml)
- ✅ Request !Proceed after EVERY stage

## Phase Reference

- **SPEC**: SPEC-002-design-system.yaml (DEFER-001, 002, 003, 005)
- **Prototype**: N/A (specOnly workflow)
- **Workflow**: specOnly
- **Backlog Item**: LEAP-060 (UI State Patterns)
- **Discovery Artifact**: `4_Phases/phase-31/stage-1-discovery.yaml`
- **Backup Location**: `X_GoldSource_Backup/phase-31-{timestamp}`

---

## Stage 1: Discovery ✅
- [x] Read SPEC-002 deferred items
- [x] Assess current scaffold (base.css has .glass, no state patterns)
- [x] Confirm workflow: specOnly
- [x] Create phase folder (phase-31)
- [x] Copy task.md to phase folder
- [x] Create stage-1-discovery.yaml
- [x] Request !Proceed → END CONVERSATION

---

## Stage 2: Research ✅
- [x] Update CURRENT_STATE.yaml (stage: 2, in-progress)
- [x] Read discovery artifact
- [x] Read affected files (base.css, variables.css)
- [x] Create stage-2-research.yaml
- [x] Request !Proceed

---

## Stage 3: Analysis ✅
- [x] RRMD+ risk assessment
- [x] Create stage-3-analysis.yaml
- [x] Request !Proceed

---

## Stage 4: Design ✅
- [x] Create implementation plan (CSS utilities)
- [x] Create stage-4-design.yaml
- [x] Request !Proceed

---

## Stage 5: Implementation
- [x] Create timestamped backup
- [x] Add .loading-skeleton CSS
- [x] Add .empty-state CSS
- [x] Add .error-state CSS
- [x] Add .glass-subtle, .glass-heavy variants
- [ ] Update meta/design-system.yaml
- [/] WIP git commit
- [ ] Create stage-5-implementation.yaml
- [ ] Request !Proceed

---

## Stage 6: Validation
- [ ] Verify patterns work in dark theme
- [ ] Verify patterns work in light theme
- [ ] Create stage-6-validation.yaml
- [ ] Request !Proceed

---

## Stage 7: Testing
- [ ] Browser test all patterns
- [ ] Capture screenshots
- [ ] Create stage-7-testing.yaml
- [ ] Request !Proceed

---

## Stage 8: Closure
- [ ] Final git commit
- [ ] Update CURRENT_STATE.yaml (complete)
- [ ] Update backlog.yaml (LEAP-060 → complete)
- [ ] Create stage-8-closure.yaml
- [ ] Request human sign-off
