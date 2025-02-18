const { override, disableEsLint, addWebpackPlugin } = require('customize-cra');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = override(
  disableEsLint(),
  (config) => {
    // Desabilita a minificação do Webpack
    config.optimization.minimizer = [new TerserPlugin({
      terserOptions: {
        compress: {
          drop_console: false, // Não remove os `console.log`
        },
      },
    })];

    return config;
  }
);
