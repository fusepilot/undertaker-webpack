import webpack from 'webpack'
import { join } from 'path'
import HTMLWebpackPlugin from 'html-webpack-plugin'
import ExtractTextPlugin from 'extract-text-webpack-plugin'

export default function({path, entryFile, outputPath}) {
  return {
    entry: [
      'babel-polyfill',
      entryFile,
    ],
    resolve: {
      modulesDirectories: ['node_modules', 'shared'],
      extensions: ['', '.js', '.jsx'],
      // fallback: [config.libPath],
    },
    output: {
      path: outputPath,
      filename: 'index-[hash:6].js',
    },
    module: {
      loaders: [
        {
          test:    /\.jsx?$/,
          exclude: /(node_modules|bower_components)/,
          loader:  'babel-loader',
        },
        {
          test: /\.coffee$/,
          exclude: /(node_modules|bower_components)/,
          loader: 'coffee-loader',
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
      ],
    },

    plugins: [
      new webpack.optimize.OccurenceOrderPlugin(),
      new HTMLWebpackPlugin({
        // template: 'app/index.tpl.html',
        // inject: 'body',
        // filename: 'index.html',
      }),
      new ExtractTextPlugin('[name]-[hash].min.css'),
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false,
          screw_ie8: true,
        },
      }),
      new webpack.DefinePlugin(
        {
          'process.env': {
            'NODE_ENV': JSON.stringify('production'),
            // 'CONFIG': JSON.stringify(config),
          },
        },
      ),
    ],
  }
}
