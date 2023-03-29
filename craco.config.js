const { CracoAliasPlugin } = require("react-app-alias");

module.exports = {
  webpack: {
    configure: (webpackConfig, { env, paths }) => {
      webpackConfig.experiments = { topLevelAwait: true };
      if (env === "production") {
        webpackConfig.output.publicPath = "./";
      }
      return webpackConfig;
    },
  },
  style: {
    postcss: {
      // mode: 'file',
    },
  },
  plugins: [
    {
      plugin: CracoAliasPlugin,
      options: {},
    },
  ],
};
