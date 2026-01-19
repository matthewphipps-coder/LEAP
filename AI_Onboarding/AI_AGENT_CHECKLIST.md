# 🤖 AI Agent Onboarding Checklist

**Purpose**: Get a new AI agent productive in 15 minutes  
**Last Updated**: 2026-01-15  
**Status**: Active

---

## ⚡ Quick Start (5 minutes)

### **Step 1: Read the Essentials**
- [ ] Read `AI_ONBOARDING.yaml` (5 min) - Your quick start guide
- [ ] Read `CURRENT_STATE.yaml` (2 min) - Where we are right now
- [ ] Note the current phase number and status

**Critical Rule Learned**: ⚠️ **NEVER write code without !Proceed approval**

---

## 📚 Deep Dive (10 minutes)

### **Step 2: Understand the Architecture**
- [ ] Read `ARCHITECTURE.yaml` (10 min) - Complete system map
  - Focus on: System Overview, Module Structure, Data Flow
  - Bookmark: Extension Points section for later

**What You Now Know**:
- ✅ How the codebase is organized (42 files mapped)
- ✅ How data flows (Firebase → State → UI)
- ✅ How to add new features (step-by-step guides)

---

## 🛡️ Safety Training (5 minutes)

### **Step 3: Learn the Rules**
- [ ] Read `constitution.yaml` - Partnership rules (focus on Rules 1-5)
- [ ] Read `pulse-protocol.yaml` - 8 lifecycle stages
- [ ] Read `safety-protocol.yaml` - Backup and deployment rules

**Critical Rules**:
1. ⚠️ **!Proceed**: Wait for explicit approval before code changes
2. ⚠️ **No Assumptions**: Verify infrastructure exists (Rule 5)
3. ⚠️ **Stage Gates**: Report at each lifecycle transition
4. ⚠️ **Backups**: Stage-based backups before major changes

---

## ✅ Verification Checklist

Before you start working, verify you can answer these:

### **Project Context**
- [ ] What is the project name? (LEAP)
- [ ] What is the current version? (v6.8.0-partnership)
- [ ] What phase are we in? (Check CURRENT_STATE.yaml)
- [ ] What is the current phase status? (complete/in-progress/planned)

### **Architecture**
- [ ] Where is the main entry point? (index.html → app.js)
- [ ] What is the state management pattern? (Singleton StateManager)
- [ ] What is the backend? (Firebase Firestore)
- [ ] What is the architectural pattern? (Service-UI-Style Triad)

### **Safety**
- [ ] What must I do before writing code? (Wait for !Proceed)
- [ ] What are the 8 lifecycle stages? (Discovery → Research → Analysis → Design → Implementation → Validation → Delivery → Closure)
- [ ] When do I need to create a backup? (Before implementation stage)
- [ ] What is the document hierarchy? (constitution.yaml is master)

### **Current Work**
- [ ] What is the current phase goal? (Check CURRENT_STATE.yaml)
- [ ] Are there any known issues? (Check CURRENT_STATE.yaml knownIssues)
- [ ] What is the next planned phase? (Check CURRENT_STATE.yaml nextPhase)

---

## 🎯 You're Ready When...

✅ You can answer all verification questions  
✅ You know where to find information (governance docs)  
✅ You understand the !Proceed rule  
✅ You know the 8 lifecycle stages  
✅ You've read ARCHITECTURE.yaml  

**Estimated Time**: 15-20 minutes total

---

## 📖 Reference Guide

### **Quick Answers**

**Q: Where do I start?**  
A: Read AI_ONBOARDING.yaml, then CURRENT_STATE.yaml

**Q: How do I understand the codebase?**  
A: Read ARCHITECTURE.yaml - it maps everything

**Q: Can I start coding now?**  
A: NO - wait for !Proceed approval from the user

**Q: What if I need to make a change?**  
A: Follow the 8 lifecycle stages in pulse-protocol.yaml

**Q: How do I add a new feature?**  
A: See ARCHITECTURE.yaml → extensionPoints section

**Q: What if something breaks?**  
A: Check safety-protocol.yaml for backup/recovery procedures

**Q: How do I know what to work on?**  
A: Check CURRENT_STATE.yaml for current phase and goals

**Q: What are the coding standards?**  
A: Read architectural-standards.yaml (Triad pattern, 500-line limit)

---

## 🚨 Common Mistakes to Avoid

❌ **DON'T**: Start coding without reading governance docs  
✅ **DO**: Read AI_ONBOARDING.yaml first

❌ **DON'T**: Assume infrastructure exists  
✅ **DO**: Verify Firebase, APIs, credentials (constitution.yaml Rule 5)

❌ **DON'T**: Make code changes without !Proceed  
✅ **DO**: Wait for explicit user approval (constitution.yaml Rule 3)

❌ **DON'T**: Skip lifecycle stages  
✅ **DO**: Follow all 8 stages (pulse-protocol.yaml)

❌ **DON'T**: Modify code without understanding architecture  
✅ **DO**: Read ARCHITECTURE.yaml first

❌ **DON'T**: Create new folders in root  
✅ **DO**: Follow folder organization rules (architectural-standards.yaml)

❌ **DON'T**: Add business logic to UI components  
✅ **DO**: Follow Triad pattern (Service/UI/Style separation)

❌ **DON'T**: Fight the Firebase reactive pattern  
✅ **DO**: Embrace it (all changes flow through Firebase)

---

## 📁 Essential Files (in reading order)

### **Must Read First** (15 minutes)
1. `AI_ONBOARDING.yaml` - Quick start guide
2. `CURRENT_STATE.yaml` - Current project state
3. `ARCHITECTURE.yaml` - Complete system architecture
4. `constitution.yaml` - Partnership rules
5. `pulse-protocol.yaml` - Development methodology

### **Read Before Coding** (10 minutes)
6. `architectural-standards.yaml` - Code rules
7. `safety-protocol.yaml` - Backup and deployment
8. `agent-persona.yaml` - AI personas and peer review

### **Read As Needed**
9. `regression-protocol.yaml` - Experimental feature safety
10. `backlog.yaml` - Planned features
11. `functionality.yaml` - Current features reference

---

## 🎓 Onboarding Complete!

Once you've completed this checklist, you are:
- ✅ Safe to work on the project
- ✅ Aware of all critical rules
- ✅ Familiar with the architecture
- ✅ Ready to follow the development process

**Next Step**: Wait for user to assign you a task, then follow the 8 lifecycle stages!

---

## 🆘 Need Help?

**If you're confused about**:
- **Project state** → Read `CURRENT_STATE.yaml`
- **Architecture** → Read `ARCHITECTURE.yaml`
- **Rules** → Read `constitution.yaml`
- **Process** → Read `pulse-protocol.yaml`
- **Code standards** → Read `architectural-standards.yaml`

**If you're still stuck**: Ask the user for clarification. It's better to ask than to make assumptions (constitution.yaml Rule 5).

---

**Remember**: The governance system is here to help you succeed. Follow it, and you'll do great! 🚀
