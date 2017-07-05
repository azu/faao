const path = require('path');
const webpack = require('webpack');
const distDir = path.join(__dirname, "public", "build");
const BabiliPlugin = require("babili-webpack-plugin");
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
module.exports = {
    entry: {
        'dll': Object.keys(require('./package.json').dependencies).filter((path) => {
            const whitelistModules = [
                /electron-navigation/
            ];
            const blacklistModules = [
                /^@types/,
                /electron/,
                /react-octicons/
            ];
            if (whitelistModules.some(pattern => pattern.test(path))) {
                return true;
            }
            return !blacklistModules.some(pattern => pattern.test(path));
        })
    },
    node: {
        fs: "empty"
    },
    output: {
        path: distDir,
        publicPath: "/build/",
        filename: '[name].js',
        library: '[name]',
        libraryTarget: 'var'
    },

    resolve: {
        extensions: ['.js']
    },

    devtool: process.env.WEBPACK_DEVTOOL || "source-map",

    plugins: [
        // remove unused locale
        // http://qiita.com/jimbo/items/95da1c223ad25a33ed16
        // https://github.com/moment/moment/issues/1435#issuecomment-187100876
        new webpack.ContextReplacementPlugin(/moment[\\\/]locale$/, /^\.\/(ja)$/),
        new webpack.DllPlugin({
            path: path.join(distDir, `dll.manifest.${process.env.NODE_ENV !== "production" ? 'dev' : 'prod'}.json`),
            name: '[name]',
            context: __dirname
        }),
    ].concat(process.env.NODE_ENV !== "production" ? [] : [
        new BabiliPlugin()
    ]).concat(process.env.WEBPACK_ANALYZE === undefined ? [] : [
        new BundleAnalyzerPlugin({
            analyzerMode: 'static',
            reportFilename: 'output/dll.report.html',
        })
    ])
};