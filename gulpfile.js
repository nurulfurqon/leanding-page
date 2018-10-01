const browserSync = require('browser-sync');
const gulp = require('gulp');
const sass = require('gulp-sass');
const gulpif = require('gulp-if');
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');
const babel = require('gulp-babel');
const del = require('del');

const env = process.env.NODE_ENV;

// BrowserSync
gulp.task('browserSync', function() {
  browserSync({
    server: {
      baseDir: './public/'
    }
  });
});

gulp.task('html', function() {
  return gulp
    .src(['src/html/*.html', 'src/html/**/*.html'])
    .pipe(gulp.dest('public'))
    .pipe(browserSync.stream());
});

gulp.task('asset:scripts', function() {
  return gulp
    .src([
      'node_modules/babel-polyfill/dist/polyfill.js',
      'src/js/*.js',
      'src/js/**/*.js'
    ])
    .pipe(babel({ presets: ['babel-preset-env'] }))
    .pipe(gulp.dest('public/assets/js'))
    .pipe(browserSync.stream());
});

gulp.task('asset:styles', function() {
  gulp
    .src(['src/scss/*.scss', 'src/scss/**/*.scss'])
    .pipe(sourcemaps.init())

    // scss output compressed if production or expanded if development
    .pipe(
      gulpif(
        env === 'production',
        sass({
          outputStyle: 'compressed'
        }),
        sass({ outputStyle: 'expanded' })
      )
    )
    .pipe(autoprefixer({ browsers: ['last 3 versions'], cascade: false }))
    .pipe(gulpif(env === 'development', sourcemaps.write('../maps')))
    .pipe(gulp.dest('public/assets/css'))
    .pipe(browserSync.stream());
});

gulp.task('asset:image', function() {
  return gulp
    .src(['src/img/*', 'src/img/**/*'])
    .pipe(gulp.dest('public/assets/img'))
    .pipe(browserSync.stream());
});

gulp.task('vendor', function() {
  return gulp
    .src(['src/vendor/*', 'src/vendor/**/*'])
    .pipe(gulp.dest('public/assets/vendor'))
    .pipe(browserSync.stream());
});

gulp.task('manifest', function () {
  return gulp
    .src(['src/manifest/*.json', 'src/manifest/**/*.json'])
    .pipe(gulp.dest('public'))
    .pipe(browserSync.stream());
});

gulp.task('clean:maps', (env === 'production', deleteMapsFolder));

function deleteMapsFolder() {
  return del(['public/maps/**']);
}

gulp.task('watch', function() {
  gulp.watch(['src/html/*.html', 'src/html/**/*.html'], ['html']);
  gulp.watch(['src/scss/*.scss', 'src/scss/**/*.scss'], ['asset:styles']);
  gulp.watch(['src/js/*.js', 'src/js/**/*.js'], ['asset:scripts']);
  gulp.watch(['src/img/*', 'src/img/**/*'], ['asset:image']);
  gulp.watch(['src/vendor/*', 'src/vendor/**/*'], ['vendor']);
  gulp.watch(['src/manifest/*.json', 'src/manifest/**/*.json'], ['manifest']);
});

gulp.task('default', [
  'html',
  'asset:styles',
  'asset:scripts',
  'asset:image',
  'vendor',
  'manifest',
  'browserSync',
  'clean:maps',
  'watch'
]);
