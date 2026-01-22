---
description: Start a GoldSource improvement phase (scaffold code, factory governance, backlog items)
---

# /GoldSourceIncrement Workflow

## Purpose
Use this when LEAP needs to modify GoldSource (distinct from Factory extending it).

## When to Use
- Adding new scaffold features
- Modifying scaffold files
- GoldSource bug fixes or backlog items
- Refining factory methodology
- Implementing functional specs (SPEC-XXX)

## Steps

// turbo
1. Read the methodology:
```
view_file 1_LEAP/2_Build_GoldSource/Methodology/goldsource-increment.yaml
```

// turbo
2. Read coding standards:
```
view_file 1_LEAP/2_Build_GoldSource/Methodology/coding-standards.yaml
```

3. Start Stage 1: Discovery
   - Identify the improvement needed
   - Review existing scaffold capabilities
   - Determine workflow: full / specOnly / direct
   - Create `stage-1-discovery.yaml`
   - Request !Proceed

4. **END CONVERSATION** after Stage 1 approval
   - AI tells human: "Discovery complete. Start a new conversation for Stage 2."

## Key Rules
- Stage 2 MUST start in a new conversation
- RRMD+ is ALWAYS required (Stage 3)
- Backup GoldSource BEFORE modifications (Stage 5)
- No references to GoldSource governance/ files

## Files
- [goldsource-increment.yaml](file:///Users/matthew.phipps/Documents/LEAP/1_LEAP/2_Build_GoldSource/Methodology/goldsource-increment.yaml) - Full methodology
- [coding-standards.yaml](file:///Users/matthew.phipps/Documents/LEAP/1_LEAP/2_Build_GoldSource/Methodology/coding-standards.yaml) - LEAP authority + code patterns
- [TASK_TEMPLATE.md](file:///Users/matthew.phipps/Documents/LEAP/1_LEAP/2_Build_GoldSource/Methodology/TASK_TEMPLATE.md) - Copy at Stage 2 start
