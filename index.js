import { sep, join } from 'path'
import WebpackDevServer from 'webpack-dev-server'

import DefaultRegistery from 'undertaker-registry'

export default class WebpackServerRegistery extends DefaultRegistery {
  constructor({webpack, webpackConfig, config, port=3000}={}) {
    super()
    this.config = {
      webpack,
      webpackConfig,
      port,
    }
  }

  init(taker) {
    taker.task('server', () => {
      const webpackCompiler = this.config.webpack(this.config.webpackConfig)

      new WebpackDevServer(webpackCompiler, {
        contentBase: this.config.webpackConfig.output.path,
        hot: true,
        quiet: true,
      }).listen(this.config.port, 'localhost', (err) => {
        if (err) {
          console.error(err)
        } else {
          console.log(`🌎  http://localhost:${this.config.port}`);
        }
      })
    })
  }
}
