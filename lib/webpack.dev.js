'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = function (_ref) {
  var path = _ref.path;
  var entryFile = _ref.entryFile;
  var outputPath = _ref.outputPath;

  var prod = require('./webpack.prod.js')({ path: path, entryFile: entryFile, outputPath: outputPath });

  return {
    devtool: 'eval',
    debug: true,
    entry: ['webpack-dev-server/client?http://localhost:3000', 'webpack/hot/only-dev-server', 'babel-polyfill', entryFile],
    resolve: _extends({}, prod.resolve),
    output: _extends({}, prod.output),
    module: _extends({}, prod.module),

    plugins: [new _htmlWebpackPlugin2.default(), new _webpack2.default.WatchIgnorePlugin([outputPath]), new _webpack2.default.HotModuleReplacementPlugin(), new _webpack2.default.NoErrorsPlugin(), new _webpack2.default.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('development')
      }
    })]
  };
};

var _webpack = require('webpack');

var _webpack2 = _interopRequireDefault(_webpack);

var _path = require('path');

var _htmlWebpackPlugin = require('html-webpack-plugin');

var _htmlWebpackPlugin2 = _interopRequireDefault(_htmlWebpackPlugin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = exports['default'];