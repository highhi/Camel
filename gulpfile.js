var gulp    = require( 'gulp' );
var sync    = require( 'browser-sync' );
var plumber = require( 'gulp-plumber' );
var rename  = require( 'gulp-rename' );
var uglify  = require( 'gulp-uglify' );

var DEV_JS_FILES = './test/camel.js';

gulp.task( 'js', function() {
    return gulp.src( DEV_JS_FILES )
        .pipe( plumber() )
        .pipe( gulp.dest( './' ) )
        .pipe( uglify() )
        .pipe( rename({ extname : '.min.js' }) )
        .pipe( gulp.dest( './' ) );
});

gulp.task('sync', function() {
    return sync.init( null, {
        server : {
            baseDir : './test'
        }
    });
});

gulp.task( 'reload', function() {
    return sync.reload();
});

gulp.task('watch', function() {
    gulp.watch( DEV_JS_FILES, ['js', 'reload'] );
});

gulp.task('default', [ 'sync', 'watch' ]);