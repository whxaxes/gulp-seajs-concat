var through = require("through2");
var url = require('url');

module.exports = function (reg) {
    var denps = {};
    var _transform = function (file, enc, cb) {
        if (!file || !file.contents) {
            return cb();
        }

        var filepath = url.format(file.path);
        denps[filepath] = file;
        denps[filepath].caculateContents = new Buffer(file.contents.length);
        file.contents.copy(denps[filepath].caculateContents)

        var fileString = file.contents.toString();
        if (/(\[.*?\])/.test(fileString)) {
            var arr = RegExp.$1.match(/".*?"/g) || [];

            for (var i = 0; i < arr.length; i++) {
                arr[i] = arr[i].replace(/"/g, '');
                var childpath = url.resolve(filepath, arr[i].indexOf(".js") >= 0 ? arr[i] : arr[i] + ".js")
                denps[filepath].childs = denps[filepath].childs || [];
                denps[filepath].childs.push(childpath)
            }
        }

        cb();
    };

    var _flush = function (cb) {
        var contents = [], pathArr = [], size = 0;

        for (var filepath in denps) {
            if (reg && (reg instanceof RegExp) && !filepath.match(reg)) continue;

            var f = denps[filepath];
            contents.length = pathArr.length = size = 0;
            each(f);
            f.contents = Buffer.concat(contents, size);
            this.push(f);
        }

        function each(file) {
            if (!file)return;

            if (pathArr.indexOf(file.path) === -1) {
                pathArr.push(file.path)
                contents.push(file.caculateContents);
                size += file.caculateContents.length;
            }
            if (file.childs) {
                file.childs.forEach(function (fc) {
                    each(denps[fc])
                });
            }
        }

        cb();
    };

    return through.obj(_transform, _flush);
}
