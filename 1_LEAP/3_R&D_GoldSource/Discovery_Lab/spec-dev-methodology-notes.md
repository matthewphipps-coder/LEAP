# Spec Development Methodology - Design Notes

> Living document - updated during R&D conversation
> Last updated: 2026-01-22T14:07

---

## ✅ Established So Far

| Decision | Notes |
|----------|-------|
| **Trigger** | Slash command `/newspec` |
| **Tempo** | One question at a time, conversational |
| **Contradictions OK** | Earlier answers can be wrong - revisit |
| **Real-time tracking** | AI captures notes in visible location |
| **Artifact location** | `1_LEAP/3_R&D_GoldSource/` (visible to user) |
| **Methodologies** | Draw from Design Thinking, User Story Mapping, Impact Mapping |

## 🎯 Core Principles

1. **Collaborative** - AI guides, user thinks and decides
2. **Educational** - Help human understand, not just produce output
3. **One question at a time** - Don't overwhelm
4. **Ideas tracked** - Good ideas captured before forgotten
5. **Decisions revisitable** - Early decisions can be changed

---

## 📚 Selected Methodologies

### ✅ Design Thinking (1)
- Empathize first → understand problem before jumping to solutions
- "Define" phase = articulate the problem clearly

### ✅ User Story Mapping (3)
- See the big picture horizontally (the journey)
- Slice vertically for releases (priorities)
- Visual artifact that grows during conversation?

### ✅ Impact Mapping (6)
- WHY → WHO → HOW → WHAT structure
- Prevents scope creep by connecting everything to goal

---

## 🛑 The "Agent Racing" Problem

One of the biggest friction points is when the AI assumes a decision is final and "races" to the end of the task.

**Governance Research (Existing "Brakes"):**
- **Invalid Triggers**: `factory-protocol.yaml` lists "yes", "ok", "continue" as *invalid* gate permissions.
- **Standalone !Proceed**: `architectural-standards.yaml` requires "Proceed" as a standalone message before file writes.
- **Conversation Boundary**: `goldsource-increment.yaml` mandates ending the session after Stage 1.
- **Consultative Partnering**: AI must propose multiple options (Option A vs Option B) for complex problems.

---

## 🏗️ The Merged Discovery Protocol

### Phase 0: Ideation & "Thing Typing" (Pre-Stage 1)
- **Methodology**: **Brainstorming** (Raw & Unfiltered).
- **Goal**: Get everything on the page. Categorize the "Type" of problem (UI/UX, Logic, Data, Governance).
- **Visual**: Bulleted list in `DISCOVERY_LOG.md`.

### Phase 1: Empathy & Discovery (Stage 1)
- **Methodology**: **Design Thinking** (Empathize & Define).
- **Goal**: Understand the human context *before* the technical gap.
- **Visual**: Mermaid map root node.

### Phase 2: Research & Impact (Stage 2)
- **Methodology**: **Impact Mapping** (Why → Who → How).
- **Goal**: Connect technical research to business goals. 
- **Visual**: Branched Mermaid Map.

### Phase 3: Analysis & Ideation (Stage 3)
- **Methodology**: **RRMD+** (Risk/Results/Mitigation/Decision).
- **Goal**: Compare "Simplest" vs "Grandest" solution paths under a risk lens.
- **Visual**: Options Comparison Table.

### Phase 4: Design & Journey (Stage 4)
- **Methodology**: **User Story Mapping**.
- **Goal**: Walk through the "Happy Path" visually.
- **Visual**: Slide Carousel & HTML Prototype.
