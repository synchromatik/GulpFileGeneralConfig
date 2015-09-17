// Author: Marko Manojlovic marko@ivyexec.com
// Current version: 1.3 (incremental build, if you modify this file, please update version and add to list whats added)

// TODO: Move bundle configs to better segmented dir
// TODO: Add failback/info for files that are not found by build process
// TODO: Ask Sasa to add del task to deployment process if we need .map files removed on production
// TODO: Add detailed documenttation to confluence
// TODO: ADD gulp-newer to js/css/images files also
// TODO: ADD clean task for /build folder
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

// Load plugins
var gulp = require('gulp');
    gutil = require('gulp-util');
    jshint = require('gulp-jshint');
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
    changed = require('gulp-changed');

// Vars
var config = {
    bowerDir: './vendor/bower_components' , // base for bower packages
    professionalsAssets: './assets/build/professionals', // folder of built assets for professionals
    employersAssets: './assets/build/employers' // folder of built assets for professionals
}

// Move everything from font-awesome bower folder (icons) to deployable folder
gulp.task('font-awesome', function() { 
    return gulp.src(config.bowerDir + '/font-awesome-sass/assets/fonts/font-awesome/**.*') 
        .pipe(gulp.dest('./assets/src/fonts/font-awesome')); 
});

// configure the jshint task
// Page specific single js file
gulp.task('jshint', function() {
    console.log('JS is being processed ...');
      return gulp.src('assets/src/**/*.js')
        .pipe(plumber())
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
gulp.task('jshint-ivy-utils', function() {
    console.log('JS is being processed ...');
      return gulp.src('js/ivy/**/*.js')
        .pipe(plumber())
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
gulp.task('styles', function() {
    console.log('SCSS is compiling...');
      return gulp.src('assets/src/**/*.scss')
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(sass({
            style: 'compressed',
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
        //.pipe(notify({ message: 'compiled css for Professionals is complete' }));
});

// Optimize images
gulp.task('images', function() {
  return gulp.src('assets/src/**/*.{jpg,jpeg,png,svg,svgz}')
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
gulp.task('bundle-employers', function() {
  return gulp.src('employers.assets.config.js')
    .pipe(bundle())
    .pipe(rename(function(path) {
        path.extname = '.min.js';
    }))
    .pipe(gulp.dest(config.employersAssets + '/js/vendors/'));
});

// Professionals
gulp.task('bundle-professionals', function() {
  return gulp.src('professionals.assets.config.js')
    .pipe(bundle())
    .pipe(rename(function(path) {
        path.extname = '.min.js';
    }))
    .pipe(gulp.dest(config.professionalsAssets + '/js/vendors/'));
});

// Browser sync
gulp.task('browser-sync', function() {
    browserSync.init({
        proxy: "local.ivyexec.com"
    });
    // Watch .phtml files for update
    gulp.watch("../view/**/*.phtml").on('change', browserSync.reload);
    // Watch built assets for update
    gulp.watch("assets/build/**/*.scss").on('change', browserSync.reload);
    gulp.watch("assets/build/**/*.js").on('change', browserSync.reload);
    gulp.watch("js/ivy/**/*.js").on('change', browserSync.reload);
    gulp.watch("assets/build/**/*.{png,jpeg,jpg,svg,svgz}").on('change', browserSync.reload);
    // Static folder html / any file type
    gulp.watch("static/lib/tests/**/*").on('change', browserSync.reload);
});

// Tasks
// cli: gulp watch
gulp.task('watch', ['browser-sync'], function() {
    // Watch Config for bundle updates
    //gulp.watch('professionals.assets.config.js', ['bundle-professionals']);
    gulp.watch('assets/src/**/*.scss', ['styles']);
    gulp.watch('assets/src/**/*.js', ['jshint']);
    gulp.watch('js/ivy/**/*.js', ['jshint-ivy-utils']);
    gulp.watch('assets/src/**/*.{png,jpeg,jpg,svg,svgz}', ['images']);
    gulp.watch('assets/src/**/*.{png,jpeg,jpg,svg,svgz}', ['images']);
    return gutil.log('Gulp is running!')
});

// cli: gulp
// Includes
// Styles, images, bundles
gulp.task('default', function() {
    gulp.start('styles', 'jshint', 'jshint-ivy-utils', 'images', 'bundle-employers', 'bundle-professionals', 'font-awesome');
});
