var gulp = require("gulp");
var gutil = require("gulp-util");

var server     = require( 'gulp-develop-server' );
var livereload = require( 'gulp-livereload' );
var webpack = require("webpack");
var WebpackDevServer = require("webpack-dev-server");
var webpackConfig = require("./webpack.config.js");

var options = {
    path: './server/server.js'
};

var serverFiles = [
    './server/server.js',
    './server/components/!**!/!*.*',
];

gulp.task("webpack-dev-server", function(callback) {
    // modify some webpack config options
    var myConfig = Object.create(webpackConfig);
    myConfig.devtool = "eval";
    myConfig.debug = true;
    // Start a webpack-dev-server
    new WebpackDevServer(webpack(myConfig), {
        publicPath: myConfig.output.publicPath,
        stats: {
            colors: true
        }
    }).listen(3000, "localhost", function(err) {
        if (err) throw new gutil.PluginError("webpack-dev-server", err);
        gutil.log("[webpack-dev-server]", "http://localhost:3000");
    });
});

gulp.task("server:start", function(callback) {
    server.listen( options, livereload.listen );

    function restart( file ) {
        server.changed( function( error ) {
            if( ! error ) livereload.changed( file.path );
            else{console.log(error)}
        });
    }
    gulp.watch( serverFiles ).on( 'change', restart );

});

gulp.task('default', ['webpack-dev-server', 'server:start']);


