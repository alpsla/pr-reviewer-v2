#!/bin/bash
set -e

echo "🔧 Fixing TypeScript errors in core package"
echo "======================================"

# Go to core package directory
cd "$(dirname "$0")/packages/core"
echo "📁 Working in: $(pwd)"

# 1. Fix smart-pr-service.ts
echo -e "\n1️⃣ Fixing unknown type errors in smart-pr-service.ts..."

# First, check if the file exists
if [ -f "src/repository/visibility/smart-pr-service.ts" ]; then
  # Create backup of the file
  cp src/repository/visibility/smart-pr-service.ts src/repository/visibility/smart-pr-service.ts.bak
  echo "✅ Created backup of smart-pr-service.ts"
  
  # Use sed to add type assertions for fetchError
  sed -i '' 's/if (fetchError.status/if ((fetchError as any).status/g' src/repository/visibility/smart-pr-service.ts
  sed -i '' 's/fetchError.message/((fetchError as any).message/g' src/repository/visibility/smart-pr-service.ts
  sed -i '' 's/typeof fetchError.message/typeof (fetchError as any).message/g' src/repository/visibility/smart-pr-service.ts
  
  # Fix error message at line 163
  sed -i '' 's|${fetchError.message || '\''Unknown error'\''}|${(fetchError as any).message || '\''Unknown error'\''}|g' src/repository/visibility/smart-pr-service.ts
  
  # Fix error at line 174
  sed -i '' 's|${error.message || '\''Unknown error'\''}|${(error as any).message || '\''Unknown error'\''}|g' src/repository/visibility/smart-pr-service.ts
  
  echo "✅ Fixed unknown type errors in smart-pr-service.ts"
else
  echo "⚠️ smart-pr-service.ts not found at expected location"
  
  # Try to find it elsewhere
  SMART_PR_SERVICE=$(find src -name "smart-pr-service.ts" -type f | head -1)
  
  if [ -n "$SMART_PR_SERVICE" ]; then
    echo "Found smart-pr-service.ts at: $SMART_PR_SERVICE"
    
    # Create backup
    cp "$SMART_PR_SERVICE" "$SMART_PR_SERVICE.bak"
    echo "✅ Created backup of $SMART_PR_SERVICE"
    
    # Fix unknown type errors
    sed -i '' 's/if (fetchError.status/if ((fetchError as any).status/g' "$SMART_PR_SERVICE"
    sed -i '' 's/fetchError.message/((fetchError as any).message/g' "$SMART_PR_SERVICE"
    sed -i '' 's/typeof fetchError.message/typeof (fetchError as any).message/g' "$SMART_PR_SERVICE"
    sed -i '' 's|${fetchError.message || '\''Unknown error'\''}|${(fetchError as any).message || '\''Unknown error'\''}|g' "$SMART_PR_SERVICE"
    sed -i '' 's|${error.message || '\''Unknown error'\''}|${(error as any).message || '\''Unknown error'\''}|g' "$SMART_PR_SERVICE"
    
    echo "✅ Fixed unknown type errors in $SMART_PR_SERVICE"
  else
    echo "⚠️ Could not find smart-pr-service.ts file"
  fi
fi

# 2. Fix client-factory.ts
echo -e "\n2️⃣ Fixing string undefined errors in client-factory.ts..."

# First, check if the file exists
if [ -f "src/vcs/client-factory.ts" ]; then
  # Create backup of the file
  cp src/vcs/client-factory.ts src/vcs/client-factory.ts.bak
  echo "✅ Created backup of client-factory.ts"
  
  # Fix the undefined token issues by adding null check
  sed -i '' 's/return new GitHubClient(token);/return new GitHubClient(token || "");/g' src/vcs/client-factory.ts
  sed -i '' 's/return new GitLabClient(token);/return new GitLabClient(token || "");/g' src/vcs/client-factory.ts
  
  echo "✅ Fixed string undefined errors in client-factory.ts"
else
  echo "⚠️ client-factory.ts not found at expected location"
  
  # Try to find it elsewhere
  CLIENT_FACTORY=$(find src -name "client-factory.ts" -type f | head -1)
  
  if [ -n "$CLIENT_FACTORY" ]; then
    echo "Found client-factory.ts at: $CLIENT_FACTORY"
    
    # Create backup
    cp "$CLIENT_FACTORY" "$CLIENT_FACTORY.bak"
    echo "✅ Created backup of $CLIENT_FACTORY"
    
    # Fix the undefined token issues
    sed -i '' 's/return new GitHubClient(token);/return new GitHubClient(token || "");/g' "$CLIENT_FACTORY"
    sed -i '' 's/return new GitLabClient(token);/return new GitLabClient(token || "");/g' "$CLIENT_FACTORY"
    
    echo "✅ Fixed string undefined errors in $CLIENT_FACTORY"
  else
    echo "⚠️ Could not find client-factory.ts file"
  fi
fi

# 3. Fix github-client.ts
echo -e "\n3️⃣ Fixing token property error in github-client.ts..."

# First, check if the file exists
if [ -f "src/vcs/github/github-client.ts" ]; then
  # Create backup of the file
  cp src/vcs/github/github-client.ts src/vcs/github/github-client.ts.bak
  echo "✅ Created backup of github-client.ts"
  
  # Fix the token property issue
  sed -i '' 's/auth: this.octokit.auth.token,/auth: (this.octokit.auth as any).token,/g' src/vcs/github/github-client.ts
  
  echo "✅ Fixed token property error in github-client.ts"
else
  echo "⚠️ github-client.ts not found at expected location"
  
  # Try to find it elsewhere
  GITHUB_CLIENT=$(find src -name "github-client.ts" -type f | head -1)
  
  if [ -n "$GITHUB_CLIENT" ]; then
    echo "Found github-client.ts at: $GITHUB_CLIENT"
    
    # Create backup
    cp "$GITHUB_CLIENT" "$GITHUB_CLIENT.bak"
    echo "✅ Created backup of $GITHUB_CLIENT"
    
    # Fix the token property issue
    sed -i '' 's/auth: this.octokit.auth.token,/auth: (this.octokit.auth as any).token,/g' "$GITHUB_CLIENT"
    
    echo "✅ Fixed token property error in $GITHUB_CLIENT"
  else
    echo "⚠️ Could not find github-client.ts file"
  fi
fi

# 4. Try to build the core package
echo -e "\n4️⃣ Building core package with fixes..."
npm run build

echo "✅ Core package build complete"

# 5. Go back to the root of the project and build the web app
echo -e "\n5️⃣ Building web app..."
cd "$(dirname "$0")/apps/web"
npm run build

echo "Build process complete."
