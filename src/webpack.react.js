import { join } from 'path'
import HTMLWebpackPlugin from 'html-webpack-plugin'
import ExtractTextPlugin from 'extract-text-webpack-plugin'
import { defaultsDeep, isBoolean } from 'lodash'
import merge from 'deepmerge'

export default function({templateValues, webpack, resolveLoader={}, entry=[], output={}, resolve={}, plugins=[], loaders=[], path, htmlFile=true, entryFile, outputPath, ...config}) {
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
    ...loaders,
  ]

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
      ...plugins,
    ]
  } else {
    config.devtool = 'eval'
    config.debug = true
    entry = [
      'webpack-dev-server/client?http://localhost:3000',
      'webpack/hot/only-dev-server',
      ...entry,
    ]

    plugins = [
      new webpack.WatchIgnorePlugin([outputPath]),
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoErrorsPlugin(),
      ...plugins,
    ]
  }

  plugins = [
    ...plugins,

    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      },
    }),
  ]

  if (isBoolean(htmlFile)) {
    plugins = [
      new HTMLWebpackPlugin({
        title: templateValues.title,
        // template: 'app/index.tpl.html',
        // inject: 'body',
        // filename: 'index.html',
      }),
      ...plugins,
    ]
  }

  return {
    entry,
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
