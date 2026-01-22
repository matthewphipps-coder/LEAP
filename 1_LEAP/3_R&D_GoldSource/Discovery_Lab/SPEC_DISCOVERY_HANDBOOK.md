# 📕 Spec Discovery Handbook (v1.0)

> "Slow is smooth, smooth is fast." — The philosophy of Intentional Friction.

## 🌟 Philosophy: Intentional Friction
The **Spec Discovery Protocol** is designed to counteract "Agent Racing"—the tendency for AI to jump to implementation before the human has fully crystallized the vision. We use deliberate pauses, socratic questioning, and visual anchors to ensure we build the *right* thing before we build it *right*.

---

## 🔄 The Discovery Lifecycle (-6 to 0)

| Stage | Title | Methodology | Visual Anchor | Goal |
|:---:|---|---|---|---|
| **-6** | **The DreamBig Idea!** | User Vision Setting | `n/a` | User provides raw core intent. |
| **-5** | **Divergent Research** | Web Exploration / Concept Discovery | `DISCOVERY_LOG.md` | Expand research and discover new concepts. |
| **-4** | **Convergence & Scoping** | Scoping / Filtering | **Forced Breakpoint** | Condense into manageable scope. Reset context. |
| **-3** | **Analysis & Risk** | Deep Dive Research | Risk Registry | Thoroughly research bold ideas from every aspect. |
| **-2** | **Define & Document**   | Flexible (User Stories / Diagrams etc.) | Documentation Map | utilize specific methodologies to formalize design. |
| **-1** | **Functional Spec**    | Spec Authoring & Artifacts | `SPEC-XXX.yaml` | Provide the exact detail needed for GoldSource Build. |
| **0**  | **Validate**           | Sanity Check / readiness | **Baseline Audit** | Verify assumptions, safety, and drift-management. |

---

## 🚦 Resilience Patches

### 1. The Forced Breakpoint (Anti-Fatigue)
**Stage -4** is where we recommend **starting a fresh conversation**. This resets the AI's context window and gives the Human a mental break before committing to the design.

### 2. The GoldSource Drift Check
**Stage 0** requires a **Baseline Audit**. We must verify that the GoldSource scaffold hasn't drifted since we started discovery.

### 3. AI-Managed Scaffolding (T-Minus Folders)
Every discovery instance is managed through a folder-based structure created during **Setup** (e.g., `DISCO-001_MyTopic`). We use **T-minus** naming (e.g., `T-6_Vision` to `T-0_Lock`) to ensure the 7 stages sort chronologically in file explorers. Each folder contains a `TASK.yaml` (sourced from `1_LEAP/3_R&D_GoldSource/Discovery_Methodology/Templates/`) which the AI MUST follow.

---

## 🚥 Governance Gates
1. **The `!Proceed` Rule**: No phase may advance without a standalone `!Proceed` command from the human.
2. **The Option Rule**: In Phase 3, the AI MUST propose at least 2 distinct paths.
3. **The Curiosity Rule**: Before every gate, the AI must ask: "Is there anything we're missing?"

---

## 🖼️ Visual Anchor Suite
- **Mermaid Maps**: For logic and impact hierarchies.
- **Slide Carousels**: For step-by-step user journeys.
- **AI Mockups**: For aesthetic grounding via `generate_image`.
- **HTML Prototypes**: For high-fidelity interaction testing.

---

*This handbook is a living document of the LEAP project.*
