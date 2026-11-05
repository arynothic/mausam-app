const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, "../..");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(projectRoot);

config.projectRoot = projectRoot;
config.watchFolders = [workspaceRoot];
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, "node_modules"),
  path.resolve(workspaceRoot, "node_modules"),
];
// pnpm nests deps under .pnpm; hierarchical lookup resolves peers (e.g. whatwg-fetch).
config.resolver.disableHierarchicalLookup = false;
config.resolver.extraNodeModules = {
  "@mausam/shared": path.resolve(workspaceRoot, "packages/shared"),
};

module.exports = config;
