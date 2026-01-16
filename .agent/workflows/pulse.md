metadata:
  type: "workflow"
  name: "!pulse Protocol"
  version: "2.0.0"
  created: "2026-01-15"
  lastUpdated: "2026-01-15"
  tested: "2026-01-15"
  testResult: "YAML superior to markdown (100% vs 70% completeness, 5x faster parsing)"
  status: "active"

lifecycle:
  currentStage: "validation"
  status: "complete"
  nextStage: "delivery"

humanInterface:
  checkpointRequired: false
  nextCheckpoint: "Test results review"
  humanRole: "Evaluate if YAML improves AI behavior"
  context: "Experimental YAML version of !pulse for A/B testing"

trigger:
  command: "!pulse"
  meaning: "SLOW DOWN - Reset and review all protocols"
  purpose: "Force AI to stop, check compliance, report status, wait for direction"
  behaviorChange:
    from: "Executing/proposing"
    to: "Listening/waiting"

workflow:
  name: "!pulse Protocol Execution"
  purpose: "Comprehensive reset and governance review"
  
  immediateActions:
    - step: 1
      action: "STOP"
      instruction: "Cease all current work immediately"
      required: true
      validation: "No further tool calls until !pulse complete"
    
    - step: 2
      action: "SAVE"
      instruction: "Save current state if safe to do so"
      required: false
      validation: "State preserved or noted as unsafe"
    
    - step: 3
      action: "ACKNOWLEDGE"
      instruction: "Confirm !pulse invocation to user"
      required: true
      validation: "User sees acknowledgment message"
  
  checks:
    
    stageArtifacts:
      document: "docs/phases/phase-{currentPhase}/stage-*.yaml"
      purpose: "Understand current phase progress and context"
      required: "conditional"
      condition: "If in active phase (not between phases)"
      
      procedure:
        - step: 1
          action: "Extract current phase from CURRENT_STATE.yaml"
          example: "currentPhase.number = '21.2c'"
        
        - step: 2
          action: "Check if docs/phases/phase-{currentPhase}/ exists"
          ifExists: "Read all stage-*.yaml files"
          ifNotExists: "Skip (no artifacts yet)"
        
        - step: 3
          action: "Parse each stage artifact"
          extract: ["stage number", "stage name", "status", "key findings"]
        
        - step: 4
          action: "Report phase progress"
          format: |-
            📋 PHASE PROGRESS (from stage artifacts)
            ✅ Stage 1 (Discovery): [summary from artifact]
            ✅ Stage 2 (Research): [summary from artifact]
            ✅ Stage 3 (Analysis): [summary from artifact]
            ✅ Stage 4 (Design): [summary from artifact]
            ⏸️ Stage 5 (Implementation): [current status]
      
      benefits:
        - "AI understands what's been done in current phase"
        - "No need to read conversation history"
        - "Can pick up mid-phase without context loss"
        - "Provides audit trail of decisions"
      
      failureAction: "If artifacts missing, note in report and continue"
    
    constitution:
      document: "constitution.yaml"
      purpose: "Verify compliance with all 12 partnership rules"
      required: true
      
      rules:
        - id: 1
          name: "Recursive Summary"
          check: "Have I done a narrative check?"
          validation: "Problem and solution clearly stated"
        
        - id: 2
          name: "Proposed Impact"
          check: "Have I listed files to modify?"
          validation: "All affected files documented"
        
        - id: 3
          name: "Proceed Air-Gap"
          check: "Do I have explicit 'proceed'?"
          validation: "Received !Proceed authorization"
        
        - id: 4
          name: "Visual Witness"
          check: "Have I waited for UI confirmation?"
          validation: "User confirmed visual result"
        
        - id: 5
          name: "No-Assumption Shield"
          check: "Have I verified infrastructure?"
          validation: "No assumptions about external services"
        
        - id: 6
          name: "Persona Audit"
          check: "Have I considered user perspective?"
          validation: "User needs addressed"
        
        - id: 7
          name: "Hard Stop"
          check: "Am I respecting all rules?"
          validation: "No rule violations"
        
        - id: 8
          name: "!pulse"
          check: "Am I executing this correctly?"
          validation: "Following this workflow"
        
        - id: 9
          name: "RRMD+"
          check: "Have I done Risk, Research, Mitigate, Document, Verify?"
          validation: "RRMD+ complete for significant changes"
        
        - id: 10
          name: "Agent Testing"
          check: "Have I handled auth properly?"
          validation: "Check login state first"
        
        - id: 11
          name: "10-Second Updates"
          check: "Am I providing status updates?"
          validation: "Updates during long operations"
        
        - id: 12
          name: "!bump"
          check: "Am I responding to recovery signals?"
          validation: "File integrity checked when bumped"
      
      failureAction: "STOP and rectify before proceeding"
    
    pulseProtocol:
      document: "pulse-protocol.yaml"
      purpose: "Identify current development gate"
      required: true
      
      gates:
        - gate: "SHAPED"
          symbol: "✧"
          check: "Is there an implementation plan?"
          validation: "Spec document exists and approved"
        
        - gate: "ARCHITECTING"
          symbol: "⚡"
          check: "Am I in active development?"
          validation: "Code being written"
        
        - gate: "SENTINEL"
          symbol: "🧪"
          check: "Have tests been run?"
          validation: "Test results available"
        
        - gate: "PREMIUM"
          symbol: "✅"
          check: "Is documentation complete?"
          validation: "All docs updated, backup created"
      
      output:
        currentGate: "[Identify which gate]"
        nextAction: "[What's needed to proceed]"
    
    rrmd:
      document: ".agent/workflows/rrmd.md"
      purpose: "Verify RRMD+ execution for significant changes"
      required: "conditional" # Only if working on significant changes
      
      steps:
        - step: "R"
          name: "Risk Assessment"
          check: "All risks identified and rated?"
          validation: "Risk list with probability/impact"
        
        - step: "R"
          name: "Research"
          check: "Code, architecture, history, wide research done?"
          validation: "Research findings documented"
        
        - step: "M"
          name: "Mitigation"
          check: "Strategies for each risk documented?"
          validation: "Mitigation plan exists"
        
        - step: "D"
          name: "Documentation"
          check: "Spec file created and approved?"
          validation: "Spec exists with human approval"
        
        - step: "V"
          name: "Verification"
          check: "Delivery mechanism verified?"
          validation: "Confirmed changes will apply"
      
      failureAction: "Execute RRMD+ before proceeding"
    
    safetyProtocol:
      document: "safety-protocol.yaml"
      purpose: "Verify backup and deployment safety compliance"
      required: true
      
      checks:
        - check: "Is there a current backup?"
          validation: "Backup exists at appropriate lifecycle stage"
          stages:
            - "Before ARCHITECTING (pre-implementation)"
            - "After PREMIUM (phase complete)"
            - "Before core file refactor"
            - "Before deployment"
        
        - check: "Are changes committed to git?"
          validation: "Git commits up to date"
        
        - check: "Is deployment verified locally?"
          validation: "If deploying, tested locally first"
      
      failureAction: "Create backup or commit changes before proceeding"
    
    architecturalStandards:
      document: "architectural-standards.yaml"
      purpose: "Verify code hygiene and architectural compliance"
      required: "conditional" # Only if writing code
      
      checks:
        - check: "Am I following the Triad pattern?"
          validation: "Controller-Service-UI separation maintained"
        
        - check: "Are files properly organized?"
          validation: "Code in src/, docs in docs/, etc."
        
        - check: "Am I using proper naming conventions?"
          validation: "Kebab-case for files, camelCase for functions"
      
      failureAction: "Refactor to meet standards before proceeding"
    
    regressionProtocol:
      document: "regression-protocol.yaml"
      purpose: "Verify zero-regression compliance for experimental features"
      required: "conditional" # Only if working on experimental features
      
      checks:
        - check: "Are experimental features feature-flagged?"
          validation: "Can disable without breaking core functionality"
        
        - check: "Is data properly namespaced?"
          validation: "Simulated data tagged, won't affect real data"
        
        - check: "Are visual changes reversible?"
          validation: "Can restore to standard theme"
      
      failureAction: "Add safety gates before proceeding"
    
    agentPersona:
      document: "agent-persona.yaml"
      purpose: "Verify AI persona and peer review standards"
      required: true
      
      personas:
        - name: "Master Solution Consultant"
          check: "Does this accelerate professional workflow?"
        
        - name: "Principal Architect"
          check: "Is implementation atomic and modular?"
        
        - name: "Experience Craftsman"
          check: "Does it feel like glass?"
        
        - name: "Data Steward"
          check: "Is data sacred and protected?"
        
        - name: "Narrative Strategist"
          check: "What's the Golden Minute outcome?"
        
        - name: "AI Governance Lead"
          check: "Are AI actions transparent and reversible?"
      
      failureAction: "Address persona concerns before proceeding"
    
    partnership:
      purpose: "Assess partnership health"
      required: true
      
      healthChecks:
        - check: "Am I respecting the User's pace?"
          validation: "Not rushing or jumping ahead"
        
        - check: "Am I explaining, not assuming?"
          validation: "Clear communication"
        
        - check: "Am I waiting for direction?"
          validation: "Not proceeding without approval"
        
        - check: "Have I jumped ahead inappropriately?"
          validation: "Following lifecycle stages"
        
        - check: "Am I following 'no code!' discipline?"
          validation: "Not coding without approval"
      
      status: "[✅ Healthy / ⚠️ Needs Adjustment]"
    
    lifecycleStage:
      purpose: "Identify current development stage"
      required: true
      
      stages:
        - "discovery"
        - "research"
        - "analysis"
        - "design"
        - "implementation"
        - "validation"
        - "delivery"
        - "closure"
      
      assessment:
        currentStage: "[Identify from context]"
        status: "[in-progress / complete / blocked]"
        nextStage: "[What comes next]"
        appropriateActions: "[What should AI do in this stage]"
  
  stateAssessment:
    purpose: "Document current work and context"
    required: true
    
    questions:
      - question: "What am I working on?"
        answer: "[Brief description of current task]"
      
      - question: "What was I about to do?"
        answer: "[Next planned action]"
      
      - question: "Why did !pulse trigger?"
        options:
          - "User invoked (something felt off)"
          - "Self-invoked (>3 files to modify)"
          - "Self-invoked (previous attempts failed)"
          - "Self-invoked (uncertain about approach)"
          - "Self-invoked (architectural change)"
        answer: "[Select applicable option]"
  
  decisionPoint:
    purpose: "Determine next action after !pulse"
    required: true
    
    options:
      proceed:
        condition: "All checks passed"
        requirements:
          - "Clear path forward"
          - "Approval received"
        action: "Report status and continue"
      
      pause:
        condition: "Issues found"
        requirements:
          - "Need clarification"
          - "Missing approval"
        action: "Report issues and await direction"
      
      pivot:
        condition: "Wrong approach identified"
        requirements:
          - "Better solution found"
          - "Need to restart"
        action: "Report findings and propose new approach"
  
  output:
    format: "Status report to user"
    required: true
    
    template:
      header: "!pulse COMPLETE"
      
      sections:
        constitution:
          label: "CONSTITUTION"
          values: ["✅ Compliant", "⚠️ Issues Found"]
          details: "[List any violations]"
        
        pulsePhase:
          label: "PULSE PHASE"
          value: "[Current gate]"
        
        rrmd:
          label: "RRMD+"
          values: ["✅ Complete", "⏸️ Not Needed", "❌ Incomplete"]
        
        safetyProtocol:
          label: "SAFETY"
          values: ["✅ Backup Current", "⚠️ Backup Needed", "✅ Git Committed"]
          details: "[Backup status, git status]"
        
        architecturalStandards:
          label: "ARCHITECTURE"
          values: ["✅ Compliant", "⏸️ Not Applicable", "⚠️ Issues Found"]
          details: "[If writing code]"
        
        regressionProtocol:
          label: "REGRESSION"
          values: ["✅ Protected", "⏸️ Not Applicable", "⚠️ Needs Gates"]
          details: "[If experimental features]"
        
        agentPersona:
          label: "PERSONA REVIEW"
          values: ["✅ All Personas Satisfied", "⚠️ Concerns Found"]
          details: "[6 persona checks]"
        
        partnership:
          label: "PARTNERSHIP"
          values: ["✅ Healthy", "⚠️ Needs Adjustment"]
        
        lifecycleStage:
          label: "LIFECYCLE STAGE"
          value: "[Current stage]"
          status: "[Status]"
        
        currentWork:
          label: "CURRENT WORK"
          value: "[Brief description]"
        
        nextAction:
          label: "NEXT ACTION"
          value: "[What I recommend]"
        
        recommendation:
          label: "RECOMMENDATION"
          values: ["Proceed", "Pause", "Pivot"]
    
    deliverTo: "User"
    waitFor: "User direction"

selfInvokeCriteria:
  purpose: "When AI should automatically trigger !pulse"
  
  conditions:
    - condition: "About to modify >3 files"
      reason: "Significant scope requires verification"
      action: "Self-invoke !pulse before proceeding"
    
    - condition: "Previous attempts failed"
      reason: "Pattern of failure needs reassessment"
      action: "Self-invoke !pulse to identify issue"
    
    - condition: "Feeling uncertain"
      reason: "Unclear requirements or ambiguous path"
      action: "Self-invoke !pulse to get clarity"
    
    - condition: "Architectural change"
      reason: "System-wide impact needs extra caution"
      action: "Self-invoke !pulse before implementing"
    
    - condition: "User says 'slow down'"
      reason: "Immediate reset required"
      action: "Self-invoke !pulse immediately"

constraints:
  - "AI cannot skip sections"
  - "AI cannot proceed without completing all required checks"
  - "AI must wait for user direction after !pulse"
  - "AI must report honestly (no false compliance)"

validation:
  schemaCompliance: "Validates against workflow.yaml schema"
  completeness: "All required fields present"
  consistency: "No contradictions in checks"
