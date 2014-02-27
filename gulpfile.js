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
    .on('prebundle', function (bundle) {
      // Expose globals to browserify for building tests
      var testGlobals =
        'describe,it,before,beforeEach,after,afterEach,chai,sinon'.split(',');

      testGlobals.forEach(function (name) {
        bundle.external(name);
      });
    })
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
      backbone: {
        path: 'lib/backbone-1.1.1.js',
        exports: 'Backbone',
        depends: {
          jquery: '$',
          underscore: '_'
        }
      },
      jquery: {
        path: 'lib/jquery-2.1.0.js',
        exports: '$'
      },
      marionette: {
        path: 'lib/backbone.marionette-1.6.2.js',
        exports: 'Marionette',
        depends: {
          jquery: '$',
          underscore: '_',
          backbone: 'Backbone'
        }
      },
      rivets: {
        path: 'lib/rivets-0.6.6.js',
        exports: 'rivets'
      },
      rsvp: {
        path: 'lib/rsvp-3.0.6.js',
        exports: 'RSVP'
      },
      underscore: {
        path: 'lib/underscore-1.6.0.js',
        exports: '_'
      },
      'underscore.string': {
        path: 'lib/underscore.string-2.3.2.js',
        exports: '_.str',
        depends: {
          underscore: '_'
        }
      }
    },
    transform: ['brfs']
  });
}
