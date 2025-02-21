const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log("🚀 Building JavaScript using tsc (skipping type checking)...");

// Create temporary tsconfig for JS-only build
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

// Clean previous build
if (fs.existsSync(path.join(__dirname, 'dist'))) {
  console.log("🧹 Cleaning previous build...");
  fs.rmSync(path.join(__dirname, 'dist'), { recursive: true, force: true });
}

// Write temporary tsconfig
const tempTsconfigPath = path.join(__dirname, 'tsconfig.build.json');
fs.writeFileSync(
  tempTsconfigPath,
  JSON.stringify(tempTsconfig, null, 2)
);

try {
  // Build JS only with tsc
  console.log("📦 Building JavaScript files with tsc...");
  execSync('npx tsc -p tsconfig.build.json', { stdio: 'inherit' });
  
  // Create empty types file
  console.log("📝 Creating empty declaration file...");
  const emptyDtsContent = '// This is a temporary declaration file\nexport {};\n';
  
  fs.writeFileSync(
    path.join(__dirname, 'dist', 'index.d.ts'), 
    emptyDtsContent
  );
  
  console.log("✅ Build completed successfully!");
  console.log("⚠️ Note: This build includes only JavaScript files with placeholder type declarations.");
  console.log("   After fixing all type errors, run the full build command.");
  
} catch (error) {
  console.error("❌ Build failed:", error.message);
} finally {
  // Clean up temporary tsconfig
  if (fs.existsSync(tempTsconfigPath)) {
    fs.unlinkSync(tempTsconfigPath);
  }
}
