var gulp = require('gulp');
var uglify = require('gulp-uglify');
var imagemin = require('gulp-imagemin');
var minifyCSS = require('gulp-minify-css');
var lr = require('tiny-lr'),
refresh = require('gulp-livereload'),server = lr();

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

gulp.task('refresh',function  () {
    gulp.src(['./views/*.ejs']).pipe(refresh(server));
})

gulp.task('watch', function () {
    gulp.watch('public/javascripts/**', ['scripts','refresh']);
    gulp.watch('public/stylesheets/**',['css','refresh']);
    gulp.watch('public/images/**', ['images','refresh']);
    gulp.watch('views/*.ejs',['refresh']);
});

gulp.task('server',function  () {
    var app=require('./app');
    app.listen(3000);
})
// The default task (called when you run `gulp` from cli)
gulp.task('default', ['scripts','css', 'images','server', 'watch','refresh']);

