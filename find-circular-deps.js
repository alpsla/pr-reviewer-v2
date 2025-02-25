#!/usr/bin/env node

/**
 * Script to identify potential circular dependencies in the TypeScript project
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const SRC_DIR = path.resolve(__dirname, 'packages/core/src');

// Map to track file dependencies
const dependencies = new Map();
// Set to track visited files during cycle detection
const visited = new Set();
// Set to track files in current recursion stack
const recursionStack = new Set();
// Array to store detected cycles
const cycles = [];

/**
 * Extract imports from a TypeScript file
 */
function extractImports(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const importRegex = /import\s+(?:(?:[\w*\s{},]*)\s+from\s+)?['"]([^'"]+)['"]/g;
    const imports = [];
    let match;
    
    while ((match = importRegex.exec(content)) !== null) {
      const importPath = match[1];
      if (!importPath.startsWith('.')) continue; // Skip external modules
      
      // Resolve relative import to absolute path
      const dir = path.dirname(filePath);
      let resolvedPath;
      
      // Try to resolve with different extensions
      for (const ext of ['.ts', '.tsx', '/index.ts', '/index.tsx']) {
        const potentialPath = path.resolve(dir, `${importPath}${ext}`);
        if (fs.existsSync(potentialPath)) {
          resolvedPath = potentialPath;
          break;
        }
      }
      
      if (resolvedPath && resolvedPath.startsWith(SRC_DIR)) {
        imports.push(resolvedPath);
      }
    }
    
    return imports;
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
    return [];
  }
}

/**
 * Build dependency graph for all TypeScript files
 */
function buildDependencyGraph() {
  // Get all TypeScript files
  const allFiles = execSync(`find ${SRC_DIR} -type f -name "*.ts" -o -name "*.tsx"`, { encoding: 'utf8' })
    .split('\n')
    .filter(Boolean);
  
  console.log(`Found ${allFiles.length} TypeScript files`);
  
  // Process each file
  allFiles.forEach(file => {
    const imports = extractImports(file);
    dependencies.set(file, imports);
  });
}

/**
 * Detect cycles using DFS
 */
function detectCycles(file, path = []) {
  if (recursionStack.has(file)) {
    // Found a cycle
    const cycleStart = path.findIndex(f => f === file);
    if (cycleStart !== -1) {
      const cycle = path.slice(cycleStart).concat(file);
      cycles.push(cycle);
    }
    return true;
  }
  
  if (visited.has(file)) return false;
  
  visited.add(file);
  recursionStack.add(file);
  path.push(file);
  
  const deps = dependencies.get(file) || [];
  for (const dep of deps) {
    if (detectCycles(dep, [...path])) {
      return true;
    }
  }
  
  recursionStack.delete(file);
  return false;
}

/**
 * Main function
 */
function main() {
  console.log('Building dependency graph...');
  buildDependencyGraph();
  
  console.log('Detecting circular dependencies...');
  for (const file of dependencies.keys()) {
    if (!visited.has(file)) {
      detectCycles(file);
    }
  }
  
  if (cycles.length > 0) {
    console.log(`\nFound ${cycles.length} circular dependencies:\n`);
    cycles.forEach((cycle, index) => {
      console.log(`Cycle #${index + 1}:`);
      cycle.forEach(file => {
        const relativePath = path.relative(SRC_DIR, file);
        console.log(`  - ${relativePath}`);
      });
      console.log('');
    });
  } else {
    console.log('\nNo circular dependencies found!');
  }
}

main();
