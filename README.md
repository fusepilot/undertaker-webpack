# undertaker-wepback

[Undertaker](https://www.npmjs.com/package/undertaker) registry for creating [Webpack](https://webpack.github.io) projects.

## Installation

```bash
npm install --save-dev undertaker-wepback
```

## Usage

```javascript
// gulpfile.js

const WebpackRegistery = require('undertaker-webpack')

gulp.registry(new WebpackRegistery({
  prefix: 'ui', // namespace for generated tasks
  path: './src/ui', // path to source files, needed for webpack-dev-server
  entryFile: './src/ui/index.jsx'), // main entry file for webpack
  outputPath: './build/ui'), // output location for compiled files
  configTemplate: 'react', // optional webpack config preset
  config: { // add additional webpack configuration
    loaders: [{
      test: /\.styl$/,
      loader: 'style-loader!css-loader!stylus-loader',
    }],
  }
}))
```

Then run the ui task from Gulp to compile.

```
gulp ui
```

To start up a Webpack Dev Server run:

```
gulp ui:server
```

## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## Todos

* Document advanced functionality.
* Add and document more presets.
* Add tests.

## License

The MIT License (MIT)
