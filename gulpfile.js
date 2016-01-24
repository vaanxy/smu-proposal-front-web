'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var lazypipe = require('lazypipe');
var rimraf = require('rimraf');
var wiredep = require('wiredep').stream;
var runSequence = require('run-sequence');
var browserSync = require('browser-sync');
var concat = require('gulp-concat');

var proposal = {
  app: require('./bower.json').appPath || 'app',
  dist: 'dist'
};

var paths = {
  scripts: [proposal.app + '/scripts/**/*.js'],
  styles: [proposal.app + '/styles/**/*.scss'],
  test: ['test/spec/**/*.js'],
  testRequire: [
    proposal.app + '/bower_components/angular/angular.js',
    proposal.app + '/bower_components/angular-mocks/angular-mocks.js',
    proposal.app + '/bower_components/angular-resource/angular-resource.js',
    proposal.app + '/bower_components/angular-cookies/angular-cookies.js',
    proposal.app + '/bower_components/angular-sanitize/angular-sanitize.js',
    proposal.app + '/bower_components/angular-route/angular-route.js',
    'test/mock/**/*.js',
    'test/spec/**/*.js'
  ],
  karma: 'karma.conf.js',
  views: {
    main: proposal.app + '/index.html',
    files: [proposal.app + '/views/**/*.html']
  }
};

////////////////////////
// Reusable pipelines //
////////////////////////

var lintScripts = lazypipe()
  .pipe($.jshint, '.jshintrc')
  .pipe($.jshint.reporter, 'jshint-stylish');

var styles = lazypipe()
  .pipe($.sass, {
    outputStyle: 'expanded',
    precision: 10
  })
  .pipe($.autoprefixer, 'last 1 version')
  .pipe(gulp.dest, '.tmp/styles');

///////////
// Tasks //
///////////

gulp.task('styles', function () {
  return gulp.src(paths.styles)
    .pipe(styles());
});

gulp.task('lint:scripts', function () {
  return gulp.src(paths.scripts)
    .pipe(lintScripts());
});

gulp.task('clean:tmp', function (cb) {
  rimraf('./.tmp', cb);
});

gulp.task('usemin',['lint:scripts'], function () {
  return gulp.src(paths.views.main)
      .pipe($.usemin({
        css:[$.cssnano({cache: true}),$.rev()],
        js: [$.ngAnnotate(),$.uglify(),$.rev()]
      }))
      .pipe(gulp.dest(proposal.dist));
});

//
// gulp.task('test', ['start:server:test'], function () {
//   var testToFiles = paths.testRequire.concat(paths.scripts, paths.test);
//   return gulp.src(testToFiles)
//     .pipe($.karma({
//       configFile: paths.karma,
//       action: 'watch'
//     }));
// });

// inject bower components
gulp.task('bower', function () {
  return gulp.src(paths.views.main)
    .pipe(wiredep({
      directory: 'bower_components'
    }))
  .pipe(gulp.dest(proposal.app));
});

///////////
// Build //
///////////

gulp.task('clean:dist', function (cb) {
  rimraf('./dist', cb);
});

gulp.task('copy:views', function () {
  return gulp.src(proposal.app + '/views/**/*')
    .pipe(gulp.dest(proposal.dist + '/views'));
});

gulp.task('images', function () {
  return gulp.src(proposal.app + '/images/**/*')
    .pipe($.cache($.imagemin({
        optimizationLevel: 5,
        progressive: true,
        interlaced: true
    })))
    .pipe(gulp.dest(proposal.dist + '/images'));
});

gulp.task('copy:extras', function () {
  return gulp.src(proposal.app + '/*/.*', { dot: true })
    .pipe(gulp.dest(proposal.dist));
});

gulp.task('copy:fonts', function () {
    gulp.src(proposal.app + '/fonts/**/*')
        .pipe(gulp.dest(proposal.dist + '/fonts'));
    gulp.src('./bower_components/font-awesome/fonts/**/*.{ttf,woff,eof,svg}*')
        .pipe(gulp.dest('./dist/fonts'));
    gulp.src('./bower_components/bootstrap/dist/fonts/**/*.{ttf,woff,eof,svg}*')
        .pipe(gulp.dest('./dist/fonts'));

});

gulp.task('build', ['clean:dist'], function () {
  runSequence(['styles', 'images', 'copy:views', 'copy:extras', 'copy:fonts', 'usemin']);
});

gulp.task('default', ['build']);

// Watch
gulp.task('watch', ['browser-sync'], function () {
    $.watch(paths.styles)
        .pipe($.plumber())
        .pipe(styles());
    gulp.watch(paths.views.files, ['copy:views']);

  gulp.watch('{app/scripts/**/*.js,.tmp/styles/**/*.css}', ['usemin']);
  gulp.watch('bower.json', ['bower']);
});

gulp.task('browser-sync', ['build'], function () {
   var files = [
        'app/index.html',
        'app/views/*.html',
        'app/styles/**/*.css',
        'app/images/**/*.png',
        'app/scripts/**/*.js',
        'dist/**/*'
   ];

   browserSync.init(files, {
      server: {
         baseDir: "dist",
         index: "index.html"
      }
   });
   // Watch any files in dist/, reload on change
   gulp.watch(['dist/**/*']).on('change', browserSync.reload);
});
