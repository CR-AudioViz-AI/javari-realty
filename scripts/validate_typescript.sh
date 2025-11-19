#!/bin/bash
# Pre-Push TypeScript Validation
# Run this before every git push to catch errors locally

echo "🔍 Running TypeScript validation..."

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if we're in a Next.js project
if [ ! -f "package.json" ]; then
    echo "${RED}❌ Not in a Next.js project directory${NC}"
    exit 1
fi

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "${YELLOW}📦 Installing dependencies...${NC}"
    npm install
fi

# Run TypeScript check
echo "Checking TypeScript..."
npx tsc --noEmit

TS_EXIT_CODE=$?

if [ $TS_EXIT_CODE -eq 0 ]; then
    echo "${GREEN}✅ TypeScript validation passed!${NC}"
    echo "Safe to push to GitHub."
    exit 0
else
    echo "${RED}❌ TypeScript errors found!${NC}"
    echo "Fix errors before pushing."
    echo ""
    echo "To see detailed errors, run: npx tsc --noEmit"
    exit 1
fi
