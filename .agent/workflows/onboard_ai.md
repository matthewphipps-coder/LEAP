---
description: Onboard AI to LEAP project - read vision, state, and governance basics
---
# /onboard_ai Workflow

## Purpose
Quick orientation for AI agents starting a new session on the LEAP project.

## Steps

// turbo
1. Read the big picture vision:
```
view_file 1_LEAP/1_Governance/4_tracking/VISION.yaml
```

// turbo
2. Read current state (where we are now):
```
view_file 1_LEAP/1_Governance/0_start/CURRENT_STATE.yaml
```

// turbo
3. Read the governance index (folder map):
```
view_file 1_LEAP/1_Governance/0_start/INDEX.yaml
```

## After Reading

Summarize to the user:
1. **LEAP Vision:** AI Speed + Governance Rigor - governance model that orchestrates/validates a Demo Factory
2. **Three Layers:** LEAP (governance) → Demo Factory (builds demos) → Demos (output)
3. **Current Phase:** [from CURRENT_STATE.yaml]
4. **Current Status:** [from CURRENT_STATE.yaml]

Then ask: "What would you like to work on?"

## Key Rules
- Always check CURRENT_STATE.yaml before starting work
- All stage transitions require explicit `!Proceed` from user
- Run `!pulse` if confused about lifecycle stages
