const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configuration
const srcDir = path.resolve(__dirname, 'src');
const distDir = path.resolve(__dirname, 'dist');
const tsconfigPath = path.resolve(__dirname, 'tsconfig.json');

// Create temp tsconfig for declaration-only build
const createTempTsconfig = () => {
  console.log('Creating temporary declaration-only tsconfig...');
  
  const tsconfig = require(tsconfigPath);
  const declarationConfig = {
    ...tsconfig,
    compilerOptions: {
      ...tsconfig.compilerOptions,
      declaration: true,
      emitDeclarationOnly: true,
      outDir: distDir
    }
  };
  
  const tempPath = path.resolve(__dirname, 'tsconfig.declarations.json');
  fs.writeFileSync(tempPath, JSON.stringify(declarationConfig, null, 2));
  return tempPath;
};

// Run TypeScript compiler for declarations only
const buildDeclarations = (configPath) => {
  return new Promise((resolve, reject) => {
    console.log('Building declarations with tsc...');
    
    exec(`npx tsc -p ${configPath} --traceResolution`, (error, stdout, stderr) => {
      if (error) {
        console.error('Declaration build failed:');
        console.error(stderr);
        reject(error);
        return;
      }
      
      console.log(stdout);
      console.log('Declaration files built successfully!');
      resolve();
    });
  });
};

// Clean up temp files
const cleanup = (tempConfigPath) => {
  console.log('Cleaning up temporary files...');
  fs.unlinkSync(tempConfigPath);
};

// Main function
const main = async () => {
  try {
    // Make sure dist directory exists
    if (!fs.existsSync(distDir)) {
      fs.mkdirSync(distDir, { recursive: true });
    }
    
    // Create temp tsconfig
    const tempConfigPath = createTempTsconfig();
    
    // Build declarations
    await buildDeclarations(tempConfigPath);
    
    // Clean up
    cleanup(tempConfigPath);
    
    console.log('Declaration build completed successfully!');
  } catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
  }
};

main();
