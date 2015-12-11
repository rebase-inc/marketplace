var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var config = require('./webpack.config');

const TARGET=process.env.REBASE_HOST || 'http://localhost:5000'
const PORT=process.env.PORT || 3000;

new WebpackDevServer(
    webpack(config), {
        publicPath: config.output.publicPath,
        hot: true,
        proxy: { '/api/*': { target:TARGET, secure: true } },
        historyApiFallback: true,
        stats: { colors: true }
    }).listen(PORT, 'localhost', function (err) {
        if (err) { console.log(err); }
        console.log('Listening at localhost:'+PORT);
        console.log('Remote backend:'+TARGET);
});
