var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var config = require('./webpack.config');

// web_1 is a /etc/hosts entry pointing at a container hosting the backend (api).
// web_1 is setup by a link in <repos>/api/docker-compose.yml
const TARGET=process.env.REBASE_HOST || 'http://web_1:5000' || 'http://localhost:5000'
const PORT=process.env.PORT || 3000;

new WebpackDevServer(
    webpack(config), {
        publicPath: config.output.publicPath,
        hot: true,
        proxy: { '/api/*': { target:TARGET, secure: true } },
        historyApiFallback: true,
        stats: { colors: true }
    }).listen(PORT, function (err) {
        if (err) { console.log(err); }
        console.log('Listening at 0.0.0.0:'+PORT);
        console.log('Remote backend:'+TARGET);
});
