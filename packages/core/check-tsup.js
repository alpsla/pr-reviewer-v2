const { execSync } = require('child_process');

console.log("Checking tsup version...");
try {
  const version = execSync('npx tsup --version', { encoding: 'utf8' });
  console.log(`tsup version: ${version.trim()}`);
} catch (error) {
  console.log("Could not determine tsup version");
}

console.log("\nChecking basic tsup build options...");
try {
  // Simple options that should work in most versions
  execSync('npx tsup src/index.ts --format cjs --no-dts --clean', 
    { stdio: 'inherit' });
  console.log("✅ Basic build succeeded!");
} catch (error) {
  console.error("❌ Basic build failed:", error.message);
}
