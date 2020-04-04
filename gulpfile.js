var gulp = require('gulp');

var connect = require('gulp-connect');

gulp.task('webserver',function(){

   connect.server({

      livereload:true,

      port:8080

   });

});

gulp.task('default',['webserver']);