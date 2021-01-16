import * as path from "path";
import * as nodeExternals from "webpack-node-externals";

module.exports = {
    mode: "production",
    entry: "./src",
    output: {
        filename: "main.js",
        path: path.resolve(__dirname, "lib"),
        libraryTarget: "commonjs-module",
    },
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
        extensions: [".js", ".ts", ".tsx"],
        modules: [path.resolve("./src"), path.resolve("./node_modules")],
    },
    externals: [nodeExternals()],
    devtool: "source-map",
};
