# DISCO-001: Extensible AI Form Evolution

**Created:** 2026-01-22T17:35:00Z  
**Status:** Stage -2 (Define & Document) - Ready to Start

---

## Stage -6: The DreamBig Idea! 🚀

### Vision Capture

**The Problem:**  
Enterprise software (ServiceNow and beyond) is fundamentally form-based: fields, rows of data, tabs, buttons. In the AI-first world, this paradigm is obsolete.

**The Insight:**  
"AI is the new UI" — but users still need to *see* what they're working on. NEXUS pages open "forms" for holiday requests, finance approvals, field service, CRM — but these shouldn't revert to old-school forms.

**The Vision:**  
Reimagine the UX where:
- AI is the **constant companion** within any form context
- The "form" **orients itself** to suit human/AI collaboration, not just display fields
- **Agents do the work**, humans **collaborate and guide**
- The visual experience adapts to what human + AI are doing *together*

**ServiceNow Context:**  
This must work for ServiceNow's breadth — ITSM, HR, CSM, Field Service, etc. The solution needs to be **extensible** across any record type while feeling native to the platform.

### Socratic Insight (Carry Forward to Stage -5)
> 💡 **Dynamic Field Visibility:** What if AI could *change* what fields are visible based on the current conversation? Hide irrelevant sections when AI is handling them, expand what the human needs to see.

**User Confirmation:** ✅ Vision captured correctly. Dynamic form idea endorsed for Stage -5 exploration.

---

## Stage -5: Divergent Research & Ideation
**Status:** In Progress | **Mode:** DIVERGENT 🌀

### Research Findings

#### 1. Industry Precedents

| Platform | Pattern | Relevance |
|----------|---------|-----------|
| **Salesforce Dynamic Forms** | Admin-defined rules show/hide fields by role, record type, or conditions | Proves enterprise adoption of dynamic visibility |
| **Microsoft Copilot** | AI as side panel + inline suggestions | AI companion pattern, but form still static |
| **ServiceNow Agent Workspace** | Split-pane with work list + detail + chat | Current best-in-breed, but forms unchanged |

#### 2. AI Context-Aware UX Patterns

From web research:
- **Progressive Disclosure** — Show only necessary fields, expand on demand
- **Cognitive Load Reduction** — AI hides irrelevant sections when handling them
- **Real-time Prediction** — Pre-fill fields based on conversation context
- **Role-Adaptive Views** — Different users see different form layouts
- **Device-Responsive Forms** — Mobile vs desktop shows different field prioritization

#### 3. DIVERGENT BRAINSTORMING — Bold Ideas 💡

| Idea | Description | Boldness |
|------|-------------|----------|
| **Conversational Form Collapse** | As AI handles fields, they collapse to "AI handled ✓" chips | ⭐⭐⭐⭐ |
| **Focus Lens** | Only the field being discussed expands to full edit mode | ⭐⭐⭐⭐⭐ |
| **AI Narration Layer** | AI explains what it's doing in a persistent summary bar | ⭐⭐⭐ |
| **Ghost Fields** | AI-suggested values appear as ghost text, user confirms | ⭐⭐⭐ |
| **Form as Conversation Artifact** | The "form" is actually a structured summary of what was agreed | ⭐⭐⭐⭐⭐ |
| **Split Reality** | Left pane = conversation, Right pane = live-updating form preview | ⭐⭐⭐ |
| **Intent Cards** | Instead of fields, show intent-based cards: "Request Details", "Approvals Needed" | ⭐⭐⭐⭐ |
| **AI Field Ownership** | Each field tagged as "AI handling" or "Human required" with visual distinction | ⭐⭐⭐⭐ |
| **Temporal Form** | Form shows history of changes with AI attribution inline | ⭐⭐⭐ |

#### 4. ServiceNow-Specific Considerations

| Factor | Implication |
|--------|-------------|
| **Record Types** | Solution must work for Incident, Request, Case, HR Case, Field Service Work Order... |
| **Table Extensions** | ServiceNow uses table inheritance — need extensible field rendering |
| **UI Builder / Now Experience** | Current client-side framework — must work with Seismic components |
| **Agent Workspace** | Primary entry point for AI interactions — should integrate seamlessly |
| **Mobile** | ServiceNow Mobile requires responsive adaptation |
| **ACLs / Business Rules** | Field visibility also governed by server-side rules |

#### 5. Key Questions Emerging

1. **Authoring Model:** Who defines what fields AI can handle vs. require human input?
2. **State Sync:** How does the form stay in sync with conversation state?
3. **Escape Hatch:** How does the human "take over" from AI mid-field?
4. **Audit Trail:** How do we show who/what changed each field (human vs AI)?
5. **Extensibility:** How does a ServiceNow admin configure this per form without code?

---

### 🔥 PARADIGM SHIFT: The Three-Layer Model

**User Insight:** What if data/rules is *just* a System of Record problem? Maybe **only agents** update fields in SoRs. Enterprise software as we know it barely exists anymore.

```
┌─────────────────────────────────────────────────────────────┐
│                    👤 NEXUS (Human Layer)                   │
│         • Conversation interface                            │
│         • Intent expression, guidance, confirmation         │
│         • NO direct field editing                           │
└─────────────────────────────────┬───────────────────────────┘
                                  │ Intent + Confirmation
                                  ▼
┌─────────────────────────────────────────────────────────────┐
│                 🤖 AGENT LAYER (MCP/Agentic)                │
│         • Translates human intent to field updates          │
│         • 🔒 SECURITY & GOVERNANCE LIVES HERE               │
│         • Business rules, compliance, validation            │
│         • ACLs, approval workflows, audit logging           │
└─────────────────────────────────┬───────────────────────────┘
                                  │ Structured Updates
                                  ▼
┌─────────────────────────────────────────────────────────────┐
│                   💾 SYSTEMS OF RECORD                      │
│         • ServiceNow tables, Salesforce, SAP, etc.          │
│         • Agent is ONLY writer (no human direct access)     │
│         • Data integrity guaranteed by agent layer          │
└─────────────────────────────────────────────────────────────┘
```

#### Implications of This Model

| Old Model | New Model |
|-----------|-----------|
| Human edits fields → validation fires → save | Human states intent → agent validates → agent commits |
| Security at UI layer (button visibility, field read-only) | Security at agent layer (agent refuses or explains) |
| Forms designed for human data entry | "Forms" become **confirmation surfaces** |
| Business rules fire on save | Business rules are **agent knowledge** |
| Errors shown after submit | Errors **prevented conversationally** before action |

#### Bold Outcomes from This Thinking

1. **NEXUS becomes pure conversation** — no form chrome at all
2. **"Forms" become AI-generated summaries** — "Here's what I'm about to do..."
3. **Human never sees a text input** — just confirms/redirects agent proposals
4. **Security is invisible to user** — agent just explains what's possible/not
5. **Governance is agentic** — compliance happens in agent layer, not UI enforcement

---

### ⚖️ THE HUMAN BALANCE: Visual Context Matters

**User Insight:** Humans still need to *see* things. Conversation alone isn't enough.

**Human Challenges in Pure Conversation:**
- 🧠 **Context Maintenance** — "What are we discussing? Why is this important?"
- 👁️ **Quick Scanning** — "I can see for myself without having to ask"
- 🔍 **Show Me** — "Just show me the thing instead of describing it"
- ❓ **Am I Missing Something?** — Visual overview catches gaps conversation might miss

**The Balance:**
```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│   CONVERSATION                    VISUAL CONTEXT            │
│   ───────────────                 ──────────────            │
│   • Intent expression             • Orientation ("where am  │
│   • Guidance & redirection          I in this record?")     │
│   • Confirmation of actions       • Quick scan access       │
│   • Natural language queries      • "Show me" on demand     │
│                                   • Ambient awareness       │
│                                                             │
│          ◄──────── THE SWEET SPOT ────────►                 │
│                                                             │
│   NOT pure conversation    |    NOT traditional forms       │
│   NOT voice-only           |    NOT field-by-field entry    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Emerging Design Principle:**
> **The visual surface is a companion, not the primary interface.** It provides ambient context and on-demand detail while conversation drives action.

#### New Pattern Ideas from This Balance

| Pattern | Description |
|---------|-------------|
| **Ambient Context Pane** | Always-visible summary that updates as conversation progresses |
| **Expandable Detail Regions** | Click to dive deeper, collapse when not needed |
| **"Show Me" Trigger** | Voice/text command instantly surfaces relevant visual |
| **Progress Breadcrumbs** | Visual trail of what's been discussed/decided |
| **Highlight-on-Mention** | When AI mentions a field, it pulses in the visual pane |

---

### 🎨 DYNAMIC VISUALIZATION MEDIUMS

**User Insight:** It's not just about which *fields* to show — AI can choose the *medium* itself.

**Beyond Fields — The Visualization Palette:**

| Medium | Use Case | Example |
|--------|----------|---------|
| 📍 **Maps** | Location-based data, field service routes | "Show me where the technicians are" |
| 📅 **Timelines** | History, SLA tracking, project phases | "What happened before this escalated?" |
| 🖼️ **Pictures** | Asset photos, before/after, evidence | "Show me the damaged equipment" |
| 📝 **Text/Rich Content** | Knowledge articles, resolutions, notes | "What's the known fix for this?" |
| 📜 **Logs** | Audit trails, activity history, changes | "Who touched this record?" |
| 🎥 **Video** | Training, incident recordings, demos | "Play the customer's screen share" |
| 🏢 **Org Charts** | Approvals, escalation paths, team structure | "Who's the approver for this?" |
| 📆 **Calendars** | Scheduling, availability, deadlines | "When can we schedule this?" |
| 📊 **Charts/Graphs** | Trends, metrics, KPIs | "Is this happening more often?" |
| 🔗 **Relationship Diagrams** | CMDB, dependencies, impact | "What depends on this CI?" |

**Design Principle:**
> **AI selects not just WHAT to show, but HOW to visualize it.** The medium adapts to the data and the conversation context.

**Examples in Action:**

| User Says | AI Visualization Choice |
|-----------|------------------------|
| "Where is the technician?" | 📍 Map with live location |
| "What's the history?" | 📅 Timeline view |
| "Who needs to approve?" | 🏢 Org chart with approval path |
| "Is this a trend?" | 📊 Line chart of incidents over time |
| "Show me the affected systems" | 🔗 CMDB relationship diagram |

**Implication for NEXUS:**
The "form" isn't a form — it's a **dynamic canvas** where AI composes the right visualization for the moment.

---

### 🚀 ADDITIONAL CONFIRMED DIMENSIONS

#### 1. Multi-Modal Input 🎤📷
| Input Mode | Use Case |
|------------|----------|
| **Voice** | Commands while viewing visual context |
| **Camera** | Scan barcode, photo of problem, document capture |
| **Touch/Gesture** | Drag to reassign, pinch to zoom timeline |

#### 2. Multi-Human + Multi-Agent Collaboration 👥🤖
| Scenario | Description |
|----------|-------------|
| **Multi-Human** | 2+ humans working on same record simultaneously |
| **Multi-Agent Personas** | Specialist agents ("Compliance Agent", "Technical Agent") |
| **Hand-off** | Context preserved when escalating |

#### 3. AI Memory, Personalization & Accessibility 🧠♿
| Capability | Example |
|------------|---------|
| **Preference Learning** | "You usually want timeline first — here it is" |
| **Accessibility Adaptation** | Screen reader, high contrast, reduced motion |
| **Cross-Session Memory** | Remembers past interactions |

#### 4. Proactive AI ⚡
| Pattern | Example |
|---------|---------|
| **Pattern Recognition** | "This looks like yesterday's incident — same fix?" |
| **Deadline Nudges** | "SLA breach in 2 hours — here's what we can do" |
| **Anomaly Detection** | "This approval seems unusual — want me to flag?" |

#### 5. Accessibility First ♿
| Principle | Implementation |
|-----------|----------------|
| **Screen Reader Compatible** | Dynamic canvas narrated meaningfully |
| **Voice-Only Mode** | Hands-free for field workers |
| **Customizable Density** | Compact vs. spacious layouts |

---

### ✅ Stage -5 Complete — Full Divergent Inventory

| # | Theme | Status |
|---|-------|--------|
| 1 | Industry Precedents | ✅ |
| 2 | 9+ Bold Ideas | ✅ |
| 3 | Three-Layer Model (NEXUS → Agent → SoR) | ✅ |
| 4 | Human Balance (Conversation + Visual) | ✅ |
| 5 | Dynamic Visualization Mediums (10+ types) | ✅ |
| 6 | Multi-Modal Input | ✅ |
| 7 | Multi-Human + Multi-Agent Collaboration | ✅ |
| 8 | AI Memory, Personalization, Accessibility | ✅ |
| 9 | Proactive AI | ✅ |
| 10 | Accessibility First | ✅ |

---

### 🧱 REFINED UX STACK (Post-Audit Consensus)

**User Insight:** It's not just about a "pulse" on a field. It's about **synchronized focus** and **modal trust.**

#### 1. Contextual Sync (The "Active Wave")
Instead of generic pulses, the visual pane should **surface what the AI is talking about.** If the AI mentions a knowledge article, that article becomes the "Hero" of the visual context pane. The human stays in lockstep with the AI's "gaze."

#### 2. Decision Mode (The Stage Gate)
When conversation reaches a commit point, the UI **transforms.**
- It ceases to be an open-ended "Chat."
- It becomes a focused **Decision Surface.**
- The "Proposed Delta" is large, clear, and takes center stage.
- Interaction shifts to strictly Approve/Edit/Reject.

#### 3. The Data Backdoor (Escape to Reality)
Trust requires a "verify" button.
- A toggle or secondary view that lets the human "look behind" the AI-curated UI.
- Displays raw record data in a simple, structured format (no AI polish).
- Ensures the human never feels like the AI is "hiding" the actual record state.

---

### ✅ REFINED SCOPE CONSENSUS (Stage -4)

**The Paradigm Shift:** We are killing the "Everything everywhere" form. If the AI is handling fields, they are removed from the human's primary view.

#### 1. The "UI Diet" (Ghost Fields & Chips)
- **Consensus:** **YES.** A human doesn't need to know what the AI is dealing with if it's not driving a decision. 
- **Implementation:** Visual pane only shows fields relevant to current intent. AI-handled fields are either hidden or minimized to "Chips" to reduce noise.

#### 2. Decision Mode (The Stage Gate)
- **Consensus:** **YES.** When conversation reaches a commit point, the UI transforms into a dedicated decision surface.

#### 3. The Data Backdoor (Verify then Trust)
- **Consensus:** **YES.** A secondary view to see the raw table state (audit view).

#### 4. Multi-Modal Intake (Voice Support)
- **Consensus:** **YES for v1.** Including STT (Speech-to-Text) for user intent and TTS (Text-to-Speech) for AI personality.
- **Goal:** Hands-free or "Eyes-on-Visuals" navigation where the human doesn't have to type to drive the workbench.

#### 5. Dynamic Mediums (Maps/Graph/Timeline)
- **Consensus:** **NO for v1.** Sticking to a single high-fidelity form-based companion initially.

#### 6. Mission Scope (Extensible Task Boundary)
- **Consensus:** **Single-Record Focus.** v1 will only represent one record type at a time (e.g., one Incident or one Case). No child records or multi-record orchestration in v1.
- **Architectural Mandate:** **Extensible for `TASK`.** The design must NOT be hardcoded to Incident. It must generically handle any table that extends from ServiceNow `TASK` (CSM, HR, Universal Tasks, etc.) by leveraging a common schema-driven pattern in NEXUS.

---

## Stage -4: Convergence & Scoping
**Status:** Complete ✅ | **Mode:** CONVERGENT 🎯

### Core Scope Definitions

| Feature | Description |
|---|---|
| **Decision-First Visuals** | UI Diet: Only show fields relevant to the current intent. |
| **Decision Mode** | UI transformation for pre-commit approval. |
| **Data Backdoor** | Raw record audit view. |
| **Schema-Extensible** | Design supports any ServiceNow `TASK` table extension. |
| **Three-Layer Logic** | NEXUS -> Agent -> SoR. |
| **Multi-Modal** | Voice support (STT/TTS) included in v1. |

---

---

## Stage -3: Analysis & Risk
**Status:** Complete ✅ | **Mode:** EVALUATIVE ⚖️

### 1. Three-Layer Model: Technical Guardrails

**Consensus Reached:**
- **NEXUS (UX)**: Speed is non-negotiable. Synchronization must be near-instant to maintain the "UI Diet" illusion.
- **AGENT (Logic)**: User over-reach/hallucination risk is mitigated by the **Decision Surface**. Every commit is a human-in-the-loop gate.
- **SoR (S-Now)**: Transactions follow standard DB patterns. Collisions return an error to the Agent, which then notifies the Human. S-Now remains the "Escape Hatch" for manual intervention.

| Layer | Responsibility | Mitigation Strategy |
|-------|----------------|---------------------|
| **NEXUS** | Speed & Visualization | High-frequency heartbeats / Checksum sync |
| **AGENT** | Intent & Governance | Decision Mode (Pre-commit verification) |
| **SoR** | Persistence & Audit | Transactional integrity / Manual escape hatch |

### 2. Context Sync: The "Filtered Focus" Pattern

**Consensus Reached:**
- **Filtering Approach**: The visual pane is a dynamic filter.
  - **Initial State**: Show 6 default "Anchor" fields (e.g., Short Description, Priority, Status, Category, Assignment Group, CI).
  - **Expansion**: As AI identifies relevant context, the filter expands to show those fields after a brief synchronization delay following the AI's response.
- **Visuals**: Keep the UI clean; no special AI-modification markers.
- **Commit Mode**: When deciding, only modified fields are shown for confirmation.

### 3. Decision Mode Stress Test

**Consensus Reached:**
- **Conversational Correction**: If a mass update is partially wrong, the human resolves it by talking to the AI.
- **Conversational Reversion**: "Undo" is handled via conversation and AI-driven resolution, not an automated transaction rollback.
- **Permanent Escape Hatch**: A persistent button with a dynamic URL allows the user to open the underlying ServiceNow record at any time.

| Scenario | UX Pattern | Strategy |
|----------|------------|----------|
| **Correction** | Conversation | "Wait, don't change the category." |
| **Undo** | Conversation | "Actually, put the assignment group back." |
| **Verification** | Persistent Button | [View in ServiceNow ↗] |

### 4. Risk Registry (v1 Focus)

| Risk ID | Description | Impact | Prob | Mitigation Strategy |
|---------|-------------|--------|------|--------------------|
| **R-SYNC-01** | **Visual Lag**: Pane doesn't update fast enough after AI response. | Med | High | Atomic State Checksums + CSS-driven visibility transitions. |
| **R-INTENT-02** | **Mapping Error**: AI maps "High" to a value that doesn't exist. | High | Med | Schema Validation Layer in Agent (Strict Choice Lists). |
| **R-GOV-03** | **Hallucination**: AI proposes a field update the user didn't want. | High | Low | **Gatekeeper Pattern**: Pre-commit Diff view highlights *everything* modified. |
| **R-SOB-04** | **Collision**: Background update in S-Now breaks Agent write. | Medium | Low | ServiceNow transactional error handling + Human notification. |

### 5. Technical Decisions (v1)

1. **Schema-First**: Define a `NEXUS-TASK` schema that maps generic terms to ServiceNow field IDs.
2. **Filtered View**: Visibility is a whitelist (Initial 6 -> Relevant -> Modified).
3. **Connectivity**: Use **Server-Sent Events (SSE)** for streaming Agent directives.
4. **State**: Maintain "Current State" and "Proposed Delta" in the NEXUS client.

## Stage -2: Define & Document
**Status:** Complete ✅ | **Mode:** DEFINITIONAL 🖋️

### 1. Methodology Selection
**Selected:** User Story Narrative & Functional Breakdown + HTML Static Wireframe.

### 2. User Stories

#### Story 1: The Urgent Escalation (2-Step Flow)
**Intent:** Elevate a low-priority incident to Critical.

| Step | Human Action | Agent Response | NEXUS Visual Reaction |
|---|---|---|---|
| 1 | "NEXUS, this is urgent. Gas leak." | "I understand. Escalating to Priority 1." | `Filter`: Show 'Safety Notes'. `Ghost`: Priority=1, Safety=Gas Leak. |
| 2 | "Confirm." | "Priority escalated." | `Action`: Pulse green and commit to SoR. |

#### Story 2: The Ambiguous Context (2-Step Flow)
**Intent:** Assign to the "right team" via chips.

| Step | Human Action | Agent Response | NEXUS Visual Reaction |
|---|---|---|---|
| 1 | "Assign to VPN team." | "Found two teams. Which one?" | `Expansion`: Show 'Network' and 'Connectivity' chips. |
| 2 | [User clicks 'Network'] | "Updating Group to Network." | `Ghost`: Assignment Group=Network. [Commit] button appears. |

#### Story 3: The Mass Update (2-Step Flow)
**Intent:** Resolve with 4+ fields.

| Step | Human Action | Agent Response | NEXUS Visual Reaction |
|---|---|---|---|
| 1 | "Fixed the VPN server by patch." | "Preparing resolution: Service=VPN, CI=LON-VPN-02, Status=Resolved." | `Expansion`: Reveal fields. `Ghost`: Populate all values. [Commit All] button appears in Visual Pane. |
| 2 | "Submit." | "Incident resolved." | `Action`: Final commit to ServiceNow. |

#### Story 4: The VIP Discovery (3-Step Lifecycle)
**Intent:** Progressive reveal of persona context before a change is proposed.

| Step | Human Action | Agent Response | NEXUS Visual Reaction |
|---|---|---|---|
| 1 | Load Incident. | "Looking at this for you..." | `Initial`: Show 6 anchors. |
| 2 | (None - AI Proactive) | "I see this issue is from **Mary Jones (EVP-Global Sales)**. Need to handle with care." | `Expansion`: Reveal 'Caller' field (7 fields total). No Ghost values yet. |
| 3 | "Let's escalate then." | "I agree. Setting Priority to High." | `Ghost`: Priority=High. [Commit] button appears. |

### 3. Visual Prototype
A static HTML wireframe has been created to demonstrate these interaction patterns.

**Artifact:** [wireframe.html](file:///Users/matthew.phipps/Documents/LEAP/1_LEAP/3_R&D_GoldSource/Discovery_Lab/DISCO-001_Extensible_AI_Form_Evolution/T-2_Design/wireframe.html)

**Key Demonstrations:**
- **Dynamic Filtering**: Watch fields reveal themselves only when the AI gains context.
- **Ghost Field State**: Visual distinction for "Proposed" but uncommitted AI values.
- **Decision Mode Transformation**: The UI shifting to a high-focus gate for the final commit.
- **ServiceNow Escape Hatch**: A persistent link to the underlying system of record.

### 5. Critical Analysis & Edge Cases

Final consensus on potential points of failure:

#### A. The "Mandatory Field" Traceability
*   **Consensus**: If the AI changes a field, it **must** be revealed to the human.
*   **Mitigation**: The Agent's `propose` directive must automatically include all fields being modified in the visibility whitelist. Mandatory fields required for `COMMIT` follow native ServiceNow server-side logic (transaction failure if missing).

#### B. Filtering vs. Additive Reveal
*   **Consensus**: The UI Diet is a **Filtering** process.
*   **Logic**: The visual companion starts with a narrow filter (6 anchors) and progressively "filters in" additional fields as context is gathered by the Agent. This ensures the human only ever sees the "Relevant Slice" of the record.

#### C. Validation Alignment
*   **Consensus**: Follow classical code validation patterns.
*   **Mitigation**: ghost values are validated client-side (Type check) and server-side (ServiceNow Data Policies) during the commit phase.

#### D. Context Switching (Out of Scope)
*   **Decision**: Ability to switch records mid-conversation is a **v2 requirement**. 
*   **Constraint**: For DISCO-001 (v1), the AI can only edit the record it is currently "anchored" to in the workspace.

---

---

## Stage -1: Functional Spec & Supporting Artifacts
**Status:** Complete ✅ | **Mode:** SPECIFICATION 📋

### Objectives
1.  **Draft Functional Specification**: Consolidate discovery into a formal engineering blueprint.
2.  **Define Platform Requirements**: Identify required ServiceNow APIs and Nexus integration points.
3.  **Data Model Finalization**: Define the JSON schema for state synchronization.

### 1. System Architecture: The Unified Directive Flow

The DISCO-001 pattern relies on a synchronized 4-layer architecture where the **Agent** orchestrates intent, and the **MCP Server** serializes those intents into platform-specific actions.

#### Communication Model
*   **Front-End**: Agent to NEXUS (Directives via SSE).
*   **Back-End**: Agent to ServiceNow (Standard MCP Protocol).
*   **Encapsulation**: UI directives are escaped within the conversational stream (e.g., `[[DIRECTIVE: ...]]`).

#### The Interaction Sequence
This diagram illustrates the **4-Layer "MCP-Enabled"** flow:

```text
  HUMAN (Worker)       NEXUS (UI Pane)        AGENT (AI)         MCP SERVER        SERVICE@NOW
      │                   │                   │                  │                  │
      │── Open Record ──▶ │                   │                  │                  │
      │                   │── Fetch Anchors ─▶│── get_record ───▶│── REST GET ─────▶│
      │                   │                   │                  │◀─ Record State ──│
      │◀─ Render 6 Fields │                   │◀─ state [JSON] ──│                  │
      │                   │                   │                  │                  │
      │── "Gas Leak!" ──▶ │──────────────────▶│                  │                  │
      │                   │                   │── Identify Intent│                  │
      │                   │◀─ [[DIRECTIVE]] ──│                  │                  │
      │                   │                   │                  │                  │
      │◀─ [Reveal & Ghost]│                   │                  │                  │
      │                   │                   │                  │                  │
      │── Click Approve ─▶│──────────────────▶│── update_record ─▶│── REST PUT ─────▶│
      │                   │                   │                  │◀── 200 OK ───────│
      │◀─ Pulse Success ──│                   │◀─ success ───────│                  │
```

---

### 2. Data Model: State & Directive Schema

The "Form Evolution" pattern requires a strict data contract between the Agent, NEXUS, and the MCP Server.

#### A. Record State (`RECORD_STATE`)
This is the baseline "Truth" fetched from ServiceNow via the MCP Server.
```json
{
  "sys_id": "INC0012345",
  "table": "incident",
  "fields": {
    "short_description": "Network connectivity issue...",
    "priority": "4 - Low",
    "state": "New",
    "caller_id": "Mary Jones",
    "assignment_group": "IT Support",
    "cmdb_ci": "Unknown CI"
  },
  "anchors": ["short_description", "priority", "state", "category", "assignment_group", "cmdb_ci"]
}
```

#### B. Directive Schema (`[[DIRECTIVE]]`)
Escaped JSON blocks sent in the AI stream to control NEXUS.

```json
{
  "type": "DIRECTIVE",
  "version": "1.0",
  "action": "propose",
  "payload": {
    "whitelist": ["u_safety_notes", "business_service"],
    "ghosts": {
      "priority": "1 - Critical",
      "u_safety_notes": "Gas leak detected at LON-DP-01."
    }
  }
}
```

#### C. Proposal State (`PROPOSAL_STATE`)
NEXUS merges the current `RECORD_STATE` with the incoming `DIRECTIVE` payload to render the evolution.

---

### 3. Platform Requirements: The MCP Toolset

To support the 4-layer architecture, the **MCP Server** must expose a standard set of capabilities to the Agent.

#### A. Core ServiceNow Tools
*   **`get_incident_context(sys_id)`**:
    *   *Purpose*: Initial load.
    *   *Payload*: Returns the 6 anchor fields + any non-empty mandatory fields.
*   **`update_incident(sys_id, fields)`**:
    *   *Purpose*: The Commit phase.
    *   *Payload*: JSON object of field-value pairs to be updated via REST Table API.
*   **`lookup_sys_user_group(query)`**:
    *   *Purpose*: Supporting Story 2 (Ambiguous Context).
    *   *Payload*: Returns list of groups with `sys_id` and name for chip rendering.
*   **`get_audit_history(sys_id)`**:
    *   *Purpose*: Contextual awareness for field expansion decisions.
    *   *Payload*: Returns a summary of recent field changes and authors.

#### B. Integration Constraints
1.  **Directives in Stream**: The Agent runtime must be configured to wrap JSON directives in `[[DIRECTIVE: ...]]` tags to prevent them from being spoken/displayed as plain text to the human.
2.  **REST Table API**: The MCP server will target the standard ServiceNow `/api/now/table/incident` endpoint for broad compatibility.
3.  **Authentication**: OAuth 2.0 or Basic Auth configured at the MCP server level; the Agent and NEXUS never see SoR credentials.

---

### 4. Visual Specification: NEXUS Workbench Reference (v2.0)

The [reference_workbench.html](file:///Users/matthew.phipps/Documents/LEAP/1_LEAP/3_R&D_GoldSource/Discovery_Lab/DISCO-001_Extensible_AI_Form_Evolution/T-1_Spec/reference_workbench.html) serves as the **GoldSource Standard** for the NEXUS presentation layer.

#### Design Principles
*   **Theme-Aware**: Light/Dark mode via `prefers-color-scheme`.
*   **Semantic HTML**: ARIA labels, proper heading hierarchy.
*   **BEM Naming**: CSS classes follow Block-Element-Modifier convention.
*   **No Demo Data**: Template ships clean, populated via JS API.

#### Layout Structure
```
┌─────────────────────────────────────────────────────────────────┐
│  TOP BAR: [ID] [Short Description]                         [×] │
│           [Status][P][I][U] | [Group] > [Assignee]             │
├──────────────────────────────┬──────────────────────────────────┤
│                              │ CONTEXT (Section Label)         │
│     • Now Assist             │   [Field Pills...]              │
│     CHAT STREAM              │ LOCATION (Hidden by default)    │
│                              │   [Field Pills...]              │
│                              │ DETAIL (Hidden by default)      │
│                              │   [Field Pills...]              │
│                              │ PROPOSAL (Hidden by default)    │
│                              │   [Ghost Pills...]              │
├──────────────────────────────┼──────────────────────────────────┤
│ [•] Now Assist [___input___] │        [Cancel] [Approve]       │
└──────────────────────────────┴──────────────────────────────────┘
```

#### CSS Architecture
| Token | Dark | Light |
|-------|------|-------|
| `--bg-deep` | `#050608` | `#f8fafc` |
| `--bg-glass` | `rgba(13,17,23,0.82)` | `rgba(255,255,255,0.85)` |
| `--emerald` | `#62d84e` | `#22c55e` |
| `--text-high` | `#ffffff` | `#0f172a` |

#### JavaScript API (`window.NEXUS`)
| Method | Description |
|--------|-------------|
| `openWorkbench(originX, originY)` | Opens with bloom animation from origin % |
| `closeWorkbench()` | Closes with reverse bloom animation |
| `setField(name, value)` | Populates `data-field` elements |
| `highlightField(name, bool)` | Toggles `.highlight` class |
| `renderSection(name, fields[])` | Renders dynamic pill grid |
| `showActionTray(bool)` | Shows/hides floating approval buttons |
| `addMessage(role, text)` | Appends chat message (`ai` or `human`) |

#### Animation Specifications
| Animation | Trigger | Duration | Easing |
|-----------|---------|----------|--------|
| **Bloom Open** | Click origin | 600ms | `spring` |
| **Bloom Close** | Close button | 500ms | `ease-out` |
| **Message In** | New message | 300ms | `ease-out` |
| **Pill In** | Field reveal | 300ms | `ease-out` |
| **Close Rotate** | Hover | 200ms | `spring` |

#### Close Button Behavior (GoldSource Standard)
1.  **Default**: Transparent with glass border
2.  **Hover**: Red glow, icon rotates 90°, scale 1.08
3.  **Active**: Scale 0.92 (press feedback)

---

## Stage 0: Validate (Lock) ✅

**Completed**: 2026-01-23

### Validation Checklist
| Check | Status |
|-------|--------|
| Reference HTML matches spec YAML | ✅ PASS |
| Theme tokens documented | ✅ PASS |
| JS API documented | ✅ PASS |
| Animation specs complete | ✅ PASS |
| Data binding map complete | ✅ PASS |
| Implementation checklist ready | ✅ PASS |
| Accessibility requirements documented | ✅ PASS |

### Locked Artifacts
- [SPEC-NEXUS-workbench.yaml](file:///Users/matthew.phipps/Documents/LEAP/1_LEAP/3_R&D_GoldSource/Discovery_Lab/DISCO-001_Extensible_AI_Form_Evolution/T-1_Spec/SPEC-NEXUS-workbench.yaml) (v2.0.0 - LOCKED)
- [reference_workbench.html](file:///Users/matthew.phipps/Documents/LEAP/1_LEAP/3_R&D_GoldSource/Discovery_Lab/DISCO-001_Extensible_AI_Form_Evolution/T-1_Spec/reference_workbench.html) (v2.0 - LOCKED)

### Discovery Closure
This discovery project has established the foundational specification for the NEXUS AI Workbench, a conversational interface for AI-native record editing in ServiceNow.

**Next Steps**: Create LEAP backlog item → Schedule build phase (Phase 31+)
