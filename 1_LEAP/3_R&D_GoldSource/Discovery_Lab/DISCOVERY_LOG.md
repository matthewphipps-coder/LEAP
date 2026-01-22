# Discovery Log: Spec-Dev Methodology R&D

## 💭 Brainstorming
- **Philosophy**: `/newspec` is NOT "high-speed". It is **"Slow & Right"** (Intentional Friction).
- **AI Memory**: The `.md` log is the AI's external memory. AI must append raw thoughts here so it never "forgets" context. Human only reads YAML.
- **The "Brake"**: Every stage requires a standalone `!Proceed`.
- **Methodology Flex**: User Story Mapping is great for UI, but might be too narrative for logic-heavy features. Need alternatives for Phase 4.

## 🏗️ Merged "Discovery to Build" Mapping
**CRITICAL**: We are currently in **Phase 0 (Ideation)** for this very methodology.

| Discovery Phase | Governance Stage | Methodology | Artifacts |
|:---:|:---:|:---:|:---:|
| **0: Ideation** | **Pre-S1** | **Brainstorming** | Log (Raw Notes) |
| **1: Empathy** | **S1: Discovery** | Design Thinking | Problem Statement, actors, goals. |
| **2: Impact** | **S2: Research** | Impact Mapping | Mermaid Map, Pattern Analysis. |
| **3: Ideation** | **S3: Analysis** | Options A/B | RRMD+ Risk, Propose Simplest/Grandest. |
| **4: Journey** | **S4: Design** | Story Mapping+ | Slide Carousel, HTML Prototype. |
| **5: Lock** | **(Gate to S5)** | Spec Finalization | SPEC-XXX.yaml, !Proceed to Build. |

## ⚖️ Decisions (Phase 4 Methodology Alternatives)
- **Option A: User Story Mapping** (Current Default): Narrative-driven, best for UI/UX-heavy features.
- **Option B: State Transition Mapping**: Best for logic-heavy features (e.g., auth, state management). Focuses on *States* over *Users*.
- **Option C: Wireflows**: Combines wireframes with logic arrows. Best for complex interactions.
- **Option D: Information Architecture (IA)**: Best for data-heavy features (e.g., CMDB, Search).
- **Option E: Integration Flow**: Best for API/External system work. Focuses on data handoffs.
- **Option F: Root Cause Analysis (RCA)**: Best for complex Bug Fixes. Focuses on "The Why" of the failure.
