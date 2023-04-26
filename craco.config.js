const path = require("path");
const { InjectManifest } = require("workbox-webpack-plugin");
const { CracoAliasPlugin } = require("react-app-alias");

module.exports = {
  webpack: {
    configure: (webpackConfig, { env, paths }) => {
      webpackConfig.experiments = { topLevelAwait: true };
      webpackConfig.plugins.push(
        new InjectManifest({
          swSrc: path.join(__dirname, "./src/sw.ts"),
          swDest: "sw.js",
          include: [/\.(js|css)$/],
        })
      );
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
