var gulp = require('gulp');
var jshint = require('gulp-jshint');
var jshintReporter = require('jshint-stylish');
var watch = require('gulp-watch');
var shell = require('gulp-shell')

var sass = require('gulp-sass');


var paths = {
	'src':['./models/**/*.js','./routes/**/*.js', 'keystone.js', 'package.json'],
	'style': {
		all: './public/styles/**/*.scss',
		output: './public/styles/'
	}

};

// gulp lint
gulp.task('lint', function(){
	gulp.src(paths.src)
		.pipe(jshint())
		.pipe(jshint.reporter(jshintReporter));
});

// gulp watcher for lint
gulp.task('watch:lint', function () {
	gulp.watch(paths.src, ['lint']);
});


// gulp.task('watch:sass', function () {
// 	gulp.watch(paths.style.all, ['sass']);
// });

// gulp.task('sass', function(){
// 	gulp.src(paths.style.all)
// 		.pipe(sass().on('error', sass.logError))
// 		.pipe(gulp.dest(paths.style.output));
// });

// 'use strict';
 
// var gulp = require('gulp');
// var sass = require('gulp-sass');
 
gulp.task('sass', function () {
  return gulp.src('./sass/**/*.scss')
    .pipe(sass.sync().on('error', sass.logError))
    .pipe(gulp.dest('./public/styles'));
});
 
gulp.task('sass:watch', function () {
  gulp.watch('./sass/**/*.scss', ['sass']);
});


gulp.task('runKeystone', shell.task('node keystone.js'));
gulp.task('watch', [
  'sass:watch',
  'watch:lint'
]);

gulp.task('default', ['watch', 'runKeystone']);
