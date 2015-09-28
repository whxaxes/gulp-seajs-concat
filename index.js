var through = require("through2");
var url = require('url');
var path = require("path");

module.exports = function(options) {
  var denps = {};

  var type = Object.prototype.toString.call(options);

  var alias = options.alias || {};
  var filter = options.filter;
  var base = options.base || "";

  // 兼容旧版本
  if(type === "[object RegExp]"){
    filter = options;
  }

  /**
   * 收集js文件信息
   */
  var _transform = function(file, enc, cb) {
    if (!file || !file.contents) {
      return cb();
    }

    var filepath = url.format(file.path);
    denps[filepath] = file;

    // 复制文件数据
    file.caculateContents = new Buffer(file.contents.length);
    file.contents.copy(file.caculateContents);
    
    file.children = [];

    var fileString = file.contents.toString();
    if (/(\[.*?\])/.test(fileString)) {
      var arr = RegExp.$1.match(/".*?"/g) || [];

      arr.forEach(function(item, i){
        var jsurl = item.replace(/"/g, '');

        // 如果有别名，则查询别名
        if(alias){
          jsurl = alias[jsurl] || jsurl;
        }

        // 自动补全后缀
        jsurl = jsurl.indexOf(".js") >= 0 ? jsurl : jsurl + ".js";

        // 如果有基本目录，则与基本目录结合
        if (base && jsurl.charAt(0) !== ".") {
          jsurl = base + ((base.charAt(base.length) === "/") ? "" : "/") + jsurl;
          jsurl = path.resolve('', jsurl);
        } else {
          jsurl = path.resolve(path.dirname(filepath), jsurl);
        }

        file.children.push(jsurl);
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
      file = null,
      size = 0;

    for (var filepath in denps) {
      if (filter && (filter instanceof RegExp) && !filepath.match(filter)) continue;

      contents.length = pathArr.length = size = 0;

      each(file = denps[filepath]);

      file.contents = Buffer.concat(contents, size);
      this.push(file);
    }

    function each(file) {
      if (!file) return;

      if (pathArr.indexOf(file.path) < 0) {
        pathArr.push(file.path);
        contents.push(file.caculateContents);
        size += file.caculateContents.length;
      }

      if (file.children) {
        file.children.forEach(function(fc) {
          each(denps[fc])
        });
      }
    }

    cb();
  };

  return through.obj(_transform, _flush);
}