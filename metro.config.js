const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

// Exclude native-only files from web builds
config.resolver = {
  ...config.resolver,
  blockList: [
    ...(config.resolver?.blockList || []),
    // Exclude .native.* files when building for web
    /\.native\.(js|jsx|ts|tsx)$/,
  ],
  sourceExts: [...(config.resolver?.sourceExts || []), 'jsx', 'js', 'ts', 'tsx', 'json'],
};

module.exports = withNativeWind(config, { input: './global.css' });
