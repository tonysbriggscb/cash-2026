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

// Work around Metro bundler issue with Node.js 22+
// Use a custom reporter to avoid the TerminalReporter import issue
if (process.version.startsWith("v22.") || process.version.startsWith("v21.")) {
  config.reporter = {
    update() {},
  };
}

module.exports = config;
