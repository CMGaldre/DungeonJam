var gulp = require('gulp');
var less = require('gulp-less');
var exec = require('child_process').exec;

gulp.task('less', function() {
	return gulp.src('less/main.less')
		.pipe(less())
		.pipe(gulp.dest('src/css'))
});

gulp.task('startserver', function(cb){
	exec('npm start', function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    cb(err);
  });
});

gulp.task('default', ['less', 'startserver'], function() {

});