
'use strict';

define(function(require, exports, module) {
  var b = require('../module/b');
  var d = require('../module/d/d.js');
  var e = require('e');

  b();
  d();
  e();
});