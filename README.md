#gulp-seajs-concat

demo:<br/>

used [gulp-seajs-transport](https://github.com/guilipan/gulp-seajs-transport)<br />

    gulp.task('default' , function(){
        gulp.src('javascripts/**/*')
            .pipe(transport())
            .pipe(concat(/\/app\//g))
            .pipe(uglify())
            .pipe(gulp.dest("./dist"));
    })
