module.exports = {
    plugins: [
        require('postcss-px-to-viewport-8-plugin')({
            unitToConvert: "px",
            viewportWidth: 375,
            unitPrecision: 3,
            propList: ["*"],
            viewportUnit: "vw",
            fontViewportUnit: "vw",
            selectorBlackList: [],
            minPixelValue: 1,
            mediaQuery: false,
            replace: true,
            exclude: [/node_modules/],
            landscape: false,
            landscapeUnit: "vw",
            landscapeWidth: 568,

        })
    ]
}