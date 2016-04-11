var through = require("through2");
var fs = require('fs');
var url = require('url');
var path = require("path");

module.exports = function(options) {
  var denps = {};

  options = options || {};

  var type = Object.prototype.toString.call(options);

  var alias = options.alias || {};
  var filter = options.filter;
  var base = options.base || "";

  /**
   * 收集js文件信息
   */
  var _transform = function(file, enc, cb) {
    if (!file || !file.contents) {
      return cb();
    }

    var filePath = url.format(file.path);

    // 为了兼容windows下的盘符大小写问题，统一转为小写
    denps[filePath.toLowerCase()] = file;

    // 复制文件数据
    file.caculateContents = new Buffer(file.contents.length);
    file.contents.copy(file.caculateContents);

    file.children = [];

    var fileString = file.contents.toString();

    // 符合transport后seajs格式的js文件才进行依赖检测
    if (/(\[.*?\])/.test(fileString)) {
      var arr = RegExp.$1.match(/".*?"/g) || [];

      arr.forEach(function(item, i) {
        var jsurl = item.replace(/"/g, '');

        // 如果有别名，则查询别名
        if (alias) {
          jsurl = alias[jsurl] || jsurl;
        }

        // 自动补全后缀
        jsurl += path.extname(jsurl) === '.js'
          ? ''
          : '.js';

        // 如果有基本目录，则与基本目录结合
        if (base && jsurl.charAt(0) !== ".") {
          jsurl = path.resolve('', path.join(base, jsurl));
        } else {
          jsurl = path.resolve(path.dirname(filePath), jsurl);
        }

        // 此处将路径转换为gulp的路径格式，即统一用/
        file.children.push(jsurl.replace(/\/|\\/g, "/").toLowerCase());
      });

    }

    cb();
  };

  /**
   * 合并文件
   */
  var _flush = function(cb) {
    var contents = [],
      pathArr = [],
      size = 0,
      self = this;

    var cont;

    // 遍历需要合并的文件并且合并
    Object.keys(denps).forEach(function(filePath){
      if (filter && (filter instanceof RegExp) && !filePath.match(filter)) return;

      var file = denps[filePath];

      contents.length = pathArr.length = size = 0;

      combine(file);

      file.contents = Buffer.concat(contents, size);

      self.push(file);
    });

    /**
     * 合并文件
     * @param file
     */
    function combine(file) {
      if (!file) return;

      if (pathArr.indexOf(file.path) < 0) {
        pathArr.push(file.path);

        if (file.caculateContents) {
          cont = file.caculateContents
        } else {
          return;
        }

        contents.push(cont);

        size += cont.length;
      }

      if (file.children) {
        // 遍历依赖文件并且合并
        file.children.forEach(function(fc) {
          combine(denps[fc] || {path: fc});
        });
      }
    }

    cb();
  };

  return through.obj(_transform, _flush);
}