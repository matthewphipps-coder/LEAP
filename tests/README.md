# LEAP Test Suite

**Status:** ✅ Auth tests ready  
**Framework:** Playwright  
**Coverage:** Login, Registration, Forgot Password, Validation

---

## Quick Start

### Run All Tests
```bash
npm test
```

### Run in Headed Mode (See Browser)
```bash
npm run test:headed
```

### Run Smoke Tests Only
```bash
npm run test:smoke
```

### Debug Mode (Step Through Tests)
```bash
npm run test:debug
```

### View Test Report
```bash
npm run test:report
```

---

## What's Tested

### ✅ Authentication Flows (17 tests)

**Login Page:**
- Page loads correctly with all elements
- Shows validation errors for empty fields
- Validates email domain (@servicenow.com only)
- Validates password length (6+ characters)
- Enter key submits form (both email & password fields)
- Button focus styling (purple glow, not pink)
- Version number displayed correctly

**Forgot Password:**
- Button exists and is clickable
- Requires email before sending reset

**Mode Switching:**
- Can switch between Login and Sign Up modes
- UI updates correctly when switching

**Accessibility:**
- Error messages are accessible
- Form fields have proper autocomplete
- Placeholder text is helpful

**Visual:**
- No console errors on load
- Stars animation displays

---

## Test Structure

```
tests/
└── e2e/
    └── auth.spec.js  ← Authentication tests (17 scenarios)
```

---

## Running Tests Locally

### Prerequisites
1. Server running on port 8001 (Playwright will start it automatically)

### Run Tests
```bash
npm test
```

**Expected Output:**
```
Running 17 tests in chromium

  ✓ login page loads correctly (543ms)
  ✓ shows validation error for empty fields (321ms)
  ✓ validates email domain (@servicenow.com only) (412ms)
  ...
  
  17 passed (8.3s)
```

---

## Debugging Failed Tests

### View HTML Report
```bash
npm run test:report
```

### Run in Debug Mode
```bash
npm run test:debug
```

---

## Current Test Status

**Last Updated:** 2026-01-12  
**Total Tests:** 17  
**Coverage:** Auth flows only

---

**Happy Testing!** 🧪✨
