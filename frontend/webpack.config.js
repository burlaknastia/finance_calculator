const webpack = require('webpack');
const path = require('path');

const config = {
    entry: './src/index.js',
    output: {
        filename: "[name].js",
        path: path.resolve(__dirname, "../server/static"),
        publicPath: "/static/"
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                use: 'babel-loader',
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            }
        ]
    },
    resolve: {
        extensions: ['.js', '.jsx'],
        modules: ["node_modules"]
    },
    devtool: 'inline-source-map',

    devServer: {
        hot: true,
        port: 8080
    }
};

module.exports = config;