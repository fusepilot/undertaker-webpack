'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (_ref) {
  var path = _ref.path;
  var entryFile = _ref.entryFile;
  var outputPath = _ref.outputPath;

  return {
    entry: ['babel-polyfill', entryFile],
    resolve: {
      modulesDirectories: ['node_modules', 'shared'],
      extensions: ['', '.js', '.jsx']
    },
    // fallback: [config.libPath],
    output: {
      path: outputPath,
      filename: 'index-[hash:6].js'
    },
    module: {
      loaders: [{
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
      }]
    },

    plugins: [new _webpack2.default.optimize.OccurenceOrderPlugin(), new _htmlWebpackPlugin2.default({
      // template: 'app/index.tpl.html',
      // inject: 'body',
      // filename: 'index.html',
    }), new _extractTextWebpackPlugin2.default('[name]-[hash].min.css'), new _webpack2.default.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
        screw_ie8: true
      }
    }), new _webpack2.default.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    })]
  };
};

var _webpack = require('webpack');

var _webpack2 = _interopRequireDefault(_webpack);

var _path = require('path');

var _htmlWebpackPlugin = require('html-webpack-plugin');

var _htmlWebpackPlugin2 = _interopRequireDefault(_htmlWebpackPlugin);

var _extractTextWebpackPlugin = require('extract-text-webpack-plugin');

var _extractTextWebpackPlugin2 = _interopRequireDefault(_extractTextWebpackPlugin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = exports['default'];