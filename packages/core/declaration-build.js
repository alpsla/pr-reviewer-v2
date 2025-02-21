const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

// Main function
async function main() {
  try {
    console.log('🔧 Starting declaration file generation...');
    
    // Clean output directory
    const distDir = path.resolve(__dirname, 'dist');
    if (!fs.existsSync(distDir)) {
      fs.mkdirSync(distDir, { recursive: true });
    }
    
    // Run TypeScript compiler for declarations only
    await new Promise((resolve, reject) => {
      console.log('Running tsc to generate declaration files...');
      exec('npx tsc --declaration --emitDeclarationOnly', (error, stdout, stderr) => {
        if (error) {
          console.error('Declaration generation failed:', stderr);
          reject(error);
          return;
        }
        
        console.log(stdout || '✅ Declaration files generated successfully!');
        resolve();
      });
    });
    
    console.log('🎉 Declaration build completed!');
  } catch (error) {
    console.error('❌ Declaration build failed:', error);
    process.exit(1);
  }
}

main();
