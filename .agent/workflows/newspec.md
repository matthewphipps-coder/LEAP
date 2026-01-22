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
3.  **Template Initialization**: Copy the corresponding `.yaml` template from `1_LEAP/3_R&D_GoldSource/Discovery_Methodology/Templates/` into each stage folder as `TASK.yaml`.
4.  **Logging**: Initialize `DISCOVERY_LOG.md` in the root discovery folder.

## 🔄 The Discovery Lifecycle (-6 to 0)

### Stage -6: The DreamBig Idea! (Vision)
- **Action**: Read `T-6_Vision/TASK.yaml`. 
- **Goal**: Capture the user's raw vision. Update `TASK.yaml` status to `locked` after completion.
// turbo
- **Brake**: AI MUST ask for a standalone `!Proceed` before proceeding.

### Stage -5: Divergent Research & Ideation
- **Action**: Read `T-5_Research/TASK.yaml`. Expand the problem space.
- **Goal**: Web research and unfiltered brainstorming.

### Stage -4: Convergence & Scoping
- **Action**: Read `T-4_Scoping/TASK.yaml`. Narrow the scope.
- **🛑 Breakpoint**: Strongly recommend STARTING A NEW CONVERSATION here. Update `TASK.yaml` to reflect the breakpoint.

### Stage -3: Analysis & Risk
- **Action**: Read `T-3_Analysis/TASK.yaml`. Deep dive research and technical risks.

### Stage -2: Define & Document (Design)
- **Action**: Read `T-2_Design/TASK.yaml`. Formalize design using flexible methodologies.

### Stage -1: Functional Spec & Supporting Artifacts
- **Action**: Read `T-1_Spec/TASK.yaml`. Author `SPEC-XXX.yaml`.

### Stage 0: Validate (Lock)
- **Action**: Read `T-0_Lock/TASK.yaml`. Final sanity check and drift audit.
// turbo
- **Brake**: AI MUST ask for a standalone `!Proceed` (Spec-Lock) to formally hand off to GoldSource build.

## 🚥 Governance Rules
- **Intentional Friction**: Read the `TASK.yaml` at the start of every stage and update it at the end.
- **Command Rigor**: Only `!Proceed` opens a gate.
- **Socratic Turn**: Always ask "Why?" or "What if?" before requesting a gate.
- **No Bypassing**: Once `/newspec` is initiated, the full 7-stage protocol is mandatory.
