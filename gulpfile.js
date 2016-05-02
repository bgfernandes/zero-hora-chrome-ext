var gulp = require('gulp');
var shell = require('gulp-shell');
var less = require('gulp-less');

//packages the extension, generating docs
gulp.task('package', ['jsdoc', 'browserify', 'less'], function () {
  
});

gulp.task('jsdoc', shell.task([
  'rm -rf out',
  'jsdoc -c conf.json'
]));

gulp.task('watchify', shell.task([
  'watchify  ./source/main.js -v -o ./release/js/extension.js'
]));

gulp.task('less', function (){
  return gulp.src('./source/less/*.less')
    .pipe(less())
    .pipe(gulp.dest('./release/css'));
});

gulp.task('browserify', shell.task([
   'browserify ./source/js/main.js -v -o ./release/js/extension.js'
]));

gulp.task('default', ['less', 'browserify'], function(){
  //watches for changes in the css
  gulp.watch('./source/less/*.less', ['less']);
  
  //watches for changes in the js
  gulp.watch('./source/js/*.js', ['browserify']);
});

