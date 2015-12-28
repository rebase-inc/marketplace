var path = require('path');
var webpack = require('webpack');

var HOST=process.env.WEBPACK_HOST
var PORT=process.env.WEBPACK_PORT
console.log('Webpack: http://'+HOST+':'+PORT);

module.exports = {
    devtool: 'eval',
    entry: [
        'webpack-dev-server/client?http://'+HOST+':'+PORT,
        'webpack/hot/only-dev-server',
        './index' // entry js file for app
    ],
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'bundle.js',
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.ProgressPlugin(function handler(percentage, msg) { console.log(msg); }),
    ],
    resolve: {
        alias: {
            'react': path.join(__dirname, 'node_modules', 'react'),
            'redux-devtools': path.join(__dirname, 'node_modules', 'redux-devtools'),
            'redux-devtools/lib': path.join(__dirname, 'node_modules', 'redux-devtools'),
        },
        extensions: ['', '.js']
    },
    resolveLoader: {
        'fallback': path.join(__dirname, 'node_modules')
    },
    module: {
        noParse: [/autoit.js/],
        loaders: [{
            test: /\.js$/,
            loaders: ['react-hot', 'babel'],
            exclude: /node_modules/,
            include: __dirname
        }, {
            test: /\.js$/,
            loaders: ['react-hot', 'babel'],
            include: path.join(__dirname, '..', '..', 'src')
        }, {
            test: /\.css?$/,
            loaders: ['style', 'raw'],
            include: __dirname
        }]
    }
};
