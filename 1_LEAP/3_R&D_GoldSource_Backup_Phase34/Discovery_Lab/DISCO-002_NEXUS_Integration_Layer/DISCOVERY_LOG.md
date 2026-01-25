# DISCO-002: NEXUS Integration Layer
## Discovery Log

**Created**: 2026-01-23
**Status**: In Progress (T-4 Consensus)
**Objective**: Define the SoR-agnostic integration layer that connects NEXUS to any backend system via adapters.

---

## Stage T-6: Vision ✅

**Completed**: 2026-01-23 (Retroactive)

### The Problem
NEXUS needs to communicate with Systems of Record (ServiceNow, Salesforce, etc.) bidirectionally:
- **Human → AI → SoR**: User asks questions, AI uses tools, SoR responds
- **SoR → Human**: Backend pushes updates, new work items, or notifications

### The Vision
A **SoR-agnostic integration layer** where:
- NEXUS speaks a **standard event language**
- **Adapters** translate between NEXUS events and SoR-specific APIs
- Swapping SoRs requires only a new adapter, not changes to NEXUS core

### Four Core Scenarios
| # | Direction | Trigger | Description |
|---|-----------|---------|-------------|
| 1 | Human → AI | User types | User initiates activity, NEXUS → AI → MCP → Response |
| 2 | Human → AI | User clicks card | Resume existing conversation with context |
| 3 | SoR → Human | New work | SoR pushes `activity.new` → Card appears on canvas |
| 4 | SoR → Human | Update | SoR pushes `activity.update` → Card updates/alerts |

---

## Stage T-5: Research ✅

**Completed**: 2026-01-23 (Retroactive)

### MCP Server Research

Two ServiceNow MCP implementations evaluated:

| Feature | `michaelbuckner/servicenow-mcp` | `echelon-ai-labs/servicenow-mcp` |
|---------|--------------------------------|-----------------------------------|
| Python Version | 3.8+ | 3.11+ |
| SSE Mode | ❌ | ✅ |
| Tool Packages | ❌ | ✅ Role-based |
| Incident CRUD | ✅ | ✅ |
| Natural Language | ✅ | ❌ |
| Change Management | ❌ | ✅ Full |
| Service Catalog | ❌ | ✅ |
| Knowledge Base | Basic | ✅ Full |

**Repos cloned to**: `1_LEAP/3_R&D_GoldSource/MCP_Research/`

### Key Insight
MCP servers run **locally** on developer machine, not hosted. They bridge AI clients to SoR backends.

---

## Stage T-4: Consensus 🔄

**In Progress**: 2026-01-23

### Architectural Decisions (Locked)

| Decision | Choice | Rationale |
|----------|--------|-----------|
| **SoR Coupling** | Agnostic | NEXUS doesn't know what SoR it's talking to |
| **Pattern** | Adapter | Each SoR has an adapter that translates events |
| **Activity Types** | Freeform string | Stay agnostic, adapter passes through |
| **Field Names** | Pass-through + displayLabel | SoR native name for writes, human label for UI |
| **Proposals** | Batch | User & AI negotiate in chat, batch approve |
| **Card Storage** | Firebase | NEXUS persists cards (design assumption) |
| **Conversation History** | With card in DB | Stored in NEXUS, not SoR |
| **Offline** | Fail | No offline mode |

### Architecture

```
┌───────────────────────────────────────────────────────────────┐
│                         NEXUS                                  │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │   CANVAS (Cards)  ← Firebase persistence                │  │
│  └─────────────────────────────────────────────────────────┘  │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │   WORKBENCH (Chat + Fields)  ← window.NEXUS API        │  │
│  └─────────────────────────────────────────────────────────┘  │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │   ORCHESTRATOR  ← Routes events, manages state          │  │
│  └──────────────────────┬──────────────────────────────────┘  │
└─────────────────────────│─────────────────────────────────────┘
                          │ Standard Events
         ┌────────────────┼────────────────┐
         ▼                ▼                ▼
   ┌──────────┐    ┌──────────┐    ┌──────────┐
   │ ServiceNow│    │Salesforce│    │ Custom  │
   │  Adapter │    │ Adapter  │    │ Adapter │
   └──────────┘    └──────────┘    └──────────┘
```

### Standard Event Types

| Event | Direction | Purpose |
|-------|-----------|---------|
| `activity.new` | SoR → NEXUS | New work item |
| `activity.update` | SoR → NEXUS | Existing item changed |
| `activity.open` | User → Orch | User clicks card |
| `intent.submit` | User → AI | User sends message |
| `field.propose` | AI → NEXUS | AI suggests changes (batch) |
| `field.commit` | User → SoR | User approves batch |
| `message.ai` | AI → NEXUS | AI chat message |
| `message.human` | NEXUS → AI | User chat message |

### Field Contract

```typescript
interface ActivityField {
  field: string;           // SoR native name
  displayLabel: string;    // Human readable
  value: string;           // Current value
  displayValue?: string;   // Formatted value
}

interface FieldProposal {
  field: string;
  displayLabel: string;
  currentValue?: string;
  proposedValue: string;
  proposedDisplayValue?: string;
  reason?: string;
}
```

---

## Stage T-3: Analysis & Risk
*Pending*

---

## Stage T-2: Define & Document
*Pending*

---

## Stage T-1: Functional Spec
*Pending*

---

## Stage T-0: Validate (Lock)
*Pending*
