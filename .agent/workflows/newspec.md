---
description: Create a new technical specification following the 7-phase Discovery Protocol
---

# /newspec Workflow

This workflow guides the creation of a new technical specification for the LEAP project, emphasizing "Intentional Friction", folder-based tracking, and AI-managed task templates.

## 🏁 Phase Setup (Initialize)
1.  **Trigger**: User types `/newspec [Topic Name]`.
2.  **Folder Scaffolding**: Create the discovery root in `1_LEAP/3_R&D_GoldSource/Discovery_Lab/`.
    - Format: `DISCO-[UUID/ID]_[Topic_Name]`
    - Create subfolders for each stage (T-minus naming for proper sorting):
      - `T-6_Vision/`
      - `T-5_Research/`
      - `T-4_Scoping/`
      - `T-3_Analysis/`
      - `T-2_Design/`
      - `T-1_Spec/`
      - `T-0_Lock/`
3.  **Template Initialization**: Copy the corresponding `Stage-X.yaml` template from `1_LEAP/3_R&D_GoldSource/Discovery_Methodology/Templates/` into each stage folder (keep the `Stage-X.yaml` filename).
4.  **Logging**: Initialize `DISCOVERY_LOG.md` in the root discovery folder.

## 🔄 The Discovery Lifecycle (-6 to 0)

### AI Responsibilities at EACH Stage

**At Stage START:**
- Read the `Stage-X.yaml` file
- Review the `creative_prompts:` section and use visual artifacts where helpful

**At Stage END (before `!Proceed`):**
1. Mark all `checklist:` items as `true`
2. Populate `outcomes:` with structured YAML summary of agreements
3. Update `status: locked`
4. Only THEN request `!Proceed`

---

### Stage -6: The DreamBig Idea! (Vision)
- **Action**: Read `T-6_Vision/Stage-6.yaml`. 
- **Goal**: Capture the user's raw vision.
- **Creative Options**: Mermaid vision diagram, carousel of inspirations
// turbo
- **Brake**: AI MUST ask for a standalone `!Proceed` before proceeding.

### Stage -5: Divergent Research & Ideation
- **Action**: Read `T-5_Research/Stage-5.yaml`. Expand the problem space.
- **Goal**: Web research and unfiltered brainstorming.
- **Creative Options**: Comparison tables, ASCII architecture, screenshots

### Stage -4: Convergence & Scoping
- **Action**: Read `T-4_Scoping/Stage-4.yaml`. Narrow the scope.
- **Creative Options**: IN/OUT scope carousel, architecture sketch
- **🛑 Breakpoint**: Strongly recommend STARTING A NEW CONVERSATION here.

### Stage -3: Analysis & Risk
- **Action**: Read `T-3_Analysis/Stage-3.yaml`. Deep dive research and technical risks.
- **Creative Options**: Risk matrix table, sequence/flow diagrams

### Stage -2: Define & Document (Design)
- **Action**: Read `T-2_Design/Stage-2.yaml`. Formalize design using flexible methodologies.
- **Creative Options**: HTML prototype, carousel of UI states

### Stage -1: Functional Spec & Supporting Artifacts
- **Action**: Read `T-1_Spec/Stage-1.yaml`. Author `SPEC-XXX.yaml`.
- **Creative Options**: Full HTML prototype, carousel of screens

### Stage 0: Validate (Lock)
- **Action**: Read `T-0_Lock/Stage-0.yaml`. Final sanity check and drift audit.
- **Creative Options**: Diff summary carousel, validation checklist
// turbo
- **Brake**: AI MUST ask for a standalone `!Proceed` (Spec-Lock) to formally hand off to GoldSource build.

## 🚥 Governance Rules
- **Intentional Friction**: Read the `Stage-X.yaml` at the start of every stage.
- **Outcomes Capture**: AI MUST populate `outcomes:` before changing `status: locked`.
- **Checklist Completion**: AI MUST mark all checklist items `true` before lock.
- **Command Rigor**: Only `!Proceed` opens a gate.
- **Socratic Turn**: Always ask "Why?" or "What if?" before requesting a gate.
- **Visual First**: Consider Mermaid diagrams, carousels, and prototypes at every stage.
- **No Bypassing**: Once `/newspec` is initiated, the full 7-stage protocol is mandatory.
