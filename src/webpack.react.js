const { join } = require('path')
const HTMLWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const { defaultsDeep, isBoolean, omit } = require('lodash')
const merge = require('deepmerge')

module.exports = function(options) {
  let { templateValues, webpack, resolveLoader={}, entry=[], output={}, resolve={}, plugins=[], loaders=[], path, htmlFile=true, entryFile, outputPath } = options
  const config = omit(options, ['templateValues', 'webpack', 'resolveLoader', 'entry', 'output', 'resolve', 'plugins', 'loaders', 'path', 'htmlFile', 'entryFile', 'outputPath'])

  entry = merge([
    'babel-polyfill',
    entryFile,
  ], entry)

  output = merge({
    path: outputPath,
    filename: 'index-[hash:6].js'
  }, output)


  resolve = merge({
    root: [join(__dirname, '..', 'node_modules'), join(process.cwd(), 'node_modules')],
    modulesDirectories: [join(__dirname, '..', 'node_modules'), join(process.cwd(), 'node_modules')],
    extensions: ['', '.js', '.jsx'],
  }, resolve)

  resolveLoader = merge({
    modulesDirectories: [join(__dirname, '..', 'node_modules'), join(process.cwd(), 'node_modules')],
  }, resolveLoader)


  loaders = [
    {
      test:    /\.jsx?$/,
      exclude: /(node_modules|bower_components)/,
      loader:  'babel-loader',
    },
    { test: /\.eot$/,  loader: 'file-loader' },
    { test: /\.svg$/,  loader: 'url-loader?limit=10000&mimetype=image/svg+xml' },
    { test: /\.ttf$/,  loader: 'url-loader?limit=10000&mimetype=application/octet-stream' },
    { test: /\.json$/, loader: 'json-loader' },
    { test: /\.css$/, loader: 'css-loader' },
    {
      test: /\.(png|jpg|jpeg|gif|svg)$/,
      loader: 'file-loader',
      query: {
        name: '[name]-[hash:6].[ext]',
      },
    },
  ].concat(loaders)

  if (process.env.NODE_ENV == 'production') {
    plugins = [
      new webpack.optimize.OccurenceOrderPlugin(),
      new ExtractTextPlugin('[name]-[hash].min.css'),
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false,
          screw_ie8: true,
        },
      }),
    ].concat(plugins)
  } else {
    config.devtool = 'eval'
    config.debug = true
    entry = [
      'webpack-dev-server/client?http://localhost:3000',
      'webpack/hot/only-dev-server',
    ].concat(entry)

    plugins = [
      new webpack.WatchIgnorePlugin([outputPath]),
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoErrorsPlugin(),
    ].concat(plugins)
  }

  plugins = plugins.concat([
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      },
    }),
  ])

  if (isBoolean(htmlFile)) {
    plugins = [
      new HTMLWebpackPlugin({
        title: templateValues.title,
        // template: 'app/index.tpl.html',
        // inject: 'body',
        // filename: 'index.html',
      }),
    ].concat(plugins)
  }

  return Object.assign({
    entry,
    output,
    resolve,
    resolveLoader,
    module: {
      loaders,
    },
    plugins,
  }, config)
}
