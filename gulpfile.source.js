let wp_theme_directory = 'wp/wp-content/themes/${theme_name}/',
    js_build_directory = 'build/js/',
    scss_build_directory = 'build/scss/';


// Include Gulp & Tools We'll Use
const gulp = require('gulp'),
    $ = require('gulp-load-plugins')(),
    path = require('path'),
    sass = require('gulp-sass'),
    gutil = require('gulp-util'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    csso = require('gulp-csso'),
    stripDebug = require('gulp-strip-debug'),
    babel = require('gulp-babel')

    const AUTOPREFIXER_BROWSERS = [
      'ie > 9',
      'safari > 6',
      'iOS > 6',
      'Android > 4',
      'last 2 versions'
    ];

    var wp_definition = ['\/*!',
    	'Theme Name: ${theme_name}',
      'Theme URI: https://netyou.co.il',
    	'Description: A custom theme for wordpress for the ${theme_name} service',
    	'Version: 0.1.0',
    	'Author: NetYou',
      'License: Copyright',
      'Text Domain: ${theme_name}',
      'Domain Path: /languages',
    	'Author URI: http:\/\/netyou.co.il',
        '*\/',
    ''].join('\n');


    // CSS concat, auto-prefix and minify
    gulp.task('styles', function() {
      gulp.src([ scss_build_directory +'make.scss'])
        .pipe(sass().on('error', sass.logError))
        .pipe($.autoprefixer({ browsers: AUTOPREFIXER_BROWSERS }))
        .pipe(gulp.dest('.tmp/styles'))
        .pipe(rename("style.css"))
        .pipe(csso())
        .pipe($.header( wp_definition ))
        .pipe($.replace('../',''))
        .pipe( gulp.dest( wp_theme_directory ) )
        .pipe($.size({ title: 'style.css: ', gzip: true }));
    });

    // gulp.task('cleanscripts', function() {
    //
    //   // Remove all script files
    //   gulp.src([ wp_theme_directory + 'assets/js/dist/*.js' ], { read: false })
    //     .pipe(clean());
    // });
    //
    // gulp.task('cleanlibscripts', function() {
    //
    //   // Remove all script files
    //   gulp.src([ wp_theme_directory + 'assets/js/dist/libs/*.js' ], { read: false })
    //     .pipe(clean());
    // });

    // Runs cleanscripts before scripts
    gulp.task('scripts', function() {

      // Minify and copy all JavaScript (except vendor scripts)
      gulp.src([ js_build_directory + '*.js' ])
        .pipe(stripDebug())
        .pipe(babel({ presets: ['es2015'] }))
        .pipe(uglify())
        // .pipe(concat('script.min.js'))
        .pipe(gulp.dest( wp_theme_directory + 'assets/js/dist' ))
        .pipe($.size({ title: 'Javascript', gzip: true }));
    });

    gulp.task('libscripts', function() {

      // Minify and copy all JavaScript libraries
      gulp.src([ js_build_directory + 'libs/*.js' ])
        // .pipe(babel({ presets: ['es2015'] }))
        // .pipe(uglify())
        // .pipe(concat('script.min.js'))
        .pipe(gulp.dest( wp_theme_directory + 'assets/js/dist/libs' ))
        .pipe($.size({ title: 'Javascript External Libraries', gzip: true }));
    });

    // Rerun the task when a file changes
    gulp.task('watch', function() {
      gulp.watch([ js_build_directory + '*.js'], ['scripts']);
      gulp.watch([ wp_theme_directory +'*.php', scss_build_directory + '**/*.scss'], ['styles']);
    });

    // default gulp task
    gulp.task('default', ['styles', 'scripts', 'libscripts', 'watch']);
