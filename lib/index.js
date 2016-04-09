'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.webpack = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _path = require('path');

var _vinylFs = require('vinyl-fs');

var _vinylFs2 = _interopRequireDefault(_vinylFs);

var _gulpWebpack = require('gulp-webpack');

var _gulpWebpack2 = _interopRequireDefault(_gulpWebpack);

var _gulpMustache = require('gulp-mustache');

var _gulpMustache2 = _interopRequireDefault(_gulpMustache);

var _gulpRename = require('gulp-rename');

var _gulpRename2 = _interopRequireDefault(_gulpRename);

var _lodash = require('lodash');

var _webpackDevServer = require('webpack-dev-server');

var _webpackDevServer2 = _interopRequireDefault(_webpackDevServer);

var _undertakerRegistry = require('undertaker-registry');

var _undertakerRegistry2 = _interopRequireDefault(_undertakerRegistry);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var webpack = exports.webpack = _gulpWebpack2.default.webpack;

var WebpackRegistery = function (_DefaultRegistery) {
  _inherits(WebpackRegistery, _DefaultRegistery);

  function WebpackRegistery() {
    var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    var prefix = _ref.prefix;
    var config = _ref.config;
    var _ref$htmlFile = _ref.htmlFile;
    var htmlFile = _ref$htmlFile === undefined ? true : _ref$htmlFile;
    var _ref$custom = _ref.custom;
    var custom = _ref$custom === undefined ? false : _ref$custom;
    var templateValues = _ref.templateValues;
    var path = _ref.path;
    var entryFile = _ref.entryFile;
    var outputPath = _ref.outputPath;
    var _ref$port = _ref.port;
    var port = _ref$port === undefined ? 3000 : _ref$port;

    _classCallCheck(this, WebpackRegistery);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(WebpackRegistery).call(this));

    if (custom) {
      config = require((0, _path.join)(__dirname, 'webpack.base.js'))(_extends({ templateValues: templateValues, webpack: webpack, path: path, htmlFile: htmlFile, entryFile: entryFile, outputPath: outputPath }, config));
    } else {
      config = require((0, _path.join)(__dirname, 'webpack.config.js'))(_extends({ templateValues: templateValues, webpack: webpack, path: path, htmlFile: htmlFile, entryFile: entryFile, outputPath: outputPath }, config));
    }

    Object.assign(_this, { prefix: prefix, config: config, templateValues: templateValues, custom: custom, path: path, htmlFile: htmlFile, entryFile: entryFile, outputPath: outputPath, port: port });
    return _this;
  }

  _createClass(WebpackRegistery, [{
    key: 'init',
    value: function init(taker) {
      var _this2 = this;

      taker.task(this.prefix + ':webpack', function () {
        return _vinylFs2.default.src(_this2.entryFile).pipe((0, _gulpWebpack2.default)(_this2.config)).pipe(_vinylFs2.default.dest(_this2.outputPath));
      });

      if ((0, _lodash.isString)(this.htmlFile)) {
        taker.task(this.prefix + ':html', function () {
          return _vinylFs2.default.src(_this2.htmlFile).pipe((0, _gulpMustache2.default)(_extends({
            bundlePath: _this2.config.output.filename,
            host: 'http://localhost:' + _this2.port
          }, _this2.templateValues))).pipe((0, _gulpRename2.default)('index.html')).pipe(_vinylFs2.default.dest(_this2.outputPath));
        });
      }

      taker.task(this.prefix + ':server', function () {
        var webpackCompiler = webpack(_this2.config);

        new _webpackDevServer2.default(webpackCompiler, {
          contentBase: _this2.config.output.path,
          hot: true,
          quiet: true
        }).listen(_this2.port, 'localhost', function (err) {
          if (err) {
            console.error(err);
          } else {
            console.log('🌎  http://localhost:' + _this2.port);
          }
        });
      });

      if ((0, _lodash.isString)(this.htmlFile)) {
        return taker.task(this.prefix, taker.parallel(this.prefix + ':webpack', this.prefix + ':html'));
      } else {
        return taker.task(this.prefix, taker.series(this.prefix + ':webpack'));
      }
    }
  }]);

  return WebpackRegistery;
}(_undertakerRegistry2.default);

exports.default = WebpackRegistery;