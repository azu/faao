const path = require("path");
const webpack = require("webpack");
const { CheckerPlugin } = require('awesome-typescript-loader');
const WebpackBuildDllPlugin = require('webpack-build-dll-plugin');
const distDir = path.join(__dirname, "public", "build");
module.exports = {
    entry: [
        "./src/index.tsx"
    ],

    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx']
    },
    devtool: process.env.WEBPACK_DEVTOOL || "source-map",

    output: {
        path: distDir,
        publicPath: "/build/",
        filename: "bundle.js"
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'awesome-typescript-loader',
                options: {
                    useCache: true
                }
            }
        ]
    },
    plugins: [
        new CheckerPlugin(),
        // Add plugin BuildPlugin before your DllReference plugin.
        new WebpackBuildDllPlugin({
            // dllConfigPath: required, your Dll Config Path, support absolute path.
            dllConfigPath: './webpack.dll.config.js',
            // forceBuild: default is {false}, when dependencies change, will rebuild DllReference files
            // if {true} it will build DllReference in once upon starting Webpack.
            forceBuild: true
        }),
        new webpack.DllReferencePlugin({
            context: __dirname,
            manifest: path.join(distDir, `dll.manifest.${process.env.NODE_ENV !== "production" ? 'dev' : 'prod'}.json`)
        }),
        new webpack.DefinePlugin({
            "process.env": {
                NODE_ENV: JSON.stringify(process.env.NODE_ENV),
                // "browser", "electron"
                RUNTIME_TARGET: JSON.stringify(process.env.RUNTIME_TARGET)
            }
        })
    ]
};
