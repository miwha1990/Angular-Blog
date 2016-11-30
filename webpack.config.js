'use strict';

const NODE_ENV = process.env.NODE_ENV || 'development';
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var BrowserSyncPlugin = require('browser-sync-webpack-plugin');

module.exports = {
    entry: "./index.js",
    output: {
        filename: "build.js",
        library: "home",
        path: __dirname + '/assets',
        publicPath: "/assets/"
    },
    watch: NODE_ENV == 'development',
    watchOptions: {
        aggregateTimeout: 100
    },
    devtool: NODE_ENV == 'development' ? "cheap-inline-module-source-map" : null,
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel',
                exclude: /node_modules/,
                query: {
                    presets: ['es2015']
                }

            },
            {
                test: /\.html$/,
                loader: "html"
            },
            {
                test: /\.scss$/,
                loader: 'style!css!sass'
            },
            {   test: /\.css$/,
                loader: "style-loader!css-loader" },
            {
                test: /[\/\\]node_modules[\/\\]some-module[\/\\]index\.js$/,
                loader: "imports?define=>false"
            },
            {
                test: /\.styl$/,
                loader: 'style-loader!css-loader!stylus-loader'
            },
            {
                test: /\.(jpe?g|png|gif|svg)$/i,
                loaders: [
                    'file?hash=sha512&digest=hex&name=[hash].[ext]',
                    'image-webpack?bypassOnDebug&optimizationLevel=7&interlaced=false'
                ]
            },
            {
                // Load fonts, if file size is less than 10KB,
                // it will be converted and loaded as DataURI
                test: /\.((woff2?|svg)(\?v=[0-9]\.[0-9]\.[0-9]))|(woff2?|svg)$/,
                loader: "url?limit=10000"
            },
            {

                test: /\.((ttf|eot)(\?v=[0-9]\.[0-9]\.[0-9]))|(ttf|eot)$/,
                loader: "file"
            }

        ]

    },
    plugins: [
       new BrowserSyncPlugin(
            {
                host: 'localhost',
                port: 8000,
                proxy: 'localhost:3000'
            },
            {
                reload: true
            }
        ),
        new webpack.DefinePlugin({
            NODE_ENV: JSON.stringify(NODE_ENV)
        }),
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: 'jquery',
            'window.$': 'jquery',
            'window.jQuery': 'jquery'
        }),
        new HtmlWebpackPlugin({
            hash: true,
            filename: 'index.html',
            template: './index.html',
            ngApp: 'app',
            title: 'Angular + Webpack',
            mobile: true,
            favicon: 'favicon.ico',
            baseHref: '/',
            inject: false
        })

    ]

};


if (NODE_ENV == 'development') {
    console.log('CONSTRUCTION')
}
