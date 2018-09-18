const path = require('path');
const webpack = require('webpack');
module.exports = {
    entry: {
        'ucupay-date-picker': './app/main.js'
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loaders: ['babel-loader']
            },
            {
                test: /\.hbs$/,
                loader: 'handlebars-loader'
            }
        ]
    },
    devtool:'source-map',
    watch: true,
    watchOptions: {
        ignored: /node_modules|dist|build|docs|css/,
        poll: 1000
    }
}
