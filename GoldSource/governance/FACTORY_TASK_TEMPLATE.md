# Factory Task: [DEMO_NAME]

> Copy this template to your factory workspace as `task.md` and adapt for your demo.
> Read the linked docs at each stage - they contain the authoritative rules.

## Workspace Reference

- **Factory Workspace**: [FACTORY_WORKSPACE_PATH]
- **Demo Output**: [DEMO_OUTPUT_PATH]
- **Gold Source**: (read-only reference)

Relative paths in this document are from Gold Source root.

---

## ⚠️ Recovery Instructions (!bump)

**If session restarts or you receive "continue":**

1. **DO NOT assume previous work is complete**
2. Read `CURRENT_STATE.yaml` for current stage
3. Read this `task.md` - checkboxes show completed work  
4. Read latest `stage-X-*.yaml` artifact for context
5. Report status to human before proceeding
6. **DO NOT advance stage without verifying outputs exist**

**Trigger word: `!bump`** - Human can type this to invoke full recovery protocol.

See `governance/factory-protocol.yaml` → `recoveryProtocol` for full details.

---

## Stage 1: Discovery
**Objective**: Define demo requirements from user scenario

📖 **Read before starting**: `governance/lifecycle-stages.yaml` (Stage 1 section)

- [ ] Document demo name, scenario, target archetype
- [ ] List key features and user flows
- [ ] Create `stage-1-discovery.yaml` → save to **FACTORY_WORKSPACE**
- [ ] Request !Proceed

### Demo-specific items:
- [ ] [Add Discovery items for this demo]

---

## Stage 2: Research
**Objective**: Review scaffold capabilities, identify gaps

📖 **Read before starting**:
- `governance/lifecycle-stages.yaml` (Stage 2 section)
- `meta/ARCHITECTURE.yaml` (scaffold structure overview)
- `meta/functionality.yaml` (what scaffold already provides)

- [ ] Review scaffold structure (core/, ui/, features/)
- [ ] Identify gaps between requirements and scaffold
- [ ] Create `stage-2-research.yaml` → save to **FACTORY_WORKSPACE**
- [ ] Request !Proceed

### Demo-specific items:
- [ ] [Add Research items for this demo]

---

## Stage 3: Analysis
**Objective**: Risk assessment, approach options

📖 **Read before starting**: `governance/lifecycle-stages.yaml` (Stage 3 section)

- [ ] Identify risks
- [ ] Compare approach options
- [ ] Create `stage-3-analysis.yaml` → save to **FACTORY_WORKSPACE**
- [ ] Request !Proceed

### Demo-specific items:
- [ ] [Add Analysis items for this demo]

---

## Stage 4: Design
**Objective**: Implementation plan, wireframes

📖 **Read before starting**:
- `governance/lifecycle-stages.yaml` (Stage 4 section)
- `governance/artifact-manifest.yaml` (wireframe location: lines 64-66)
- `archetypes/agentic-dashboard/archetype.yaml` (pattern decisions)
- `meta/functionality.yaml` (what scaffold provides)

⚠️ **Critical**: Wireframes go in FACTORY_WORKSPACE (see artifact-manifest.yaml)

- [ ] Create detailed implementation plan
- [ ] Generate wireframes → save to **FACTORY_WORKSPACE** (not brain/, not artifacts/)
- [ ] Create `stage-4-design.yaml` → save to **FACTORY_WORKSPACE**
- [ ] Request !Proceed

### Demo-specific items:
- [ ] [Add Design items for this demo]

---

## Stage 5: Implementation
**Objective**: Build demo based on design

📖 **Read before starting**:
- `governance/lifecycle-stages.yaml` (Stage 5 section)
- `governance/demo-rules.yaml` (code standards, locked files)
- `meta/architectural-standards.yaml` (lines 130-170: naming, locked files)
- `meta/architectural-standards.yaml` (lines 175-341: PAGE_TABS, PAGE_SIDEBAR_ACTIONS, multi-page)
- `meta/design-system.yaml` (design tokens, visual patterns)
- `meta/theme-extension-guide.yaml` (how to customize themes)
- `governance/artifact-manifest.yaml` (lines 72-75: functionality.yaml location)

⚠️ **Critical conventions** (from architectural-standards.yaml):
- Path naming: SINGULAR (features/incident/, not incidents/)
- File naming: kebab-case
- Locked files: DO NOT MODIFY (see demo-rules.yaml scaffoldRules.locked)

⚠️ **Critical**: Update `meta/functionality.yaml` in **DEMO OUTPUT** with new features

- [ ] Read the docs listed above
- [ ] Implement design changes following conventions
- [ ] Add AI-First headers to all new .js files
- [ ] Update functionality.yaml in demo output
- [ ] Create `stage-5-implementation.yaml` → save to **FACTORY_WORKSPACE**
- [ ] Request !Proceed

### Demo-specific items:
- [ ] [Add Implementation items for this demo]

---

## Stage 6: Validation
**Objective**: Verify all Discovery features implemented

📖 **Read before starting**: `governance/lifecycle-stages.yaml` (Stage 6 section)

- [ ] Compare Discovery requirements to functionality.yaml
- [ ] Verify all features implemented or explained in scopeChanges
- [ ] Verify README.md exists in demo output
- [ ] Confirm deployment readiness
- [ ] Create `stage-6-validation.yaml` → save to **FACTORY_WORKSPACE**
- [ ] Request !Proceed

### Demo-specific items:
- [ ] [Add Validation items for this demo]

---

## Stage 7: Testing
**Objective**: Test demo in browser

📖 **Read before starting**:
- `governance/lifecycle-stages.yaml` (Stage 7 section)
- `governance/artifact-manifest.yaml` (test evidence location)

⚠️ **Critical**: Save screenshots/recordings to **FACTORY_WORKSPACE** (not brain/, not artifacts/)

- [ ] Start server: `python3 -m http.server 8080` in demo output
- [ ] Test all features in browser
- [ ] Save screenshots → **FACTORY_WORKSPACE**
- [ ] Save recordings → **FACTORY_WORKSPACE**
- [ ] Create `stage-7-testing.yaml` → save to **FACTORY_WORKSPACE**
- [ ] Request !Proceed

### Demo-specific items:
- [ ] [Add Testing items for this demo]

---

## Stage 8: Closure
**Objective**: Lessons learned, sign-off

📖 **Read before starting**: `governance/lifecycle-stages.yaml` (Stage 8 section)

- [ ] Document lessons learned
- [ ] Identify improvements for Gold Source
- [ ] Create README.md → save to **DEMO OUTPUT**
- [ ] Create `stage-8-closure.yaml` → save to **FACTORY_WORKSPACE**
- [ ] Request human sign-off

### Demo-specific items:
- [ ] [Add Closure items for this demo]
