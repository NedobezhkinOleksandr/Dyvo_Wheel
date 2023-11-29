const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const concat = require('gulp-concat');
const csso = require('gulp-csso');
const babel = require('gulp-babel');
const sync = require('browser-sync').create();

gulp.task('styles', function () {
  return gulp.src('src/styles/*.scss')
    .pipe(sass())
    .pipe(csso())
    .pipe(concat('index.css'))
    .pipe(gulp.dest('dist'))
    .pipe(sync.stream());
});

gulp.task('images', function () {
  return gulp.src('src/images/*.png')
    .pipe(gulp.dest('dist/images'))
    .pipe(sync.stream());
});


gulp.task('ts', function () {
  return gulp.src('src/*.ts')
    .pipe(babel({
      presets: ['@babel/env']
    }))
    .pipe(concat('index.js'))
    .pipe(gulp.dest('dist'))
    .pipe(sync.stream());
});

gulp.task('json', function () {
  return gulp.src('src/*.json')
    .pipe(gulp.dest('dist'))
    .pipe(sync.stream());
});

gulp.task('html', function () {
  return gulp.src('src/*.html')
    .pipe(gulp.dest('dist'))
    .pipe(sync.stream());
});

gulp.task('build', gulp.series('styles', 'html', 'images', 'json', 'ts'));

gulp.task('serve', function () {
  sync.init({
    server: './dist'
  });

  gulp.watch('src/styles/*.scss', gulp.series('styles')).on('change', sync.reload);
  gulp.watch('src/*.html', gulp.series('html')).on('change', sync.reload);
  gulp.watch('src/*.json', gulp.series('json')).on('change', sync.reload);
  gulp.watch('src/images/*', gulp.series('images'));
  gulp.watch('src/*.ts', gulp.series('ts')).on('change', sync.reload);
});

gulp.task('default', gulp.series('build', 'serve'));
