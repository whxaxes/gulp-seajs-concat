var concat = require("../");
var vfs = require("vinyl-fs");
var assert = require('assert');
var transport = require("gulp-seajs-transport");
var fs = require('fs');

describe('test/test.js', function(){

  it('should run without error', function(done){
    vfs.src(__dirname + '/ref/**/*.js')
      .pipe(transport())
      .pipe(concat({
        base: __dirname + "/ref/module",
        filter: /app/
      }))
      .pipe(vfs.dest(__dirname + "/dist/test1"))
      .on('end', function(){
        var matchera = getMatcher('test1', 'a');
        var matcherc =  getMatcher('test1', 'c');

        assert(
          matchera.length === 2,
          'some file is not concat in a.js, matcher is ' + JSON.stringify(matchera)
        );

        assert(
          matcherc.length === 2,
          'some file is not concat in c.js, matcher is ' + JSON.stringify(matcherc)
        );

        done();
      });
  });

  it('should run without error when used alias and no base url', function(done){
    vfs.src(__dirname + '/ref/**/*.js')
      .pipe(transport())
      .pipe(concat({
        alias: {
          e: __dirname + "/ref/module/e/e",
        },
        filter: /app/
      }))
      .pipe(vfs.dest(__dirname + "/dist/test2"))
      .on('end', function(){
        var matchera = getMatcher('test2', 'a');
        var matcherc =  getMatcher('test2', 'c');

        assert(
          matchera.length === 3,
          'some file is not concat in a.js, matcher is ' + JSON.stringify(matchera)
        );

        assert(
          matcherc.length === 0,
          'some file is not concat in c.js, matcher is ' + JSON.stringify(matcherc)
        );

        done();
      });
  });

});

function getMatcher(dir, filename){
  return fs.readFileSync(__dirname + '/dist/' + dir + '/app/' + filename + '.js')
    .toString()
    .match(/i am \w.js/g) || [];
}