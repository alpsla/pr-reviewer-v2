/**
 * Streamlined build-declarations script that uses less disk space
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Create basic empty declaration file
const createBasicDeclaration = () => {
  const distDir = path.join(__dirname, 'dist');
  
  // Ensure the dist directory exists
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }
  
  // Create a minimal declaration file
  const content = `
/**
 * PR Reviewer Core Library
 * Minimal declaration file (space-saving version)
 */

// Auth module
export * from './auth';

// VCS module
export * from './vcs';

// Repository module
export * from './repository';

// Utils
export * from './utils';
`;

  try {
    fs.writeFileSync(path.join(distDir, 'index.d.ts'), content);
    console.log('✅ Created minimal declaration file');
    return true;
  } catch (err) {
    console.error('❌ Failed to create declaration file:', err.message);
    return false;
  }
};

// Main function
const main = () => {
  try {
    console.log('🚀 Creating minimal declaration files to save space...');
    
    // Try to clean up first
    try {
      console.log('🧹 Cleaning up temporary files...');
      execSync('rm -rf node_modules/.cache');
      execSync('rm -rf .turbo');
      execSync('rm -rf coverage');
    } catch (err) {
      console.warn('⚠️ Cleanup warning:', err.message);
    }
    
    // Create basic declaration file
    const success = createBasicDeclaration();
    
    if (success) {
      console.log('🎉 Declaration file created successfully!');
    } else {
      console.error('❌ Failed to create declaration file');
      process.exit(1);
    }
  } catch (err) {
    console.error('❌ Error in build process:', err.message);
    process.exit(1);
  }
};

// Run the script
main();
