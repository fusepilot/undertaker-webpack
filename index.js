import { sep, join } from 'path'
import vfs from 'vinyl-fs'
import webpack from 'gulp-webpack'
import mustache from 'gulp-mustache'
import rename from 'gulp-rename'
import { defaultsDeep } from 'lodash'
import WebpackDevServer from 'webpack-dev-server'

import DefaultRegistery from 'undertaker-registry'

export function getWebpackConfig({path, entryFile, outputPath}) {
  if (process.env.NODE_ENV == 'production') {
    return require(join(__dirname, 'lib', 'webpack.prod.js'))({path, entryFile, outputPath})
  } else {
    return require(join(__dirname, 'lib', 'webpack.dev.js'))({path, entryFile, outputPath})
  }
}

export default class WebpackRegistery extends DefaultRegistery {
  constructor({prefix, configMerge, config, templateValues, path, htmlFile, entryFile, outputPath, port=3000}={}) {
    super()

    config = config || getWebpackConfig({path, entryFile, outputPath})

    const {loaders, plugins, ...rest} = configMerge
    config.plugins = [...config.plugins, ...plugins]

    config.module = {
      ...config.module,
      ...{loaders: [
        ...config.module.loaders,
        ...loaders,
      ]}
    }

    // merge rest
    config = defaultsDeep(config, rest)

    Object.assign(this, {prefix, config, templateValues, htmlFile, path, entryFile, outputPath, port})
  }

  init(taker) {
    taker.task(`${this.prefix}:webpack`, () => {
      return vfs.src(this.entryFile)
        .pipe(webpack(this.config))
        .pipe(vfs.dest(this.outputPath))
    })

    taker.task(`${this.prefix}:html`, () => {
      return vfs.src(this.htmlFile)
        .pipe(mustache({
          ...this.templateValues,
          bundlePath: process.env.NODE_ENV == 'production' ? 'index.js' : '/index.js',
        }))
        .pipe(rename('index.html'))
        .pipe(vfs.dest(this.outputPath))
    })

    taker.task(`${this.prefix}:server`, () => {
      const webpackCompiler = webpack.webpack(this.config)

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

    taker.task(this.prefix, taker.parallel(`${this.prefix}:webpack`, `${this.prefix}:html`))
  }
}
