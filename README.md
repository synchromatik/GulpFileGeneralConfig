# Gulp file with general tasks


Gulp config for everyday usage.

Features:
1) SCSS to CSS processing with mirror dir copy "assets/src" to "assets/build"
2) JS Linting
3) Image (PNG, JPEG, SVG) Optimization
4) BrowserSync
5) JS/CSS Minification/ugliify with .min added to file names

### Changelog:

#### V.1.3
- Fixed bug with image optimization
#### V.1.2
- Added JS Concated for Ivy specific js libs public/js/ivy/*.js => /public/assets/build/common/js/ivy-libs.min.js
- Added sourcemaps for above files, for easier debug
- Added JSHint for above files
- Moved gulp-build-assets files from main scripts to vendor scripts filename (vendors.min.js is the new common file for front end dependecies)
#### V.1.1
- Fixed sourcemaps for js and css
- JS/CSS files will now compile with .min.js and .min.css filename
- Autoprefixer removed
- JS Linting
- Fixed css/js/image tasks to be included in one general task per category
- Added Plumber for better output and workflow
- Added moving of font-awesome icons to assets folder
#### V.1.0
- SCSS processing
- Image optimization
- Bundle of front end dependecies
