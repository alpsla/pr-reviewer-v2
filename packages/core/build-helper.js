const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log("🧩 PR Reviewer Build Helper");
console.log("---------------------------");
console.log("This script will try multiple build approaches to get a working build.");

// Clean previous build
if (fs.existsSync(path.join(__dirname, 'dist'))) {
  console.log("\n🧹 Cleaning previous build...");
  fs.rmSync(path.join(__dirname, 'dist'), { recursive: true, force: true });
}

// Try with tsup (basic options)
console.log("\n📦 Attempt 1: Building with tsup (basic options)...");
try {
  execSync('npx tsup src/index.ts --format cjs,esm --no-dts', { stdio: 'inherit' });
  createEmptyTypes();
  console.log("✅ tsup build succeeded!");
  process.exit(0);
} catch (error) {
  console.log("❌ tsup build failed, trying alternative approach...");
}

// Try with tsup (alternative options)
console.log("\n📦 Attempt 2: Building with tsup (alternative options)...");
try {
  execSync('npx tsup src/index.ts --format=cjs,esm --no-dts', { stdio: 'inherit' });
  createEmptyTypes();
  console.log("✅ Alternative tsup build succeeded!");
  process.exit(0);
} catch (error) {
  console.log("❌ Alternative tsup build failed, trying tsc...");
}

// Try with tsc
console.log("\n📦 Attempt 3: Building with tsc...");
const tempTsconfig = {
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "noEmit": false,
    "declaration": false,
    "emitDeclarationOnly": false, 
    "isolatedModules": false,
    "skipLibCheck": true,
    "target": "es2020",
    "module": "commonjs",
    "moduleResolution": "node",
    "outDir": "dist"
  }
};

// Write temporary tsconfig
const tempTsconfigPath = path.join(__dirname, 'tsconfig.build.json');
fs.writeFileSync(
  tempTsconfigPath,
  JSON.stringify(tempTsconfig, null, 2)
);

try {
  execSync('npx tsc -p tsconfig.build.json', { stdio: 'inherit' });
  createEmptyTypes();
  console.log("✅ tsc build succeeded!");
  process.exit(0);
} catch (error) {
  console.error("❌ All build approaches failed:", error.message);
  process.exit(1);
} finally {
  // Clean up temporary tsconfig
  if (fs.existsSync(tempTsconfigPath)) {
    fs.unlinkSync(tempTsconfigPath);
  }
}

// Helper function to create empty declaration files
function createEmptyTypes() {
  console.log("📝 Creating empty declaration files...");
  const emptyDtsContent = '// This is a temporary declaration file\nexport {};\n';
  
  // Ensure dist directory exists
  if (!fs.existsSync(path.join(__dirname, 'dist'))) {
    fs.mkdirSync(path.join(__dirname, 'dist'));
  }
  
  fs.writeFileSync(
    path.join(__dirname, 'dist', 'index.d.ts'), 
    emptyDtsContent
  );
  
  fs.writeFileSync(
    path.join(__dirname, 'dist', 'index.d.mts'), 
    emptyDtsContent
  );
  
  console.log("⚠️ Note: This build includes only JavaScript files with placeholder type declarations.");
  console.log("   After fixing all type errors, run the full build command.");
}
