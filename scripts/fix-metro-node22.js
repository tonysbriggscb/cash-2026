#!/usr/bin/env node

/**
 * Fix for Metro bundler compatibility with Node.js 22+
 * This script patches Metro packages to handle export issues with Node.js 22+
 */

const fs = require('fs');
const path = require('path');

// Fix 1: @expo/cli TerminalReporter import
const terminalReporterPath = path.join(__dirname, '..', 'node_modules', '@expo', 'cli', 'build', 'src', 'start', 'server', 'metro', 'TerminalReporter.js');

if (fs.existsSync(terminalReporterPath)) {
  let content = fs.readFileSync(terminalReporterPath, 'utf8');
  
  // Check if already patched
  if (!content.includes('Fix for Node.js 22+ compatibility')) {
    // Find and replace the problematic import
    const oldCode = `function _TerminalReporter() {
    const data = /*#__PURE__*/ _interop_require_default(require("metro/src/lib/TerminalReporter"));
    _TerminalReporter = function() {
        return data;
    };
    return data;
}`;

    const newCode = `function _TerminalReporter() {
    // Fix for Node.js 22+ compatibility with Metro bundler
    let data;
    try {
        data = /*#__PURE__*/ _interop_require_default(require("metro/src/lib/TerminalReporter"));
    } catch (error) {
        // Fallback for Node.js 22+ where Metro doesn't export TerminalReporter
        // Create a minimal TerminalReporter class that satisfies the interface
        class TerminalReporter {
            constructor(terminal) {
                this.terminal = terminal;
                this._bundleProgress = new Map();
            }
            update(event) {
                // Minimal implementation - just log important events
                if (event.type === 'bundle_build_failed' || event.type === 'bundling_error') {
                    console.error('[Metro]', event.message || event.error);
                }
            }
        }
        data = { default: TerminalReporter };
    }
    _TerminalReporter = function() {
        return data;
    };
    return data;
}`;

    content = content.replace(oldCode, newCode);
    fs.writeFileSync(terminalReporterPath, content);
    console.log('✅ Patched @expo/cli TerminalReporter for Node.js 22+');
  } else {
    console.log('✅ @expo/cli TerminalReporter already patched');
  }
} else {
  console.log('⚠️  @expo/cli not found, skipping TerminalReporter patch');
}

// Fix 2: Add exports to metro-cache package.json
const metroCachePackagePath = path.join(__dirname, '..', 'node_modules', 'metro-cache', 'package.json');

if (fs.existsSync(metroCachePackagePath)) {
  let packageJson = JSON.parse(fs.readFileSync(metroCachePackagePath, 'utf8'));
  
  // Check if exports field exists and needs updating
  if (!packageJson.exports || !packageJson.exports['./src/stores/FileStore']) {
    packageJson.exports = packageJson.exports || {};
    packageJson.exports['.'] = './src/index.js';
    packageJson.exports['./package.json'] = './package.json';
    packageJson.exports['./src/*'] = './src/*.js';
    packageJson.exports['./src/stores/*'] = './src/stores/*.js';
    
    fs.writeFileSync(metroCachePackagePath, JSON.stringify(packageJson, null, 2));
    console.log('✅ Patched metro-cache exports for Node.js 22+');
  } else {
    console.log('✅ metro-cache exports already patched');
  }
} else {
  console.log('⚠️  metro-cache not found, skipping exports patch');
}

// Fix 3: Patch main metro package exports - remove strict exports to allow any access
const metroPackagePath = path.join(__dirname, '..', 'node_modules', 'metro', 'package.json');

if (fs.existsSync(metroPackagePath)) {
  let packageJson = JSON.parse(fs.readFileSync(metroPackagePath, 'utf8'));
  
  // For Node.js 22+, we need to either remove exports field entirely or make it very permissive
  // Removing exports field allows access to any file in the package
  if (packageJson.exports && typeof packageJson.exports === 'object') {
    // Save original exports as backup
    packageJson._originalExports = packageJson.exports;
    // Remove exports to allow unrestricted access
    delete packageJson.exports;
    
    fs.writeFileSync(metroPackagePath, JSON.stringify(packageJson, null, 2));
    console.log('✅ Removed strict exports from metro for Node.js 22+ compatibility');
  } else if (!packageJson._originalExports) {
    console.log('✅ metro exports already fixed');
  }
} else {
  console.log('⚠️  metro not found, skipping exports patch');
}

// Fix 4: Remove strict exports from other Metro packages for Node.js 22+ compatibility
const metroPackages = [
  'metro-file-map',
  'metro-core',
  'metro-resolver',
  'metro-transform-worker',
  'metro-source-map',
  'metro-symbolicate',
  'metro-babel-transformer',
  'metro-config',
  'metro-runtime',
  'metro-cache-key'
];

metroPackages.forEach(packageName => {
  const packagePath = path.join(__dirname, '..', 'node_modules', packageName, 'package.json');
  
  if (fs.existsSync(packagePath)) {
    let packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    
    // Remove exports field if it exists to allow unrestricted access
    if (packageJson.exports && !packageJson._originalExports) {
      // Save original exports as backup
      packageJson._originalExports = packageJson.exports;
      // Remove exports to allow unrestricted access
      delete packageJson.exports;
      
      fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2));
      console.log(`✅ Removed strict exports from ${packageName} for Node.js 22+ compatibility`);
    }
  }
});

console.log('✅ Metro bundler fixes for Node.js 22+ completed');
