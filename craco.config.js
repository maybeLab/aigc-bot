module.exports = {
    webpack: {
        configure: (webpackConfig, { env, paths }) => {
            if (env === 'production') {
                webpackConfig.output.publicPath = './';
            }
            return webpackConfig;
        },
    },
    style: {
        postcss: {
            // mode: 'file',
        },
    },
};