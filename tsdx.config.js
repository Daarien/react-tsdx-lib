const image = require('@rollup/plugin-image');

module.exports = {
  rollup(config, options) {
    config.plugins = [image({ incude: ['**/*.svg'] }), ...config.plugins];

    return config;
  },
};
