var concat = require("../");
var vfs = require("vinyl-fs");
var assert = require('assert');
var expect = require('chai').expect;
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
        expect(getMatcher('test1', 'a')).to.have.length(2);
        expect(getMatcher('test1', 'c')).to.have.length(2);
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
        expect(getMatcher('test2', 'a')).to.have.length(3);
        expect(getMatcher('test2', 'c')).to.be.empty;
        done();
      });
  });

});

function getMatcher(dir, filename){
  return fs.readFileSync(__dirname + '/dist/' + dir + '/app/' + filename + '.js')
    .toString()
    .match(/i am \w.js/g) || [];
}