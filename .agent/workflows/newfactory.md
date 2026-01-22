---
description: Create new Factory instance and generate onboarding prompt
---
# /newfactory Workflow

## Purpose
Create a new Factory instance and generate the onboarding prompt for a Factory AI session.

## Steps

// turbo
1. Read the full workflow specification:
```
view_file 3_FactoryTesting/initiate-factory.yaml
```

2. Follow steps 1-5 in the workflow:
   - **Step 1:** Ask user for demo name, scenario, and version
   - **Step 2:** Create factory workspace and copy Gold Source
   - **Step 3:** Generate the onboarding prompt
   - **Step 4:** Save prompt to `3_FactoryTesting/prompts/`
   - **Step 5:** Display confirmation with next steps

## Key Paths
- **Gold Source:** `2_GoldSource/`
- **Factory Workspace:** `~/Documents/DemoInstances/Factory-[version]/`
- **Demo Output:** `~/Documents/DemoOutput/NEXUS-v[version]-[featurename]/`
- **Saved Prompts:** `3_FactoryTesting/prompts/`
