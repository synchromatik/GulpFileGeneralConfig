# Gulp file with general tasks


Gulp config for everyday usage.

Features:

- SCSS to CSS processing with mirror dir copy "assets/src" to "assets/build"

- JS Linting

- Image (PNG, JPEG, SVG) Optimization

- BrowserSync

- JS/CSS Minification/ugliify with .min added to file names


### Changelog:

#### V.1.5
- Moved bundle configs to appropriate dirs
#### V.1.4
- Added gulp-cached/gulp-newer for js and image files (only new files will be processed, not all)
- 1.4b: moved from reload to injecting for css

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
