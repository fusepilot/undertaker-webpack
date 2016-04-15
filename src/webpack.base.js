const { join } = require('path')
const HTMLWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const { defaultsDeep, isBoolean, omit } = require('lodash')
const merge = require('deepmerge')

module.exports = function(options) {
  let { templateValues, webpack, resolveLoader={}, entry=[], output={}, resolve={}, plugins=[], loaders=[], path, htmlFile=true, entryFile, outputPath } = options
  const config = omit(options, ['templateValues', 'webpack', 'resolveLoader', 'entry', 'output', 'resolve', 'plugins', 'loaders', 'path', 'htmlFile', 'entryFile', 'outputPath'])

  entry = merge([
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

  loaders = loaders.concat([])

  if (process.env.NODE_ENV == 'production') {
    plugins = plugins.concat([])
  } else {
    config.devtool = 'eval'
    config.debug = true
    entry = entry.concat([])
  }

  plugins = plugins.concat([
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      },
    }),
  ])

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
