metadata:
  type: "workflow"
  name: "!pulse-quick Protocol"
  version: "1.0.0"
  created: "2026-01-16"
  status: "active"
  parent: "pulse.md (full pulse)"
  addedDate: "2026-01-16"
  source: "Phase 21.2c - GOV-002"

trigger:
  command: "!pulse-quick"
  meaning: "Quick sanity check - verify current state and compliance"
  purpose: "Fast governance check for routine transitions"
  duration: "~30 seconds"

whenToUse:
  recommended:
    - "Between phases (quick status check)"
    - "After small changes (verify still aligned)"
    - "Hourly sanity check during long work"
    - "Before asking user for next direction"
    - "Mid-phase progress check"
  
  notRecommended:
    - "First session of the day (use !pulse-full)"
    - "After long gap >1 week (use !pulse-full)"
    - "Before major architectural change (use !pulse-full)"
    - "When feeling lost or uncertain (use !pulse-full)"
    - "At phase boundaries (use !pulse-full)"

workflow:
  name: "Quick Pulse Execution"
  
  immediateActions:
    - step: 1
      action: "STOP"
      instruction: "Pause current work"
      required: true
    
    - step: 2
      action: "ACKNOWLEDGE"
      instruction: "Confirm !pulse-quick invocation"
      required: true
  
  checks:
    currentState:
      document: "CURRENT_STATE.yaml"
      purpose: "Verify where we are"
      required: true
      
      checks:
        - "What phase are we in?"
        - "What stage are we at?"
        - "What's the next action?"
        - "Any blockers?"
        - "Last backup date"
        - "Git status"
    
    constitution:
      document: "constitution.yaml"
      purpose: "Quick compliance check"
      required: true
      
      checks:
        - "Rule 3: Do I have !Proceed for pending file operations?"
        - "Rule 8: Should I invoke full !pulse?"
        - "Rule 9: Should I invoke RRMD+?"
        - "Rule 11: Am I providing status updates?"
    
    partnership:
      purpose: "Verify healthy collaboration"
      required: true
      
      checks:
        - "Am I waiting for direction?"
        - "Have I jumped ahead without approval?"
        - "Am I respecting user's pace?"
        - "Have I self-advanced stages?"
  
  output:
    format: "Brief status report"
    
    template: |-
      !pulse-quick COMPLETE
      
      📍 CURRENT STATE
      Phase: [phase]
      Stage: [stage]
      Status: [status]
      
      ✅ COMPLIANCE
      - Rule 3 (Proceed): [status]
      - Rule 8 (pulse): [status]
      - Rule 9 (RRMD+): [status]
      - Partnership: [healthy/needs adjustment]
      
      🎯 NEXT ACTION
      [What I recommend or what I'm waiting for]
      
      Ready for direction.

comparison:
  pulseQuick:
    duration: "~30 seconds"
    files: "2 (CURRENT_STATE.yaml, constitution.yaml)"
    checks: "3 (current state, constitution quick check, partnership)"
    use: "Frequent sanity checks, mid-phase progress"
    when: "Routine work, small changes, progress updates"
  
  pulseFull:
    duration: "~3-4 minutes"
    files: "9 (all 7 governance + CURRENT_STATE + ARCHITECTURE + stage artifacts)"
    checks: "8 (constitution, pulse, safety, architecture, regression, persona, state, artifacts)"
    use: "Major transitions, onboarding, recovery, phase boundaries"
    when: "First session, after gaps, before major changes, feeling uncertain"

benefits:
  - "Fast context check without full governance review"
  - "Doesn't interrupt flow (30 seconds vs 3-4 minutes)"
  - "Catches common issues (missing !Proceed, self-advancement)"
  - "Provides quick status update to user"
  - "Can be invoked frequently without overhead"

limitations:
  - "Doesn't check all governance files (safety, architectural, regression, persona)"
  - "Doesn't read ARCHITECTURE.yaml or stage artifacts"
  - "Not suitable for major transitions or uncertainty"
  - "Use full !pulse for comprehensive review"

recommendation:
  rule: "When in doubt, use full !pulse"
  guideline: "Quick pulse for routine checks, full pulse for important moments"
