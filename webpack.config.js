const path = require("path");
const webpack = require("webpack");
const CleanPlugin = require("clean-webpack-plugin");
const TSLintPlugin = require("tslint-webpack-plugin");

module.exports = (env, argv) => {
    const pkg = require("./package.json");
    const NODE_ENV = argv.mode || "development";
    const VERSION  = process.env.VERSION || pkg.version;

    return {
        devtool: NODE_ENV === "development" ? "source-map" : false,
        entry: path.join(__dirname, "src", "index.ts"),
        module: {
            rules: [
                {
                    exclude: /node_modules/,
                    loader: "ts-loader",
                    test: /\.tsx?$/,
                },
            ],
        },
        output: {
            filename: "engine.js",
            library: "Engine",
            libraryTarget: "var",
            path: path.join(__dirname, "dist"),
        },
        plugins: [
            new CleanPlugin(),
            new webpack.DefinePlugin({
                NODE_ENV: JSON.stringify(NODE_ENV),
                VERSION: JSON.stringify(VERSION),
            }),
            new TSLintPlugin({
                files: ["./src/**/*.ts"],
            }),
        ],
        resolve: {
            extensions: [".tsx", ".ts", ".js"],
        },
    };
};
