# GoldSource Phase: 32 - DISCO-004 Card & Canvas UI

> Copy this template to `4_Phases/phase-{X}/task.md` at Stage 1 end.
> All references are to Methodology/ files - no Factory governance files.

## ⚠️ CRITICAL: AI MUST NOT SKIP STAGES

**This checklist enforces 8-stage compliance:**
- ❌ "specOnly" does NOT mean skip stages - it means no prototype
- ❌ Do NOT proceed to next stage without completing current stage
- ❌ Do NOT combine multiple stage artifacts into one
- ✅ Check off EVERY item before requesting !Proceed
- ✅ Create EVERY stage artifact (stage-X-name.yaml)
- ✅ Request !Proceed after EVERY stage

## Phase Reference

- **SPEC**: 1_LEAP/3_R&D_GoldSource/Discovery_Lab/DISCO-004_Card_And_Canvas_UI/T-0_Lock/SPEC-004-card-canvas.yaml
- **Prototype**: 1_LEAP/3_R&D_GoldSource/Discovery_Lab/DISCO-004_Card_And_Canvas_UI/T-0_Lock/SPEC-004-prototype.html
- **Workflow**: full
- **Discovery Artifact**: `4_Phases/phase-32/stage-1-discovery.yaml`
- **Backup Location**: `X_GoldSource_Backup/phase-32-{timestamp}`

---

## ⚠️ Recovery Instructions (!bump)

**If session restarts or you receive "continue":**

1. **DO NOT assume previous work is complete**
2. Read `CURRENT_STATE.yaml` for current stage
3. Read this `task.md` - checkboxes show completed work  
4. Read latest `stage-X-*.yaml` artifact for context
5. Report status to human before proceeding

**Rollback if needed:**
```bash
rm -rf 2_GoldSource
cp -r X_GoldSource_Backup/phase-32-{timestamp} 2_GoldSource
```

---

## Stage 1: Discovery
**Objective**: Define improvement and setup phase

- [x] Read Methodology & Standards
- [x] Review Input Files (Specs & Prototype)
- [x] Create Phase Directory (`4_Phases/phase-32`)
- [x] Create `stage-1-discovery.yaml`
- [x] Create `task.md` (Self)
- [/] Request !Proceed

---

## Stage 2: Research
**Objective**: Setup phase and understand scaffold impact

📖 **Read before starting**:
- `stage-1-discovery.yaml` (from previous conversation)
- `1_LEAP/2_Build_GoldSource/Methodology/coding-standards.yaml`
- `2_GoldSource/meta/ARCHITECTURE.yaml` (technical context)
- `2_GoldSource/archetypes/` (pattern guidance - OK to read)

### First Steps (MANDATORY):
- [x] Create phase folder: `mkdir -p 4_Phases/phase-32` (Already done in Stage 1, verify)
- [x] Update `CURRENT_STATE.yaml` (status: in-progress, stage: 2)
- [x] Copy this template to phase folder (Already done in Stage 1, verify)

### Research:
- [x] Read discovery artifact from Stage 1
- [x] Read affected scaffold files
- [x] List files to modify with impact assessment
- [x] Create `stage-2-research.yaml`
- [/] Request !Proceed

---

## Stage 3: Analysis
**Objective**: RRMD+ risk assessment (ALWAYS required)

📖 **Read before starting**:
- `1_LEAP/2_Build_GoldSource/Methodology/goldsource-increment.yaml` (riskAssessment section)

- [x] Document what is being changed
- [x] Assess demo compatibility impact
- [x] Identify rollback strategy
- [x] Compare implementation approaches
- [x] Create `stage-3-analysis.yaml` with RRMD+
- [/] Request !Proceed

---

## Stage 4: Design
**Objective**: Validate approach before implementation

📖 **Read before starting**:
- `1_LEAP/2_Build_GoldSource/Methodology/coding-standards.yaml` (keyPatterns)

**For full workflow (with prototype):**
- [ ] Create SPEC-XXX-prototype.html (Already exists in T-0_Lock, verify if copy needed)
- [ ] Human reviews prototype in browser (Already done in Phase 31)

**For direct workflow (no prototype):**
- [x] Create implementation plan (files, approach)
- [x] Get human approval

- [x] Create `stage-4-design.yaml`
- [/] Request !Proceed

---

## Stage 5: Implementation
**Objective**: Implement in GoldSource

📖 **Read before starting**:
- `1_LEAP/2_Build_GoldSource/Methodology/coding-standards.yaml`

### ⚠️ MANDATORY BACKUP FIRST:
```bash
cp -r 2_GoldSource X_GoldSource_Backup/phase-32-$(date +%Y%m%d-%H%M)
```

- [x] **Create timestamped backup of GoldSource FIRST**
- [x] Modify scaffold files per design
- [x] WIP commit: `git commit -m 'WIP Phase 32: [description]'`
- [x] Follow Triad pattern for new features
- [x] Add AI-First file headers

### Documentation Updates (check each for relevance):
- [x] `meta/functionality.yaml` - if features added/changed
- [x] `meta/ARCHITECTURE.yaml` - if folder/module structure changed
- [ ] `meta/architectural-standards.yaml` - if new code patterns
- [x] `meta/design-system.yaml` - if new design tokens/colors
- [ ] `meta/theme-extension-guide.yaml` - if theme capabilities changed

- [x] Create `stage-5-implementation.yaml`
- [/] Request !Proceed

---

## Stage 6: Validation
**Objective**: Verify GoldSource matches design intent

- [x] Compare GoldSource to prototype/spec/plan
- [x] Verify all requirements implemented
- [x] Check for regressions in existing features
- [x] Validate documentation updated
- [x] Create `stage-6-validation.yaml`
- [x] Request !Proceed

---

## Stage 7: Testing
**Objective**: Full scaffold testing

- [x] Start server: `python3 -m http.server 8080` in `2_GoldSource/scaffold/`
- [/] Test new feature end-to-end
- [/] Test existing features for regressions
- [ ] Capture screenshots to `4_Phases/phase-32/`
- [x] Create `stage-7-testing.yaml`
- [/] Request !Proceed

---

## Stage 8: Closure
**Objective**: Finalize and document

- [ ] Final commit: `git commit -m 'Phase 32: Card & Canvas UI complete'`
- [ ] Update `CURRENT_STATE.yaml` (status: complete)
- [ ] Update `backlog.yaml` (close items)
- [ ] Document lessons learned

### Factory Governance Check (if patterns changed):
- [ ] `governance/demo-rules.yaml` - if locked files or naming changed
- [ ] `governance/lifecycle-stages.yaml` - if stage expectations changed
- [ ] `governance/templates/*.yaml` - if new template fields needed
- [ ] `governance/FACTORY_README.yaml` - if file registry changed

- [ ] Create `stage-8-closure.yaml`
- [ ] Request human sign-off
