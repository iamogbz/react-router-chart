import * as path from "path";
// eslint-disable-next-line import/no-extraneous-dependencies
import * as CopyPlugin from "copy-webpack-plugin";

module.exports = {
    mode: "production",
    entry: "./src",
    output: {
        filename: "main.js",
        path: path.resolve(__dirname, "lib"),
        libraryTarget: "commonjs-module",
    },
    plugins: [new CopyPlugin({ patterns: ["package.json"] })],
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: "babel-loader",
                    options: {
                        plugins: ["@babel/plugin-proposal-class-properties"],
                        presets: [
                            "@babel/preset-typescript",
                            "@babel/preset-react",
                        ],
                    },
                },
            },
        ],
    },
    resolve: {
        extensions: [".js", ".ts"],
        modules: [path.resolve("./src"), path.resolve("./node_modules")],
    },
    devtool: "source-map",
};
