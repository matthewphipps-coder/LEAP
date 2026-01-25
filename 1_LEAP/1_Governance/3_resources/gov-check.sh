#!/bin/bash

# =============================================================================
# LEAP GOVERNANCE CHECKER
# Purpose: Automated verification of GoldSource architectural rules.
# Usage: ./gov-check.sh
# =============================================================================

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

ERRORS=0

echo -e "${YELLOW}🔍 LEAP Governance Check: Initiating scan...${NC}"

# Directories to scan
SCAFFOLD="2_GoldSource/scaffold"

# Helper Functions
fail() {
    echo -e "${RED}❌ VIOLATION: $1${NC}"
    echo -e "   File: $2"
    echo -e "   Line: $3"
    ERRORS=$((ERRORS+1))
}

pass() {
    echo -e "${GREEN}✅ PASS: $1${NC}"
}

check_forbidden() {
    PATTERN=$1
    SEARCH_PATH=$2
    MESSAGE=$3
    EXCLUDE=$4
    
    # Find files matching the search path
    # We use grep directly on the directory structure
    
    echo -e "Checking for forbidden: ${YELLOW}$PATTERN${NC} in $SEARCH_PATH..."
    
    # Grep returns 0 if found (which is bad here), 1 if not found (good)
    # Use || true to prevent script exit if grep finds nothing (exit 1)
    RESULTS=$(grep -r -n "$PATTERN" $SEARCH_PATH --exclude="gov-check.sh" --exclude-dir=".git" || true)
    
    if [ ! -z "$RESULTS" ]; then
        echo "$RESULTS" | while read -r line ; do
            # Check exclusion if provided
            if [ ! -z "$EXCLUDE" ] && [[ "$line" == *"$EXCLUDE"* ]]; then
                continue
            fi
            
            FILE=$(echo "$line" | cut -d: -f1)
            LINENUM=$(echo "$line" | cut -d: -f2)
            CONTENT=$(echo "$line" | cut -d: -f3-)
            
            fail "$MESSAGE" "$FILE" "$CONTENT (Line $LINENUM)"
        done
    else
       pass "$MESSAGE (Clean)"
    fi
}

check_required() {
    PATTERN=$1
    SEARCH_PATH=$2
    MESSAGE=$3
    
    echo -e "Checking for required: ${YELLOW}$PATTERN${NC} in $SEARCH_PATH..."
    
    # Iterate files
    # Use || true regarding find
    find $SEARCH_PATH -name "*.js" 2>/dev/null | while read file; do
        if ! grep -q "$PATTERN" "$file"; then
            fail "$MESSAGE" "$file" "Missing pattern"
        fi
    done
}

# =============================================================================
# 1. ARCHITECTURE VIOLATIONS (Triad Pattern)
# =============================================================================

# Service Layer touching DOM
check_forbidden "document\.getElementById" "$SCAFFOLD/features" "Service layer accessing DOM directly"
check_forbidden "querySelector" "$SCAFFOLD/features" "Service layer accessing DOM directly"

# =============================================================================
# 2. CODING STANDARDS
# =============================================================================

# Inline Events
check_forbidden "onclick=" "$SCAFFOLD" "Inline event handler prohibited"
check_forbidden "onchange=" "$SCAFFOLD" "Inline event handler prohibited"

# CommonJS
check_forbidden "require(" "$SCAFFOLD" "CommonJS 'require' prohibited (Use ES Modules)"

# =============================================================================
# 3. PHASE 33 REGRESSIONS
# =============================================================================

# Imperative UI Updates (Unidirectional Flow Violation)
check_forbidden "sidebar\.update" "$SCAFFOLD" "Imperative UI update prohibited (Use state subscription)"
check_forbidden "header\.update" "$SCAFFOLD" "Imperative UI update prohibited (Use state subscription)"

# Init Race Conditions
check_forbidden "setTimeout" "$SCAFFOLD/core/app.js" "setTimeout in core init prohibited (Race condition risk)"

# =============================================================================
# 4. REQUIRED METADATA
# =============================================================================

# check_required "MODULE_CONTRACT" "$SCAFFOLD/features" "Missing MODULE_CONTRACT definition"
# check_required "registerStateSlice" "$SCAFFOLD/features" "Feature missing State Slice registration"

# =============================================================================
# SUMMARY
# =============================================================================

if [ $ERRORS -eq 0 ]; then
    echo -e "\n${GREEN}🎉 GOVERNANCE CHECK PASSED! code is compliant.${NC}"
    exit 0
else
    echo -e "\n${RED}🛑 GOVERNANCE CHECK FAILED with $ERRORS violations.${NC}"
    exit 1
fi
