'use strict';

/**
 * Sass CSS precompiler Options
 * `sassGem` (boolean) to determine if `gulp-sass` or `gulp-ruby-sass` is used for compiling Sass

 1) `gulp-ruby-sass`
   * Dependencies: Ruby and Sass gem  - [install](http://sass-lang.com/install)
   * Support for latest version of Sass
 2) `gulp-ruby-sass`
   * Dependencies: No additional dependencies
   * Uses [Libsass](https://github.com/hcatlin/libsass) - C/C++ port of the Sass CSS precompiler
   * Lighter than full Sass gem but does not include all latest functionality of Sass
 */
var sassGem = false;


// modules
var browserify = require('browserify');
var clean = require('gulp-clean');
var collate = require('./tasks/collate');
var concat = require('gulp-concat');
var connect = require('gulp-connect');
var csso = require('gulp-csso');
var gulp = require('gulp');
var gulpif = require('gulp-if');
var imagemin = require('gulp-imagemin');
var plumber = require('gulp-plumber');
var prefix = require('gulp-autoprefixer');
var Q = require('q');
var rename = require('gulp-rename');
var sass = (sassGem) ? require("gulp-ruby-sass") : require("gulp-sass");
var source = require('vinyl-source-stream');
var streamify = require('gulp-streamify');
var template = require('./tasks/template');
var uglify = require('gulp-uglify');

// Sass Error options
var sassOptions = (sassGem) ? {
    trace: true
} : {
    errLogToConsole: true
};

// configuration
var config = {
    dev: true,
    src: {
        scripts: {
            fabricator: [
                './src/fabricator/scripts/prism.js',
                './src/fabricator/scripts/fabricator.js'
            ],
            toolkit: './src/toolkit/assets/scripts/toolkit.js'
        },
        styles: {
            fabricator: './src/fabricator/styles/fabricator.scss',
            toolkit: './src/toolkit/assets/styles/toolkit.scss'
        },
        images: 'src/toolkit/assets/images/**/*',
        fonts: 'src/toolkit/assets/fonts/**/*',
        templates: './src/toolkit/views/*.html',
        materials: [
            'components',
            'structures',
            'prototypes',
            'documentation'
        ]
    },
    dest: './public'
};


// clean
gulp.task('clean', function() {
    return gulp.src([config.dest], {
            read: false
        })
        .pipe(clean());
});


// styles
gulp.task('styles:fabricator', function() {
    return gulp.src(config.src.styles.fabricator)
        .pipe(plumber())
        .pipe(sass(sassOptions))
        .pipe(prefix('last 1 version'))
        .pipe(gulpif(!config.dev, csso()))
        .pipe(rename('f.css'))
        .pipe(gulp.dest(config.dest + '/fabricator/styles'))
        .pipe(gulpif(config.dev, connect.reload()));
});

gulp.task('styles:toolkit', function() {
    return gulp.src(config.src.styles.toolkit)
        .pipe(plumber())
        .pipe(sass(sassOptions))
        .pipe(prefix('last 1 version'))
        .pipe(gulpif(!config.dev, csso()))
        .pipe(gulp.dest(config.dest + '/toolkit/styles'))
        .pipe(gulpif(config.dev, connect.reload()));
});

gulp.task('styles', ['styles:fabricator', 'styles:toolkit']);


// scripts
gulp.task('scripts:fabricator', function() {
    return gulp.src(config.src.scripts.fabricator)
        .pipe(plumber())
        .pipe(concat('f.js'))
        .pipe(gulpif(!config.dev, uglify()))
        .pipe(gulp.dest(config.dest + '/fabricator/scripts'))
        .pipe(gulpif(config.dev, connect.reload()));
});

gulp.task('scripts:toolkit', function() {
    return browserify(config.src.scripts.toolkit).bundle()
        .pipe(plumber())
        .pipe(source('toolkit.js'))
        .pipe(gulpif(!config.dev, streamify(uglify())))
        .pipe(gulp.dest(config.dest + '/toolkit/scripts'))
        .pipe(gulpif(config.dev, connect.reload()));
});

gulp.task('scripts', ['scripts:fabricator', 'scripts:toolkit']);


// images
gulp.task('images', ['favicon'], function() {
    return gulp.src(config.src.images)
        .pipe(imagemin())
        .pipe(gulp.dest(config.dest + '/toolkit/fonts'))
        .pipe(gulpif(config.dev, connect.reload()));
});

// fonts
gulp.task('fonts', ['favicon'], function() {
    return gulp.src(config.src.fonts)
        .pipe(imagemin())
        .pipe(gulp.dest(config.dest + '/toolkit/fonts'))
        .pipe(gulpif(config.dev, connect.reload()));
});

gulp.task('favicon', function() {
    return gulp.src('./src/favicon.ico')
        .pipe(gulp.dest(config.dest));
});


// collate
gulp.task('collate', function() {

    // 'collate' is a little different -
    // it returns a promise instead of a stream

    var deferred = Q.defer();

    var opts = {
        materials: config.src.materials,
        dest: config.dest + '/fabricator/data/data.json'
    };

    // run the collate task; resolve deferred when complete
    collate(opts, deferred.resolve);

    return deferred.promise;

});

// templates
gulp.task('templates:fabricator', function() {
    var opts = {
        data: config.dest + '/fabricator/data/data.json',
        prototype: false
    };

    return gulp.src(config.src.templates)
        .pipe(template(opts))
        .pipe(gulp.dest(config.dest))
        .pipe(gulpif(config.dev, connect.reload()));
});

gulp.task('templates:prototypes', function() {
    var opts = {
        data: config.dest + '/fabricator/data/data.json',
        prototype: true
    };
    return gulp.src('./src/toolkit/prototypes/*.html')
        .pipe(template(opts))
        .pipe(rename({
            prefix: 'prototype-'
        }))
        .pipe(gulp.dest(config.dest))
        .pipe(gulpif(config.dev, connect.reload()));
});

gulp.task('templates', ['collate'], function() {
    gulp.start('templates:fabricator', 'templates:prototypes');
});


// build
gulp.task('build', ['clean'], function() {
    gulp.start('styles', 'scripts', 'images', 'fonts', 'templates');
});


// server
gulp.task('connect', function() {
    connect.server({
        root: [config.dest],
        port: 9006,
        livereload: config.dev ? {
            port: (Math.floor(Math.random() * (35729 - 35720 + 1) + 35720))
        } : false
    });
});


// watch
gulp.task('watch', ['connect'], function() {
    gulp.watch('src/toolkit/{components,structures,prototypes,documentation,views}/**/*.{html,md}', ['templates']);
    gulp.watch('src/fabricator/styles/**/*.scss', ['styles:fabricator']);
    gulp.watch('src/toolkit/assets/styles/**/*.scss', ['styles:toolkit']);
    gulp.watch('src/fabricator/scripts/**/*.js', ['scripts:fabricator']);
    gulp.watch('src/toolkit/assets/scripts/**/*.js', ['scripts:toolkit']);
    gulp.watch(config.src.images, ['images']);
    gulp.watch(config.src.fonts, ['fonts']);
});


// development environment
gulp.task('dev', ['build'], function() {
    gulp.start('watch');
});


// default build task
gulp.task('default', function() {
    config.dev = false;
    gulp.start('build');
});