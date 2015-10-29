var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var config = require('./webpack.config');

new WebpackDevServer(
    webpack(config), {
        publicPath: config.output.publicPath,
        hot: true,
        // there is no way to do regex based proxying with webpack-dev-server.
        // It uses npm-http-proxy under the hood which only has two proxy url
        // route options, ignorePath and prependPath. Unfortunately, those only
        // refer to the entire path, so '/api/auth' maps to 'localhost:5000/api/auth'
        // and there is no way to have '/api/auth' map to 'localhost:5000/auth'
        // Also, the ignorePath and prependPath options don't even work unless
        // you set the ws (websocket) option to false, because Webpack manually
        // sets the ws option to true on proxies, which overrides the ignorePath
        // and prependPath variables (pretty sure that's a bug). So, for now,
        // you'll need to add any route you need in the api to the list of proxies
        // below. This could be solved by using a redirect in the Flask app, or
        // by using the Flask app as the main server and redirecting any non-api
        // requests to this development server. These proxies are placed here as
        // opposed to the webpack.config file in order to be more visible.
        proxy: {
            '/tickets*' : '127.0.0.1:5000',
            '/auctions*' : '127.0.0.1:5000',
            '/contracts*' : '127.0.0.1:5000',
            '/reviews*' : '127.0.0.1:5000',
            '/auth*' : '127.0.0.1:5000',
        },
        historyApiFallback: true,
        stats: { colors: true }
    }).listen(3000, 'localhost', function (err) {
        if (err) { console.log(err); }
        console.log('Listening at localhost:3000');
});
