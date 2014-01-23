var gulp = require('gulp');
var uglify = require('gulp-uglify');
var imagemin = require('gulp-imagemin');
var minifyCSS = require('gulp-minify-css');

gulp.task('scripts', function() {
    // Minify and copy all JavaScript (except vendor scripts)
    return gulp.src(['public/javascripts/*.js','public/plugins/**/*.js','public/plugins/**/js/*.js'])
    .pipe(uglify())
    .pipe(gulp.dest('build/js'));
});

gulp.task('css',function  () {
    return gulp.src(['public/stylesheets/*.css','public/plugins/**/css/*.css','public/plugins/**/*.css'])
    .pipe(minifyCSS())
    .pipe(gulp.dest('build/css'))
})

// Copy all static images
gulp.task('images', function() {
    return gulp.src('public/images/**')
    // Pass in options to the task
    .pipe(imagemin({optimizationLevel: 5}))
    .pipe(gulp.dest('build/img'));
});

// Rerun the task when a file changes
gulp.task('watch', function () {
    gulp.watch('client/js/**', ['scripts']);
    gulp.watch('client/css/**',['css']);
    gulp.watch('client/img/**', ['images']);
});

// The default task (called when you run `gulp` from cli)
gulp.task('default', ['scripts','css', 'images', 'watch']);

