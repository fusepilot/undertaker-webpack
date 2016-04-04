import { sep, join } from 'path'
import vfs from 'vinyl-fs'
import webpackStream from 'gulp-webpack'
import mustache from 'gulp-mustache'
import rename from 'gulp-rename'
import { defaultsDeep } from 'lodash'
import WebpackDevServer from 'webpack-dev-server'

export const webpack = webpackStream.webpack

import DefaultRegistery from 'undertaker-registry'

export default class WebpackRegistery extends DefaultRegistery {
  constructor({prefix, config, htmlFile, templateValues, path, entryFile, outputPath, port=3000}={}) {
    super()

    config = require(join(__dirname, 'lib', 'webpack.config.js'))({webpack, path, htmlFile, entryFile, outputPath, ...config})

    Object.assign(this, {prefix, config, templateValues, path, entryFile, outputPath, port})
  }

  init(taker) {
    taker.task(`${this.prefix}:webpack`, () => {
      return vfs.src(this.entryFile)
        .pipe(webpackStream(this.config))
        .pipe(vfs.dest(this.outputPath))
    })
    //
    // taker.task(`${this.prefix}:html`, () => {
    //   return vfs.src(this.htmlFile)
    //     .pipe(mustache({
    //       ...this.templateValues,
    //       bundlePath: process.env.NODE_ENV == 'production' ? 'index.js' : '/index.js',
    //     }))
    //     .pipe(rename('index.html'))
    //     .pipe(vfs.dest(this.outputPath))
    // })

    taker.task(`${this.prefix}:server`, () => {
      const webpackCompiler = webpack(this.config)

      new WebpackDevServer(webpackCompiler, {
        contentBase: this.config.output.path,
        hot: true,
        quiet: true,
      }).listen(this.port, 'localhost', (err) => {
        if (err) {
          console.error(err)
        } else {
          console.log(`🌎  http://localhost:${this.port}`);
        }
      })
    })

    taker.task(this.prefix, taker.parallel(`${this.prefix}:webpack`))
  }
}
