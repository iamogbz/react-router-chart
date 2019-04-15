const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
    mode: "production",
    entry: "./src",
    output: {
        filename: "main.js",
        path: path.resolve(__dirname, "lib"),
        libraryTarget: "commonjs-module",
    },
    plugins: [new CopyPlugin(["package.json"])],
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ["@babel/preset-env"],
                        plugins: ["babel-plugin-transform-class-properties"],
                    },
                },
            },
        ],
    },
    devtool: "source-map",
};
