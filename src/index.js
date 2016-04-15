const { sep, join } = require('path')
const vfs = require('vinyl-fs')
const webpackStream = require('gulp-webpack')
const mustache = require('gulp-mustache')
const rename = require('gulp-rename')
const { isString, defaultsDeep } = require('lodash')
const WebpackDevServer = require('webpack-dev-server')

const webpack = webpackStream.webpack
const DefaultRegistery = require('undertaker-registry')

function skip(condition, fn){
  if (!condition) {
    return fn
  }

  function skipped(cb){
    cb()
  }

  let displayName
  if (isString(fn)) {
    displayName = fn
  } else {
    displayName = (fn.name || fn.displayName)
  }

  skipped.displayName = `${displayName} (skipped)`
  return skipped
}

module.exports = class WebpackRegistery extends DefaultRegistery {
  constructor({prefix, config, htmlFile=true, configTemplate='base', custom=false, templateValues, path, entryFile, outputPath, port=3000}={}) {
    super()

    let args = Object.assign({templateValues, webpack, path, htmlFile, entryFile, outputPath}, config)

    if (configTemplate) {
      config = require(join(__dirname, `webpack.${configTemplate}.js`))(args)
    } else {
      config = require(join(__dirname, 'webpack.config.js'))(args)
    }

    Object.assign(this, {prefix, config, templateValues, custom, path, htmlFile, entryFile, outputPath, port})
  }

  init(taker) {
    ['', ':production'].map((env) => {
      const config = this.config

      if (env != ':production') {
        config.watch = true
      }

      taker.task(`${this.prefix}:webpack${env}`, () => {
        return vfs.src(this.entryFile)
          .pipe(webpackStream(config))
          .pipe(vfs.dest(this.outputPath))
      })

      taker.task(`${this.prefix}:html${env}`, () => {
        return vfs.src(this.htmlFile)
          .pipe(mustache(Object.assign({
            bundlePath: config.output.filename,
            host: `http://localhost:${this.port}`,
          }, this.templateValues)))
          .pipe(rename('index.html'))
          .pipe(vfs.dest(this.outputPath))
      })

      taker.task(`${this.prefix}:server${env}`, () => {
        const webpackCompiler = webpack(config)

        new WebpackDevServer(webpackCompiler, {
          contentBase: config.output.path,
          hot: true,
          quiet: true,
        }).listen(this.port, 'localhost', (err) => {
          if (err) {
            console.error(err)
          } else {
            console.log(`🌎  http://localhost:${this.port}`)
          }
        })
      })

      return taker.task(`${this.prefix}${env}`, taker.parallel(`${this.prefix}:webpack${env}`, skip(!isString(this.htmlFile), `${this.prefix}:html${env}`)))
    })
  }
}

module.exports.webpack = webpack
