var gulp = require('gulp');
var server = require('gulp-express');
var gulp = require('gulp');
var watch = require('gulp-watch');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');

// where are we running?
var path = require("path");
var cwd = path.dirname(__filename);

// the various source files
var jsxSrc = [
  cwd + '/app/components/**/*.js*',
  cwd + '/app/lib/**/*.js',
  cwd + '/app/mixins/**/*.js',
  '!' + cwd + '/app/components/reactfire.min.js'
];

var jscsSrc = [
  cwd + '/app/components/**/*.js*',
  cwd + '/app/lib/**/*.js',
  cwd + '/app/mixins/**/*.js'
];

var lessSrc = cwd + '/app/less/**/*.less';

var serverSrc = [cwd + '/server.js', cwd+'/server/**/*.js'];

/**
 * Browserify bundling of app.
 */
gulp.task('bundle-app', function() {
  var browserify = require('browserify');
  var transform = require('vinyl-transform');
  var reactify = require('reactify');
  var to5ify = require("6to5ify");
  var source = require('vinyl-source-stream');

  // Make sure we point to the dist/react.min.js version of react
  var donottouch = require('browserify-global-shim').configure({
    'react': 'require("react/dist/react.min")'
  });

  return browserify(cwd + '/app/components/app.jsx')
    .transform(to5ify)
    .transform(reactify)
//    .transform(donottouch)
    .bundle()
    .pipe(source('app.js'))
    .pipe(gulp.dest(cwd + '/app/build/'));
});


/**
 * Minify app
 */
gulp.task('minify-app', ['bundle-app'], function() {

  return gulp.src(cwd + '/app/build/app.js')
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(cwd + '/app/public/javascript'));
});

gulp.task('pretend-minify-app', ['bundle-app'], function() {
  // This moves files from and to the same place as minify, but is much faster
  // (for dev cycle)
  return gulp.src(cwd + '/app/build/app.js')
    .pipe(gulp.dest(cwd + '/app/public/javascript'));
});

/**
 * Javascript and JSX linting
 */
gulp.task('lint-app', function() {
  // set up jshint to make use of jshint-jsx, as we're mixing
  // plain javascript with React's JSX.
  var jshint = require('gulp-jshint');
  var jsxhinter = require('jshint-jsx');
  jsxhinter.JSHINT = jsxhinter.JSXHINT;

  return gulp.src(jsxSrc)
    .pipe(jshint({
      linter: 'jshint-jsx',
      esnext: true
    }))
    .pipe(jshint.reporter('default'));
});


/**
 * JavaScript style validation, using JSCS
 */
gulp.task('jscs-app', function() {
  var jsxcs = require("gulp-jsxcs");
  var jshint = require('gulp-jshint');
  return gulp.src(jscsSrc)
    .pipe(jsxcs());
});


/**
 * LESS conversion to .css
 */
gulp.task('less-app', function() {
  var less = require('gulp-less');
  var plumber = require('gulp-plumber');

  return gulp.src(lessSrc)
      .pipe(plumber())
      .pipe(sourcemaps.init())
      .pipe(less())
      .pipe(sourcemaps.write())
      .pipe(gulp.dest(cwd + '/app/public/stylesheets'));
});


/**
 * our "default" task runs everything, but -crucially- it
 * runs the subtasks in order. That means we'll wait for
 * files to be written before we move on to the next task,
 * because in this case we can't run parallel tasks.
 */
gulp.task('app', ['lint-app', 'jscs-app', 'minify-app', 'less-app']);
// build things, without any kind of watching.
gulp.task('build', ['app']);
gulp.task('default', ['build']);

// watch things, without any kind of building.
gulp.task('watch-only', ['watch-app', 'run-server']);

// Meta watcher: start a build run and watch the files for individual
// apps, as well as shared resources that require linting/compilation.
gulp.task('watch', ['build','watch-only']);

gulp.task('server-kick-code', ['pretend-minify-app'], function() {
  server.notify();
  console.log("Server restarted.");
})
gulp.task('reload-code', ['pretend-minify-app', 'server-kick-code']);

gulp.task('server-kick-styles', ['less-app'], function() {
  server.notify();
  console.log("Server restarted.");
})
gulp.task('reload-styles', ['less-app', 'server-kick-styles']);


/**
 * Automatic rebuilding when .jsx or .less files are changed
 */
gulp.task('liveserve', ['build'], function() {
  gulp.start('serve');
});

gulp.task('serve', function() {
  server.run({
      file: 'server.js'
  });
  // Changes relevant to server:
  watch(serverSrc, function() {
    server.notify();
    console.log("Server restarted.");
  });
  // Changes relevant to react:
  watch(jsxSrc, function() {
    gulp.start('reload-code');
  });
  // Style changes:
  watch(lessSrc, function() {
    gulp.start('reload-styles');
  });
});
