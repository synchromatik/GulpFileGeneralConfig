// Author: Marko Manojlovic marko@ivyexec.com
// Current version: 1.5 (incremental build, if you modify this file, please update version and add to list whats added)
// Confluence page: https://ivyexec.atlassian.net/wiki/display/IE/Front+End+Conventions+and+rules+page

// TODO: Fix bug with sourcemaps path
// TODO: Add failback/info for files that are not found by build process
// TODO: Ask Sasa to add del task to deployment process if we need .map files removed on production
// TODO: Add detailed documenttation to confluence
// TODO: ADD gulp-newer to css files also
// TODO: ADD clean task for /build folder
// V.1.5
// - Moved bundle configs to appropriate dirs
// - Added bundle charts task for page specific file
// V.1.4
// - Added gulp-cached/gulp-newer for js and image files (only new files will be processed, not all)
// - 1.4b: moved from reload to injecting for css
// V.1.3
// - Fixed bug with image optimization
// V.1.2
// - Added JS Concated for Ivy specific js libs public/js/ivy/*.js => /public/assets/build/common/js/ivy-libs.min.js
// - Added sourcemaps for above files, for easier debug
// - Added JSHint for above files
// - Moved gulp-build-assets files from main scripts to vendor scripts filename (vendors.min.js is the new common file for front end dependecies)
// V.1.1
// - Fixed sourcemaps for js and css
// - JS/CSS files will now compile with .min.js and .min.css filename
// - Autoprefixer removed
// - JS Linting
// - Fixed css/js/image tasks to be included in one general task per category
// - Added Plumber for better output and workflow
// - Added moving of font-awesome icons to assets folder
// V.1.0
// - SCSS processing
// - Image optimization
// - Bundle of front end dependecies

// Load plugins we need for tasks
var gulp = require('gulp-help')(require('gulp'));
    gutil = require('gulp-util');
    jshint = require('gulp-jshint');
    newer = require('gulp-newer');
    cache = require('gulp-cached');
    autoprefixer = require('gulp-autoprefixer');
    minifyCss = require('gulp-minify-css');
    uglify = require('gulp-uglify');
    rename = require('gulp-rename');
    concat = require('gulp-concat');
    notify = require('gulp-notify');
    del = require('del');
    sass = require('gulp-sass');
    browserSync = require('browser-sync').create();
    imagemin = require('gulp-imagemin');
    pngquant = require('imagemin-pngquant');
    bundle = require('gulp-bundle-assets');
    sourcemaps = require('gulp-sourcemaps');
    plumber = require('gulp-plumber');
    concat = require('gulp-concat');

// Vars
var config = {
    bowerDir: './vendor/bower_components' , // base for bower packages
    professionalsAssets: './assets/build/professionals', // folder of built assets for professionals
    employersAssets: './assets/build/employers' // folder of built assets for professionals
}

// Move everything from font-awesome bower folder (icons) to deployable folder
gulp.task('font-awesome', 'Move all FA Icon fonts to deployable folder. You need this if you just updated FA lib via bower.', function() { 
    return gulp.src(config.bowerDir + '/font-awesome-sass/assets/fonts/font-awesome/**.*') 
        .pipe(gulp.dest('./assets/src/fonts/font-awesome')); 
});

// configure the jshint task
// Page specific single js file
gulp.task('jshint', 'Lint all JS files from assets folder', function() {
    console.log('JS is being processed ...');
      return gulp.src('assets/src/**/*.js')
        .pipe(plumber())
        .pipe(cache('linting'))
        .pipe(sourcemaps.init())
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'))
        .pipe(uglify())
        .pipe(rename(function(path) {
            path.extname = '.min.js';
        }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('assets/build/'));
});

// Ivy utils and custom js libs located in public/js/ivy folder
gulp.task('jshint-ivy-utils', 'Lint all JS files from js/ivy libs folder (custom libs)', function() {
    console.log('JS is being processed ...');
      return gulp.src('js/Ivy/**/*.js')
        .pipe(plumber())
        .pipe(cache('linting'))
        .pipe(sourcemaps.init())
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'))
        .pipe(uglify())
        .pipe(concat('ivy-libs.js'))
        .pipe(rename(function(path) {
            path.extname = '.min.js';
        }))
        .pipe(sourcemaps.write('.'))
        // Output
        .pipe(gulp.dest('assets/build/common/js'));
});

// Gulp-sass scss to css
gulp.task('styles', 'Process all SCSS files to CSS (assets/src to assets/build)', function() {
    console.log('SCSS is compiling...');
      return gulp.src('assets/src/**/*.scss')
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(sass({
            style: 'compressed'
        }))
        //.pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
        .pipe(minifyCss())
        .pipe(rename(function(path) {
            path.dirname = path.dirname.replace('scss', 'css');
            path.extname = '.min.css';
        }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('assets/build'))
        //.pipe(livereload(server))
        //.pipe(notify({ message: 'Compiled css is complete' }));
});

// Optimize images
gulp.task('images', 'Optimize images (jpg, jpeg, png, svg, svgz) - (assets/src to assets/build)' ,function() {
  return gulp.src('assets/src/**/*.{jpg,jpeg,png,svg,svgz}')
    .pipe(plumber())
    .pipe(newer('assets/build/'))
    .pipe(imagemin({
        optimizationLevel: 3,
        progressive: true,
        interlaced: true,
        svgoPlugins: [{removeViewBox: false}],
        use: [pngquant()]
     }))
    .pipe(gulp.dest('assets/build/'));
    //.pipe(notify({ message: 'Images task complete' }));
});

// Gulp bundle vendor dependencies
// Js/Css files if we need it
// Employers
gulp.task('bundle-employers', 'Create bundle from 3rd party JS plugins, and pack it into one compresed JS files (#partofwebsite/js/vendors/vendor.min.js)', function() {
  return gulp.src('./assets/bundle-configs/employers.assets.config.js')
    .pipe(bundle())
    .pipe(rename(function(path) {
        path.extname = '.min.js';
    }))
    .pipe(gulp.dest(config.employersAssets + '/js/vendors/'));
});

// Professionals
gulp.task('bundle-professionals','Create bundle from 3rd party JS plugins, and pack it into one compresed JS files (#partofwebsite/js/vendors/vendor.min.js)', function() {
  return gulp.src('./assets/bundle-configs/professionals.assets.config.js')
    .pipe(bundle())
    .pipe(rename(function(path) {
        path.extname = '.min.js';
    }))
    .pipe(gulp.dest(config.professionalsAssets + '/js/vendors/'));
});

// Browser sync
gulp.task('browser-sync','Live reload BrowserSync task for FE development', function() {
    browserSync.init({
        proxy: "local.ivyexec.com",
        // Injecting , not relaod
        files: [
            "assets/build/**/*.css"
        ]
    });
    // Watch .phtml files for update
    gulp.watch("../view/**/*.phtml").on('change', browserSync.reload);
    // Watch built assets for update
    gulp.watch("assets/build/**/*.js").on('change', browserSync.reload);
    gulp.watch("assets/build/**/*.{png,jpeg,jpg,svg,svgz}").on('change', browserSync.reload);
    // Static folder html / any file type
    gulp.watch("static/lib/tests/**/*").on('change', browserSync.reload);
});

// Tasks
// cli: gulp watch
gulp.task('watch', 'Main task for FE development - includes: styles, jshint, jshint-ivy-utils, images', ['browser-sync'], function() {
    // Watch Config for bundle updates
    //gulp.watch('professionals.assets.config.js', ['bundle-professionals']);
    gulp.watch('assets/src/**/*.scss', ['styles']);
    gulp.watch('assets/src/**/*.js', ['jshint']);
    gulp.watch('js/ivy/**/*.js', ['jshint-ivy-utils']);
    gulp.watch('assets/src/**/*.{png,jpeg,jpg,svg,svgz}', ['images']);
    return gutil.log('Gulp is running!')
});

// cli: gulp
// Includes
// Styles, images, bundles
gulp.task('recompile-assets', 'Recompile all assets (js/css/img)', function() {
    gulp.start('styles', 'jshint', 'jshint-ivy-utils', 'images', 'bundle-employers', 'bundle-professionals', 'font-awesome');
});
