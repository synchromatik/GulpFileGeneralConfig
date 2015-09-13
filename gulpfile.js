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


// Vars
var config = {
    bowerDir: './bower_components' , // base for bower packages
    professionalsAssets: './assets/build/professionals', // folder of built assets for professionals
    employersAssets: './assets/build/employers' // folder of built assets for professionals
}

// Gulp-sass task for Professionals  part
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


// configure the jshint task
// professionals
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

// Optimize images
gulp.task('images', function() {
  return gulp.src('assets/src/img/raw/**/*')
      .pipe(imagemin({
          optimizationLevel: 3,
          progressive: true,
          interlaced: true,
          svgoPlugins: [{removeViewBox: false}],
          use: [pngquant()]
     }))
    .pipe(gulp.dest('assets/build/img/optimized'));
    //.pipe(notify({ message: 'Images task complete' }));
});

// Gulp bundle vendor dependencies
// Js/Css files if we need it
// Employers
gulp.task('bundle-employers', function() {
  return gulp.src('employers.assets.config.js')
    .pipe(bundle())
    .pipe(gulp.dest(config.employersAssets + '/js/vendors-min/'));
});

// Professionals
gulp.task('bundle-professionals', function() {
  return gulp.src('professionals.assets.config.js')
    .pipe(bundle())
    .pipe(gulp.dest(config.professionalsAssets + '/js/vendors-min/'));
});

// Browser sync
gulp.task('browser-sync', function() {
    browserSync.init({
        proxy: "local.ivyexec.com"
    });
    gulp.watch("../view/**/*.phtml").on('change', browserSync.reload);
    gulp.watch("employers_assets/styles/scss/**/*.scss").on('change', browserSync.reload);
});

// Get font awesome icons from bower dir
gulp.task('get-fonts', function() { 
    return gulp.src(config.bowerDir + '/font-awesome-sass/assets/fonts/font-awesome/**.*') 
        .pipe(gulp.dest('./assets/src/fonts')); 
});

// Tasks
// cli: gulp watch
gulp.task('watch', function() {
    // Watch .scss files
    // Employers
    gulp.watch('assets/src/**/*.scss', ['styles']);
    gulp.watch('assets/src/**/*.js', ['jshint']);
    gulp.watch('assets/src/img/raw/**/*', ['images']);
    return gutil.log('Gulp is running!')
});


// cli: gulp
// Includes
// Styles, images, bundles
gulp.task('default', function() {
    gulp.start('styles', 'jshint', 'images');
});
