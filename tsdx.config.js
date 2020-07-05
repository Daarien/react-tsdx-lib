// eslint-ignore
const images = require('rollup-plugin-image-files');

module.exports = {
  rollup(config, options) {
    config.plugins = [images({ incude: ['**/*.png', '**/*.svg'] }), ...config.plugins];

    return config;
  },
};
