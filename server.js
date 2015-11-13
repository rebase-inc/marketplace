var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var config = require('./webpack.config');

new WebpackDevServer(
    webpack(config), {
        publicPath: config.output.publicPath,
        hot: true,
        proxy: { '/api/*': { target: 'http://localhost:5000', secure: true } },
        historyApiFallback: true,
        stats: { colors: true }
    }).listen(3000, 'localhost', function (err) {
        if (err) { console.log(err); }
        console.log('Listening at localhost:3000');
});
