#!/bin/bash

# Define colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Starting project cleanup...${NC}"

# 1. Create backup of root src directory
echo -e "${YELLOW}Creating backup of root src directory...${NC}"
if [ -d "src" ]; then
    mv src src.bak
    echo -e "${GREEN}✓ Backup created: src.bak${NC}"
fi

# 2. Clean up duplicate test directories
echo -e "${YELLOW}Cleaning up test directories...${NC}"
if [ -d "packages/core/src/__tests__" ]; then
    # Move tests to be co-located with their source files
    find packages/core/src/__tests__ -name "*.test.ts" -exec bash -c '
        filename=$(basename "$1")
        directory=$(dirname "$1")
        sourceFile=${filename%.test.ts}.ts
        sourceDir=$(find packages/core/src -name "$sourceFile" -not -path "*/node_modules/*" -exec dirname {} \;)
        if [ ! -z "$sourceDir" ]; then
            mkdir -p "$sourceDir/__tests__"
            mv "$1" "$sourceDir/__tests__/"
            echo -e "${GREEN}✓ Moved $filename to $sourceDir/__tests__${NC}"
        fi
    ' bash {} \;
    rm -rf packages/core/src/__tests__
fi

# 3. Clean up root configuration files
echo -e "${YELLOW}Organizing configuration files...${NC}"

# Create configs directory if it doesn't exist
mkdir -p configs

# Move configuration files to configs directory
for file in tsconfig.json tsup.config.ts jest.config.ts jest.setup.ts .eslintrc.json; do
    if [ -f "$file" ]; then
        cp "$file" "configs/$file"
        echo -e "${GREEN}✓ Copied $file to configs directory${NC}"
    fi
done

# 4. Update package.json files
echo -e "${YELLOW}Updating package.json files...${NC}"

# Root package.json updates
cat > package.json << 'EOL'
{
  "name": "pr-reviewer",
  "private": true,
  "scripts": {
    "build": "pnpm --filter './packages/**' build",
    "clean": "pnpm -r clean",
    "dev": "pnpm --filter web dev",
    "lint": "pnpm -r lint",
    "test": "pnpm -r test"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "typescript": "^5.0.0"
  }
}
EOL
echo -e "${GREEN}✓ Updated root package.json${NC}"

# 5. Clean up any leftover temporary files
echo -e "${YELLOW}Cleaning up temporary files...${NC}"
find . -name "*.bak" -type f -delete
find . -name ".DS_Store" -type f -delete
find . -name "*.log" -type f -delete
echo -e "${GREEN}✓ Temporary files cleaned${NC}"

# 6. Create new .gitignore
echo -e "${YELLOW}Updating .gitignore...${NC}"
cat > .gitignore << 'EOL'
# Dependencies
node_modules/
.pnpm-store/

# Build outputs
dist/
.next/
build/

# Environment
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*

# Testing
coverage/

# Temporary files
*.tmp
*.bak
EOL
echo -e "${GREEN}✓ Updated .gitignore${NC}"

echo -e "${GREEN}Project cleanup completed!${NC}"
echo -e "${YELLOW}Please review changes and commit if satisfied.${NC}"
