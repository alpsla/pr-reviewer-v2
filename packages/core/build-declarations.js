const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log("🚀 Building declaration files with relaxed settings...");

// Create temporary tsconfig for declarations
const tempTsconfig = {
  "extends": "./tsconfig.json",
  "compilerOptions": {
    // Relaxed settings for initial build
    "noImplicitAny": false,
    "strictNullChecks": false,
    "skipLibCheck": true,
    "strict": false,
    
    // Declaration settings
    "declaration": true,
    "emitDeclarationOnly": true,
    "outDir": "dist",
    
    // Ensure JSX is handled
    "jsx": "react-jsx"
  },
  "include": ["src/**/*.ts", "src/**/*.tsx"],
  "exclude": ["**/*.test.ts", "**/*.spec.ts", "**/*.test.tsx", "**/__mocks__/**"]
};

// Write temporary tsconfig
const tempTsconfigPath = path.join(__dirname, 'tsconfig.declarations.json');
fs.writeFileSync(
  tempTsconfigPath,
  JSON.stringify(tempTsconfig, null, 2)
);

try {
  // Run TypeScript compiler with relaxed settings
  console.log("Generating declaration files...");
  execSync('npx tsc -p tsconfig.declarations.json', 
    { stdio: 'inherit' }
  );
  
  console.log("✅ Declaration files generated successfully!");
} catch (error) {
  console.error("❌ Declaration generation failed:", error.message);
  process.exit(1);
} finally {
  // Clean up temporary config
  fs.unlinkSync(tempTsconfigPath);
}
