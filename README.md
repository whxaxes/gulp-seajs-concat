#gulp-seajs-concat

demo:<br/>

        var gulp = require("gulp");
        var transport = require("gulp-seajs-transport");
        var uglify = require("gulp-uglify");
        var concat = require("gulp-seajs-concat");
        
        gulp.task('default' , function(){
            gulp.src('javascripts/**/*')
                .pipe(transport())
                .pipe(concat(/\/app\//g))
                .pipe(uglify())
                .pipe(gulp.dest("./dist"));
        })
