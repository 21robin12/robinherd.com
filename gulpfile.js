// load modules
var gulp = require('gulp');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var ts = require('gulp-typescript');

function swallowError(error) {
    console.log(error.toString());
    this.emit('end');
}

gulp.task('styles', function () {
    gulp.src('styles/**/*.scss')
        .pipe(sass({
            errLogToConsole: true
        }))
        .on('error', swallowError)
        .pipe(gulp.dest('./'));
});

gulp.task('scripts', function () {
    return gulp.src([
            "scripts/**/*.ts"
        ])
        .pipe(ts({
            noImplicitAny: true,
            suppressImplicitAnyIndexErrors: true,
            allowJs: true,
            target: "es6"
        }))
        .pipe(concat('scripts.js'))
        .on('error', swallowError)
        .pipe(gulp.dest('./'));
});

gulp.task('watch', function () {
    gulp.watch('styles/**/*.scss', ['styles']);
    gulp.watch('scripts/**/*.ts', ['scripts']);
});


gulp.task('default', function () {
    // can pass many tasks here as an array
    return gulp.start(['styles', 'scripts', 'watch']);
});