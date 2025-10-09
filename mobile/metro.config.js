const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

const config = getDefaultConfig(__dirname);

// Monorepo support - watch files outside of the mobile directory
const projectRoot = __dirname;
const monorepoRoot = path.resolve(projectRoot, "..");

config.watchFolders = [monorepoRoot];
config.resolver.platforms = ["ios", "android", "native", "web"];

// Ensure we resolve modules from the mobile directory first, then the monorepo root
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, "node_modules"),
  path.resolve(monorepoRoot, "node_modules"),
];

// Fix for CDS packages: skip react-native field which points to non-existent src files
config.resolver.resolverMainFields = ["browser", "main"];

// Add custom resolver to handle all CDS packages with type: "module" and broken exports
config.resolver.resolveRequest = (context, moduleName, platform) => {
  const fs = require('fs');
  
  // List of CDS packages that need custom resolution
  const cdsPackages = [
    '@coinbase/cds-mobile',
    '@coinbase/cds-common', 
    '@coinbase/cds-icons',
    '@coinbase/cds-illustrations',
    '@cbhq/cds-fonts'
  ];
  
  for (const cdsPackage of cdsPackages) {
    if (moduleName.startsWith(cdsPackage)) {
      // Handle main package import
      if (moduleName === cdsPackage) {
        const mainPath = path.resolve(monorepoRoot, `node_modules/${cdsPackage}/esm/index.js`);
        if (fs.existsSync(mainPath)) {
          return { filePath: mainPath, type: 'sourceFile' };
        }
      }
      
      // Handle subpath imports
      const subpath = moduleName.replace(cdsPackage + '/', '');
      const possiblePaths = [
        path.resolve(monorepoRoot, `node_modules/${cdsPackage}/esm/${subpath}.js`),
        path.resolve(monorepoRoot, `node_modules/${cdsPackage}/esm/${subpath}/index.js`),
        // Some packages might have different structure
        path.resolve(monorepoRoot, `node_modules/${cdsPackage}/${subpath}.js`),
        path.resolve(monorepoRoot, `node_modules/${cdsPackage}/${subpath}/index.js`),
      ];
      
      for (const filePath of possiblePaths) {
        if (fs.existsSync(filePath)) {
          return { filePath, type: 'sourceFile' };
        }
      }
    }
  }
  
  // Fall back to default resolver
  return context.resolveRequest(context, moduleName, platform);
};

// Work around Metro bundler issue with Node.js 22+
// Use a custom reporter to avoid the TerminalReporter import issue
if (process.version.startsWith("v22.") || process.version.startsWith("v21.")) {
  config.reporter = {
    update() {},
  };
}

module.exports = config;
