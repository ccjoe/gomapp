/*global -$ */
'use strict';
// generated on 2015-05-22 using generator-gulp-webapp 0.3.0
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var browserSync = require('browser-sync');
var reload = browserSync.reload;

/*--------------------- SASS ----------------*/
var sass = require('gulp-ruby-sass');
gulp.task('styles', function () {
  return sass('./app/styles/main.scss')
    .pipe(gulp.dest('./app/css/'));
     //.pipe();
});

//node-sass can't run on window
// gulp.task('styles', function () {
//   return gulp.src('app/styles/main.scss')
//     .pipe($.sourcemaps.init())
//     .pipe($.sass({
//       outputStyle: 'nested', // libsass doesn't support expanded yet
//       precision: 10,
//       includePaths: ['.'],
//       onError: console.error.bind(console, 'Sass error:')
//     }))
//     .pipe($.postcss([
//       require('autoprefixer-core')({browsers: ['last 1 version']})
//     ]))
//     .pipe($.sourcemaps.write())
//     .pipe(gulp.dest('.tmp/styles'))
//     .pipe(reload({stream: true}));
// });

/*--------------------- JS ----------------*/
gulp.task('jshint', function () {
  return gulp.src('app/scripts/**/*.js')
    .pipe(reload({stream: true, once: true}))
    .pipe($.jshint())
    .pipe($.jshint.reporter('jshint-stylish'))
    // .pipe($.if(!browserSync.active, $.jshint.reporter('fail')));
});

/*-------------Compiler template ------------*/
var fs = require('fs');
var path = require('path');
var _ = require('underscore');

var TEMPLATE_EXT_REGEX = /\.(html|tmpl)$/;
var TEMPLATE_BASE_PATH = __dirname + '/gom/gom/ui/ui.tmpl/';

function compileTemplateSourceToAMD(template) {
    return 'define(function() { return ' + _.template(template).source.replace(/[\r\n\t]+/gm, '') + ' });';
}

function compileUnderScore(){
    _.each(fs.readdirSync(TEMPLATE_BASE_PATH), function (file) {
        if (!TEMPLATE_EXT_REGEX.test(file)) {
            return;
        }
        var inputFile = TEMPLATE_BASE_PATH + path.sep + file;
        var outputFile = TEMPLATE_BASE_PATH + path.sep + file.split('.').slice(0, -1) + '.js';
        fs.writeFileSync(outputFile, compileTemplateSourceToAMD(fs.readFileSync(inputFile).toString('utf-8')));
    });
}
gulp.task('preCompiler', function () {
    compileUnderScore();
});

/*--------------------- HTML ----------------*/
gulp.task('html', ['styles'], function () {
  var assets = $.useref.assets({searchPath: ['.tmp', 'app', '.']});

  return gulp.src('app/*.html')
    .pipe(assets)
    .pipe($.if('*.js', $.uglify()))
    .pipe($.if('*.css', $.csso()))
    .pipe(assets.restore())
    .pipe($.useref())
    .pipe($.if('*.html', $.minifyHtml({conditionals: true, loose: true})))
    .pipe(gulp.dest('dist'));
});

/*-------------------- IMAGES ----------------*/
gulp.task('images', function () {
  return gulp.src('app/images/**/*')
    .pipe($.cache($.imagemin({
      progressive: true,
      interlaced: true,
      // don't remove IDs from SVGs, they are often used
      // as hooks for embedding and styling
      svgoPlugins: [{cleanupIDs: false}]
    })))
    .pipe(gulp.dest('dist/images'));
});

/*-------------------- FONTS -----------------*/
gulp.task('fonts', function () {
  return gulp.src(require('main-bower-files')({
    filter: '**/*.{eot,svg,ttf,woff,woff2}'
  }).concat('app/fonts/**/*'))
    .pipe(gulp.dest('.tmp/fonts'))
    .pipe(gulp.dest('dist/fonts'));
});

/*-------------------- EXTRAS -----------------*/
gulp.task('extras', function () {
  return gulp.src([
    'app/*.*',
    '!app/*.html'
  ], {
    dot: true
  }).pipe(gulp.dest('dist'));
});

/*--------------------- SERVER ----------------*/
gulp.task('clean', require('del').bind(null, ['.tmp', 'dist']));
gulp.task('serve', ['styles', 'fonts'], function () {
  browserSync({
    //notify: false,
    port: 9000,
    server: {
      baseDir: ['.tmp', 'app'],
      routes: {
        '/bower_components': 'bower_components',
        '/gom': 'gom'
      }
    },
    browser: ['chrome']
  });

  // watch for changes
  gulp.watch([
    'app/*.html',
    'app/lib/**/*.*',
    'app/styles/*.*',
    'app/views/**/*',
    'app/images/**/*',
    '.tmp/fonts/**/*'
  ]).on('change', reload);

  gulp.watch('app/styles/*.scss', ['styles']);
  gulp.watch('app/fonts/**/*', ['fonts']);
  gulp.watch('bower.json', ['wiredep', 'fonts']);
});

// inject bower components
/*--------------------- DEV ----------------*/
gulp.task('wiredep', function () {
  var wiredep = require('wiredep').stream;

  gulp.src('app/styles/*.scss')
    .pipe(wiredep({
      ignorePath: /^(\.\.\/)+/
    })).pipe(gulp.dest('app/styles'));

  gulp.src('app/*.html')
    .pipe(wiredep({
      ignorePath: /^(\.\.\/)*\.\./
    })).pipe(gulp.dest('app'));
});

/*--------------------- BUILD ----------------*/
gulp.task('build', ['jshint', 'html', 'images', 'fonts', 'extras', 'preCompiler'], function () {
  return gulp.src('dist/**/*').pipe($.size({title: 'build', gzip: true}));
});

/*------------------ DEFAULT ------------------*/
gulp.task('default', ['clean'], function () {
  gulp.start('build');
});
