const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log("🔍 Fixing remaining type issues...");

// First, check if OAuthTokens is available in auth-service.ts
const authServicePath = path.join(__dirname, 'src', 'auth', 'auth-service.ts');
if (fs.existsSync(authServicePath)) {
  console.log("Checking auth-service.ts for OAuthTokens...");
  let authServiceContent = fs.readFileSync(authServicePath, 'utf8');
  
  // Check if OAuthTokens is defined
  if (!authServiceContent.includes('export type OAuthTokens')) {
    // If not found, let's add it to auth/types.ts instead
    console.log("OAuthTokens not found in auth-service.ts, adding to auth/types.ts...");
    const authTypesPath = path.join(__dirname, 'src', 'auth', 'types.ts');
    if (fs.existsSync(authTypesPath)) {
      let authTypesContent = fs.readFileSync(authTypesPath, 'utf8');
      
      // Add OAuthTokens if it doesn't exist
      if (!authTypesContent.includes('export type OAuthTokens') && 
          !authTypesContent.includes('export interface OAuthTokens')) {
        
        authTypesContent += `
/**
 * OAuth tokens structure
 */
export interface OAuthTokens {
  accessToken: string;
  refreshToken?: string;
  expiresIn?: number;
  expiresAt?: Date;
  tokenType?: string;
  scope?: string[];
}
`;
        fs.writeFileSync(authTypesPath, authTypesContent);
        console.log("✅ Added OAuthTokens to auth/types.ts");
        
        // Also update types/index.ts to import from the correct location
        const typesIndexPath = path.join(__dirname, 'src', 'types', 'index.ts');
        let typesIndexContent = fs.readFileSync(typesIndexPath, 'utf8');
        typesIndexContent = typesIndexContent.replace(
          /export type { OAuthTokens as TokenData } from '\.\.\/auth\/auth-service';/g,
          "export type { OAuthTokens as TokenData } from '../auth/types';"
        );
        fs.writeFileSync(typesIndexPath, typesIndexContent);
        console.log("✅ Updated TokenData import in types/index.ts");
      }
    }
  }
}

// Fix any missing VCS type exports
const vcsTypesPath = path.join(__dirname, 'src', 'vcs', 'types.ts');
if (fs.existsSync(vcsTypesPath)) {
  console.log("Checking vcs/types.ts for required types...");
  let vcsTypesContent = fs.readFileSync(vcsTypesPath, 'utf8');
  
  // Make sure VCSProvider exists (some errors reference it)
  if (!vcsTypesContent.includes('export type VCSProvider =') && 
      vcsTypesContent.includes('export type VCSPlatform =')) {
    console.log("Adding VCSProvider type alias to vcs/types.ts...");
    vcsTypesContent = vcsTypesContent.replace(
      /export type VCSPlatform = 'github' \| 'gitlab';/g,
      "export type VCSPlatform = 'github' | 'gitlab';\n\n// Alias for backward compatibility\nexport type VCSProvider = VCSPlatform;"
    );
    fs.writeFileSync(vcsTypesPath, vcsTypesContent);
    console.log("✅ Added VCSProvider type alias to vcs/types.ts");
  }
}

// Try running the build with our fixes
console.log("\n🏗️ Running build again with fixes...");
try {
  execSync('npm run build', { stdio: 'inherit' });
  console.log("✅ Build completed successfully!");
} catch (error) {
  console.error("❌ Build still has issues:", error.message);
  console.log("Please check the error messages and fix remaining issues manually.");
}
