#gulp-seajs-concat

demo:<br/>

    gulp.task('default' , function(){
        gulp.src('javascripts/**/*')
            .pipe(transport())
            .pipe(concat(/\/app\//g))
            .pipe(uglify())
            .pipe(gulp.dest("./dist"));
    })
