#gulp-seajs-concat

(因为没发现相关组件，所以自己写来凑合着用的)

how to use:

         var concat = require("gulp-seajs-concat");
         concat(reg) //reg为匹配路径的正则，也就是可以过滤掉自己不想打包的js，参数不必须。

demo:<br/>

        var gulp = require("gulp");
        var transport = require("gulp-seajs-transport");
        var uglify = require("gulp-uglify");
        var concat = require("gulp-seajs-concat");
        
        gulp.task('default' , function(){
            return gulp.src('javascripts/**/*')
                .pipe(transport())
                .pipe(concat(/\/app\//g))
                .pipe(uglify())
                .pipe(gulp.dest("./dist"));
        })
