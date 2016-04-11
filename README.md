# gulp-seajs-concat

[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Coverage Status][coveralls-image]][coveralls-url]

gulp插件，用于合并编译过的seajs模块


## Install 
```
npm install gulp-seajs-concat
```


## Usage:
demo:
```     
var gulp = require("gulp");
var transport = require("gulp-seajs-transport");
var uglify = require("gulp-uglify");
var concat = require("gulp-seajs-concat");
gulp.task('default' , function(){
   return gulp.src('javascripts/**/*')
       .pipe(transport())
       .pipe(concat({
            alias: {
                'common': './public/javascript/cmdmodule/base/common',
                'http': './public/javascript/cmdmodule/base/http'
            },
            base: "./pubic/javascript/",
            filter: /\/app\//g
        }))
       .pipe(uglify())
       .pipe(gulp.dest("./dist"));
})
```


## API
### alias
别名，对应seajs.config的alias，如果在seajs的config里加了alias，最好在concat也配置上该alias，concat才能找到响应文件

### base 
基础目录，对应seajs.config的base，js文件里require的路径第一个字符不是.的路径将在前面加上base目录。

### filter
过滤正则，过滤输出文件/目录


## Running Test
```
make test
```


## License
MIT


[npm-url]: https://npmjs.org/package/gulp-seajs-concat
[npm-image]: http://img.shields.io/npm/v/gulp-seajs-concat.svg
[travis-url]: https://travis-ci.org/whxaxes/gulp-seajs-concat
[travis-image]: http://img.shields.io/travis/whxaxes/gulp-seajs-concat.svg
[coveralls-url]: https://coveralls.io/r/whxaxes/gulp-seajs-concat
[coveralls-image]: https://coveralls.io/repos/github/whxaxes/gulp-seajs-concat/badge.svg