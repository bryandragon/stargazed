var gulp = require('gulp')
  , clean = require('gulp-clean')
  , concat = require('gulp-concat')
  , connect = require('gulp-connect')
  , browserify = require('gulp-browserify')
  , stylus = require('gulp-stylus')
  , mocha = require('gulp-mocha');

gulp.task('clean', function () {
  return gulp.src('build')
    .pipe(clean());
});

gulp.task('build-images', function () {
  return gulp.src('assets/images/**/*')
    .pipe(gulp.dest('build/images'));
});

gulp.task('build-styles', function () {
  return gulp.src('assets/styles/main.styl')
    .pipe(stylus({use: ['nib']}))
    .pipe(gulp.dest('build/css'));
});

gulp.task('build-app', function () {
  return gulp.src('src/main.js')
    .pipe(bundle())
    .pipe(concat('main.js'))
    .pipe(gulp.dest('build/js'));
});

gulp.task('build-test', function () {
  return gulp.src('test/main.js')
    .pipe(bundle())
    .pipe(concat('test.js'))
    .pipe(gulp.dest('build/js'));
});

gulp.task('build', ['clean'], function () {
  gulp.start('build-images', 'build-styles', 'build-app', 'build-test');
});

gulp.task('server', connect.server({root: [__dirname], port: 4000}));

/**
 * Shim libraries for use with browserify.
 */
function bundle() {
  return browserify({
    shim: {
      angular: {
        path: 'lib/angular/angular.js',
        exports: 'angular',
        depends: {jquery: '$'}
      },
      'angular-resource': {
        path: 'lib/angular-resource/angular-resource.js',
        exports: 'ngResource',
        depends: {angular: 'angular'}
      },
      'angular-route': {
        path: 'lib/angular-route/angular-route.js',
        exports: 'ngRoute',
        depends: {angular: 'angular'}
      },
      chai: {
        path: 'lib/chai/chai.js'
      },
      jquery: {
        path: 'lib/jquery/dist/jquery.js',
        exports: '$'
      },
      rsvp: {
        path: 'lib/rsvp/rsvp.js',
        exports: 'RSVP'
      }
    }
  });
}
