import { sep, join } from 'path'
import vfs from 'vinyl-fs'
import webpackStream from 'gulp-webpack'
import mustache from 'gulp-mustache'
import rename from 'gulp-rename'
import { isString, defaultsDeep } from 'lodash'
import WebpackDevServer from 'webpack-dev-server'

export const webpack = webpackStream.webpack

import DefaultRegistery from 'undertaker-registry'

export default class WebpackRegistery extends DefaultRegistery {
  constructor({prefix, config, htmlFile=true, configTemplate='base', custom=false, templateValues, path, entryFile, outputPath, port=3000}={}) {
    super()

    if (configTemplate) {
      config = require(join(__dirname, `webpack.${configTemplate}.js`))({templateValues, webpack, path, htmlFile, entryFile, outputPath, ...config})
    } else {
      config = require(join(__dirname, 'webpack.config.js'))({templateValues, webpack, path, htmlFile, entryFile, outputPath, ...config})
    }

    Object.assign(this, {prefix, config, templateValues, custom, path, htmlFile, entryFile, outputPath, port})
  }

  init(taker) {
    taker.task(`${this.prefix}:webpack`, () => {
      return vfs.src(this.entryFile)
        .pipe(webpackStream(this.config))
        .pipe(vfs.dest(this.outputPath))
    })

    if (isString(this.htmlFile)) {
      taker.task(`${this.prefix}:html`, () => {
        return vfs.src(this.htmlFile)
          .pipe(mustache({
            bundlePath: this.config.output.filename,
            host: `http://localhost:${this.port}`,
            ...this.templateValues,
          }))
          .pipe(rename('index.html'))
          .pipe(vfs.dest(this.outputPath))
      })
    }

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

    if (isString(this.htmlFile)) {
      return taker.task(this.prefix, taker.parallel(`${this.prefix}:webpack`, `${this.prefix}:html`))
    } else {
      return taker.task(this.prefix, taker.series(`${this.prefix}:webpack`))
    }
  }
}
