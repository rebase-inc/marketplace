var path = require('path');
var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');

// web_1 is a /etc/hosts entry pointing at a container hosting the backend (api).
// web_1 is setup by a link in <repos>/api/docker-compose.yml
const TARGET='http://web_1:5000' || 'http://localhost:5000'
const PORT=process.env.REBASE_CLIENT_PORT || 3000;

var config=require('./webpack.config');
var client=process.env.CLIENT
contentBasePath = path.join(__dirname, 'assets', client)

new WebpackDevServer(
    webpack(config), {
        contentBase: contentBasePath,
        compress: true,
        publicPath: config.output.publicPath,
        hot: true,
        proxy: { '/api/*': { target:TARGET, secure: true } },
        historyApiFallback: true,
        stats: { colors: true },
        watchOptions: {
            aggregateTimeout: 300,
            poll: 1000
        },
    }).listen(PORT, function (err) {
        if (err) { console.log(err); }
        console.log('Listening at 0.0.0.0:'+PORT);
        console.log('Remote backend:'+TARGET);
});
