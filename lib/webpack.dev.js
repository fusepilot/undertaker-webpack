import webpack from 'webpack'
import { join } from 'path'
import HTMLWebpackPlugin from 'html-webpack-plugin'

export default function({path, entryFile, outputPath}) {
  const prod = require('./webpack.prod.js')({path, entryFile, outputPath})

  return {
    devtool: 'eval',
    debug: true,
    entry: [
      'webpack-dev-server/client?http://localhost:3000',
      'webpack/hot/only-dev-server',
      'babel-polyfill',
      entryFile,
    ],
    resolve: { ...prod.resolve },
    output: { ...prod.output },
    module: { ...prod.module },

    plugins: [
      new HTMLWebpackPlugin(),
      new webpack.WatchIgnorePlugin([outputPath]),
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoErrorsPlugin(),
      new webpack.DefinePlugin(
        {
          'process.env': {
            'NODE_ENV': JSON.stringify('development'),
          },
        },
      ),
    ],
  }
}
