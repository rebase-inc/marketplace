var path = require('path');
var webpack = require('webpack');

module.exports = {
    entry: [
        './index' // entry js file for app
    ],
    output: {
        filename: 'bundle.js',
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': '"production"'
            }
        })
    ],
    resolve: {
        alias: {
            'react': path.join(__dirname, 'node_modules', 'react'),
        },
        extensions: ['', '.js']
    },
    resolveLoader: {
        'fallback': path.join(__dirname, 'node_modules')
    },
    module: {
        module: {
            noParse: [/autoit.js/],
        },
        loaders: [{
            test: /\.js$/,
            loaders: ['babel'],
            exclude: /node_modules/,
            include: __dirname
        }, {
            test: /\.js$/,
            loaders: ['babel'],
            include: path.join(__dirname, '..', '..', 'src')
        }, {
            test: /\.css?$/,
            loaders: ['style', 'raw'],
            include: __dirname
        }]
    }
};
