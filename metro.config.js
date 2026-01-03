const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = {
  transformer: {
    babelTransformerPath: require.resolve('react-native-sass-transformer'),
  },
  resolver: {
    sourceExts: ['js', 'jsx', 'ts', 'tsx', 'scss', 'sass', 'json'],
    assetExts: ['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg', 'ttf'],
  },
  assets: ['./node_modules/react-native-vector-icons/Fonts'],
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
