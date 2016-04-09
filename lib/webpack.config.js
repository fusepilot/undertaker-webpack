'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = function (_ref) {
  var templateValues = _ref.templateValues;
  var webpack = _ref.webpack;
  var _ref$resolveLoader = _ref.resolveLoader;
  var resolveLoader = _ref$resolveLoader === undefined ? {} : _ref$resolveLoader;
  var _ref$entry = _ref.entry;
  var entry = _ref$entry === undefined ? [] : _ref$entry;
  var _ref$output = _ref.output;
  var output = _ref$output === undefined ? {} : _ref$output;
  var _ref$resolve = _ref.resolve;
  var resolve = _ref$resolve === undefined ? {} : _ref$resolve;
  var _ref$plugins = _ref.plugins;
  var plugins = _ref$plugins === undefined ? [] : _ref$plugins;
  var _ref$loaders = _ref.loaders;
  var loaders = _ref$loaders === undefined ? [] : _ref$loaders;
  var path = _ref.path;
  var _ref$htmlFile = _ref.htmlFile;
  var htmlFile = _ref$htmlFile === undefined ? true : _ref$htmlFile;
  var entryFile = _ref.entryFile;
  var outputPath = _ref.outputPath;

  var config = _objectWithoutProperties(_ref, ['templateValues', 'webpack', 'resolveLoader', 'entry', 'output', 'resolve', 'plugins', 'loaders', 'path', 'htmlFile', 'entryFile', 'outputPath']);

  entry = (0, _deepmerge2.default)(['babel-polyfill', entryFile], entry);

  output = (0, _deepmerge2.default)({
    path: outputPath,
    filename: 'index-[hash:6].js'
  }, output);

  resolve = (0, _deepmerge2.default)({
    root: [(0, _path.join)(__dirname, '..', 'node_modules'), (0, _path.join)(process.cwd(), 'node_modules')],
    modulesDirectories: [(0, _path.join)(__dirname, '..', 'node_modules'), (0, _path.join)(process.cwd(), 'node_modules')],
    extensions: ['', '.js', '.jsx']
  }, resolve);

  resolveLoader = (0, _deepmerge2.default)({
    modulesDirectories: [(0, _path.join)(__dirname, '..', 'node_modules'), (0, _path.join)(process.cwd(), 'node_modules')]
  }, resolveLoader);

  loaders = [{
    test: /\.jsx?$/,
    exclude: /(node_modules|bower_components)/,
    loader: 'babel-loader'
  }, {
    test: /\.coffee$/,
    exclude: /(node_modules|bower_components)/,
    loader: 'coffee-loader'
  }, { test: /\.eot$/, loader: 'file-loader' }, { test: /\.svg$/, loader: 'url-loader?limit=10000&mimetype=image/svg+xml' }, { test: /\.ttf$/, loader: 'url-loader?limit=10000&mimetype=application/octet-stream' }, { test: /\.json$/, loader: 'json-loader' }, { test: /\.css$/, loader: 'css-loader' }, {
    test: /\.(png|jpg|jpeg|gif|svg)$/,
    loader: 'file-loader',
    query: {
      name: '[name]-[hash:6].[ext]'
    }
  }].concat(_toConsumableArray(loaders));

  if (process.env.NODE_ENV == 'production') {
    plugins = [new webpack.optimize.OccurenceOrderPlugin(), new _extractTextWebpackPlugin2.default('[name]-[hash].min.css'), new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
        screw_ie8: true
      }
    })].concat(_toConsumableArray(plugins));
  } else {
    config.devtool = 'eval';
    config.debug = true;
    entry = ['webpack-dev-server/client?http://localhost:3000', 'webpack/hot/only-dev-server'].concat(_toConsumableArray(entry));

    plugins = [new webpack.WatchIgnorePlugin([outputPath]), new webpack.HotModuleReplacementPlugin(), new webpack.NoErrorsPlugin()].concat(_toConsumableArray(plugins));
  }

  plugins = [].concat(_toConsumableArray(plugins), [new webpack.DefinePlugin({
    'process.env': {
      'NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    }
  })]);

  if ((0, _lodash.isBoolean)(htmlFile)) {
    plugins = [new _htmlWebpackPlugin2.default({
      title: templateValues.title
    })].concat(_toConsumableArray(plugins));
  }

  return _extends({
    entry: entry,
    // watch: true,
    output: output,
    resolve: resolve,
    resolveLoader: resolveLoader,
    module: {
      loaders: loaders
    },
    plugins: plugins
  }, config);
};

var _path = require('path');

var _htmlWebpackPlugin = require('html-webpack-plugin');

var _htmlWebpackPlugin2 = _interopRequireDefault(_htmlWebpackPlugin);

var _extractTextWebpackPlugin = require('extract-text-webpack-plugin');

var _extractTextWebpackPlugin2 = _interopRequireDefault(_extractTextWebpackPlugin);

var _lodash = require('lodash');

var _deepmerge = require('deepmerge');

var _deepmerge2 = _interopRequireDefault(_deepmerge);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

module.exports = exports['default'];