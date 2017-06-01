const path = require("path");

const DotenvPlugin = require('webpack-dotenv-plugin');
const { CheckerPlugin } = require('awesome-typescript-loader');
module.exports = {
    entry: [
        "./src/index.tsx"
    ],

    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx']
    },
    devtool: process.env.WEBPACK_DEVTOOL || "source-map",

    output: {
        path: path.join(__dirname, "public", "build"),
        publicPath: "/build/",
        filename: "bundle.js"
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'awesome-typescript-loader'
            }
        ]
    },
    plugins: [
        new CheckerPlugin(),
        new DotenvPlugin({
            sample: './.env.sample',
            path: './.env'
        })
    ]
};
