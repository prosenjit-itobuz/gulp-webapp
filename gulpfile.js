var gulp = require('gulp'),
  gutil = require('gulp-util'),
  sass = require('gulp-sass'),
  autoprefixer = require('gulp-autoprefixer'),
  browserSync = require('browser-sync'),
  imagemin = require('gulp-imagemin'),
  cache = require('gulp-cache'),
  rename = require('gulp-rename'),
  concat = require('gulp-concat'),
  minifycss = require('gulp-minify-css'),
  uglify = require('gulp-uglify');
  sourcemaps = require('gulp-sourcemaps');
  gulp = require('gulp');
  inject = require('gulp-inject');

gulp.task('browser-sync', function() {
  browserSync({
    notify: false,
      server: {
          baseDir: "./"
      }
  });
});

gulp.task('styles', function(){
    gulp.src(['src/styles/**/*.scss'])
    .pipe(sourcemaps.init())
    .pipe(sass())
    .on('error', gutil.log)
    .pipe(autoprefixer('last 2 versions'))
    .on('error', gutil.log)
    .pipe(sourcemaps.write('../maps'))
    .pipe(gulp.dest('dist/styles/'))
    .pipe(rename({suffix: '.min'}))
    .pipe(minifycss())
    .pipe(gulp.dest('dist/styles/'))
    .pipe(browserSync.reload({stream:true}))
});

gulp.task('images', function(){
  gulp.src('src/images/**/*')
    .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
    .pipe(gulp.dest('dist/images/'));
});

gulp.task('scripts', function(){
  return gulp.src('src/scripts/**/*.js')
    .pipe(concat('main.js'))
    .on('error', gutil.log)
    .pipe(gulp.dest('dist/scripts/'))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .on('error', gutil.log)
    .pipe(gulp.dest('dist/scripts/'))
    .pipe(browserSync.reload({stream:true}))
});

gulp.task('bs-reload', function () {
  browserSync.reload();
});

gulp.task('inject', function () {
  gulp.src('*.html')
  .pipe(inject(gulp.src(['./dist/styles/style.css'], {read: false}), {relative: true}))
  .pipe(gulp.dest('./'));
});

gulp.task('default', ['browser-sync'], function () {
  gulp.watch("src/styles/**/*.scss", ['styles']);
  gulp.watch("src/scripts/**/*.js", ['scripts']);
  gulp.watch("*.html", ['inject','bs-reload']);
});