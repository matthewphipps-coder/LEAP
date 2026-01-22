# GoldSource Phase: [PHASE_NUMBER] - [PHASE_NAME]

> Copy this template to `4_Phases/phase-{X}/task.md` at Stage 2 start.
> All references are to Methodology/ files - no Factory governance files.

## Phase Reference

- **SPEC**: [SPEC-XXX-name.yaml or "N/A - direct fix"]
- **Prototype**: [SPEC-XXX-prototype.html or "N/A"]
- **Workflow**: [full / specOnly / direct]
- **Discovery Artifact**: `4_Phases/phase-{X}/stage-1-discovery.yaml`
- **Backup Location**: `X_GoldSource_Backup/phase-{X}-{timestamp}`

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
cp -r X_GoldSource_Backup/phase-{X}-{timestamp} 2_GoldSource
```

---

## Stage 2: Research
**Objective**: Setup phase and understand scaffold impact

📖 **Read before starting**:
- `stage-1-discovery.yaml` (from previous conversation)
- `1_LEAP/2_Build_GoldSource/Methodology/coding-standards.yaml`
- `2_GoldSource/meta/ARCHITECTURE.yaml` (technical context)
- `2_GoldSource/archetypes/` (pattern guidance - OK to read)

### First Steps (MANDATORY):
- [ ] Create phase folder: `mkdir -p 4_Phases/phase-{X}`
- [ ] Update `CURRENT_STATE.yaml` (status: in-progress, stage: 2)
- [ ] Copy this template to phase folder

### Research:
- [ ] Read discovery artifact from Stage 1
- [ ] Read affected scaffold files
- [ ] List files to modify with impact assessment
- [ ] Create `stage-2-research.yaml`
- [ ] Request !Proceed

---

## Stage 3: Analysis
**Objective**: RRMD+ risk assessment (ALWAYS required)

📖 **Read before starting**:
- `1_LEAP/2_Build_GoldSource/Methodology/goldsource-increment.yaml` (riskAssessment section)

- [ ] Document what is being changed
- [ ] Assess demo compatibility impact
- [ ] Identify rollback strategy
- [ ] Compare implementation approaches
- [ ] Create `stage-3-analysis.yaml` with RRMD+
- [ ] Request !Proceed

---

## Stage 4: Design
**Objective**: Validate approach before implementation

📖 **Read before starting**:
- `1_LEAP/2_Build_GoldSource/Methodology/coding-standards.yaml` (keyPatterns)

**For full workflow (with prototype):**
- [ ] Create SPEC-XXX-prototype.html
- [ ] Human reviews prototype in browser

**For direct workflow (no prototype):**
- [ ] Create implementation plan (files, approach)
- [ ] Get human approval

- [ ] Create `stage-4-design.yaml`
- [ ] Request !Proceed

---

## Stage 5: Implementation
**Objective**: Implement in GoldSource

📖 **Read before starting**:
- `1_LEAP/2_Build_GoldSource/Methodology/coding-standards.yaml`

### ⚠️ MANDATORY BACKUP FIRST:
```bash
cp -r 2_GoldSource X_GoldSource_Backup/phase-{X}-$(date +%Y%m%d-%H%M)
```

- [ ] **Create timestamped backup of GoldSource FIRST**
- [ ] Modify scaffold files per design
- [ ] WIP commit: `git commit -m 'WIP Phase {X}: [description]'`
- [ ] Follow Triad pattern for new features
- [ ] Add AI-First file headers

### Documentation Updates (check each for relevance):
- [ ] `meta/functionality.yaml` - if features added/changed
- [ ] `meta/ARCHITECTURE.yaml` - if folder/module structure changed
- [ ] `meta/architectural-standards.yaml` - if new code patterns
- [ ] `meta/design-system.yaml` - if new design tokens/colors
- [ ] `meta/theme-extension-guide.yaml` - if theme capabilities changed

- [ ] Create `stage-5-implementation.yaml`
- [ ] Request !Proceed

---

## Stage 6: Validation
**Objective**: Verify GoldSource matches design intent

- [ ] Compare GoldSource to prototype/spec/plan
- [ ] Verify all requirements implemented
- [ ] Check for regressions in existing features
- [ ] Validate documentation updated
- [ ] Create `stage-6-validation.yaml`
- [ ] Request !Proceed

---

## Stage 7: Testing
**Objective**: Full scaffold testing

- [ ] Start server: `python3 -m http.server 8080` in `2_GoldSource/scaffold/`
- [ ] Test new feature end-to-end
- [ ] Test existing features for regressions
- [ ] Capture screenshots to `4_Phases/phase-{X}/`
- [ ] Create `stage-7-testing.yaml`
- [ ] Request !Proceed

---

## Stage 8: Closure
**Objective**: Finalize and document

- [ ] Final commit: `git commit -m 'Phase {X}: [phase name] complete'`
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
