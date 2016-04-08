import { join } from 'path'
import HTMLWebpackPlugin from 'html-webpack-plugin'
import ExtractTextPlugin from 'extract-text-webpack-plugin'
import { defaultsDeep, isBoolean } from 'lodash'
import merge from 'deepmerge'

export default function({templateValues, webpack, resolveLoader={}, entry=[], output={}, resolve={}, plugins=[], loaders=[], path, htmlFile=true, entryFile, outputPath, ...config}) {
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


  loaders = [
    ...loaders,
  ]

  if (process.env.NODE_ENV == 'production') {
    plugins = [
      // new webpack.optimize.UglifyJsPlugin({
      //   compress: {
      //     warnings: false,
      //     screw_ie8: true,
      //   },
      // }),
      ...plugins,
    ]
  } else {
    config.devtool = 'eval'
    config.debug = true
    entry = [
      ...entry,
    ]

    // plugins = [
    //   new webpack.WatchIgnorePlugin([outputPath]),
    //   new webpack.NoErrorsPlugin(),
    //   ...plugins,
    // ]
  }

  plugins = [
    ...plugins,

    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      },
    }),
  ]

  return {
    entry,
    // watch: true,
    output,
    resolve,
    resolveLoader,
    module: {
      loaders,
    },
    plugins,
    ...config,
  }
}
