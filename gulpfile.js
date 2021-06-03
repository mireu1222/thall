// gulp 모듈 호출
const gulp = require('gulp'),
    { lastRun } = require('gulp');

 

const fileinclude = require('gulp-file-include'),
    browserSync = require('browser-sync').create(),
    del = require('del'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    stripDebug = require('gulp-strip-debug'),
    imagemin = require('gulp-imagemin'),
    pretty = require('pretty'),
    through2 = require('through2'),
    sourcemaps = require('gulp-sourcemaps'),
    sass = require('gulp-sass');

 

/** 
 * ----- 
 * Path 정의 
 * ----- 
**/
var src = './src',
    dist = './dist',
    paths = {
        html: src + '/pages/**/*.html', // pages
        includes: src + '/includes/**/*.html', // include htmls(not pages)
        js: src + '/js/*.js',
        jsUi: src + '/js/ui/*.js', // ui min
        scss: src + '/scss/*.scss', // scss
        scssPatials: src + '/scss/**/*.scss', // scss patials
        img: src + '/images/**/*',
        font: src + '/fonts/**/*', // font
    };

 

 

/** 
 * ----- 
 * HTML build _ file include
 * ----- 
**/
function prettyGulp(file, enc, callback) {
    file.contents = Buffer.from(pretty(file.contents.toString(), {ocd: true}));
    callback(null, file);
}

 

gulp.task('html', async function () {
    return gulp
        .src([paths.html], { base: src + '/pages/' })
        .pipe(fileinclude({
            prefix: '@@',
            basepath: src + '/includes/',
            indent: true
        }))
        .pipe(through2.obj(prettyGulp))
        .pipe(gulp.dest(dist))
        .pipe(browserSync.stream());
});

 

 
/** 
 * ----- 
 * SASS compile
 * ----- 
**/
var scssOptions = {
    outputStyle: "expanded",
    precision: 6,
	sourceComments: false,
	indentWidth:4
};

 
gulp.task('style', async function () {
    return gulp
        // .src(paths.scss, { sourcemaps: true })
        .src(paths.scss)
        .pipe(sourcemaps.init())
        .pipe(sass(scssOptions).on('error', sass.logError))
        .pipe(sourcemaps.write('./maps'))
        .pipe(gulp.dest(dist + '/css'))
        .pipe(browserSync.stream());
});

 

 
/** 
 * ----- 
 * IMAGES build
 * ----- 
**/
gulp.task('images', function () {
    return gulp
        .src(paths.img, {since: lastRun('images')})
        // .pipe(imagemin())
        .pipe(gulp.dest(dist + '/images'))
});





/** 
 * ----- 
 * FONTS build
 * ----- 
**/
gulp.task('font', function () {
    return gulp
        .src(paths.font)
        .pipe(gulp.dest(dist + '/fonts'))
});

 


/** 
 * ----- 
 * JS build
 * ----- 
**/
gulp.task('scripts', function () {
    return gulp
        .src(paths.js, { sourcemaps: true })
        //.pipe(stripDebug()) // consloe.log, alert 제거
        // .pipe(concat('common.js'))
        // .pipe(uglify())
        .pipe(gulp.dest(dist + '/js'))
});
gulp.task('scripts-ui', function () {
    return gulp
        .src(paths.jsUi, { sourcemaps: true })
        .pipe(stripDebug()) // consloe.log, alert 제거
        .pipe(concat('ui.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest(dist + '/js'))
});

 

 

/** 
 * ----- 
 * Browser Sync + watch
 * ----- 
**/

gulp.task('browserSync', function () {
    browserSync.init({
        port: 8080,
        server: {
            baseDir: dist
        },
        startPath: "./"
    });

    gulp.watch(paths.html, gulp.series('html')).on('change', browserSync.reload);
    gulp.watch(paths.includes, gulp.series('html')).on('change', browserSync.reload);
    gulp.watch(paths.scss, gulp.series('style')).on('change', browserSync.reload);
    gulp.watch(paths.scssPatials, gulp.series('style')).on('change', browserSync.reload);
    gulp.watch(paths.js, gulp.series('scripts')).on('change', browserSync.reload);
    gulp.watch(paths.jsUi, gulp.series('scripts-ui')).on('change', browserSync.reload);
    gulp.watch(paths.img, gulp.series('images')).on('change', browserSync.reload);
});

 

 

/** 
 * ----- 
 * dist folder cleaning & build
 * ----- 
**/
gulp.task('cleaning', async function () {
    return del.sync("./dist");
});

gulp.task('building', gulp.series(['html', 'style', 'font', 'images', 'scripts', 'scripts-ui']));

gulp.task('build', gulp.series('cleaning', gulp.series('building')));

 

 

/** 
 * ----- 
 * gulp default
 * ----- 
**/
gulp.task('default', gulp.series('browserSync'));