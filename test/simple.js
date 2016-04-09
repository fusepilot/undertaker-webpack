import { expect } from 'chai'
import { join } from 'path'
import Undertaker from 'undertaker'
import WebpackRegistery from '../src'

const config = {
  prefix: 'simple',
  path: join(__dirname, 'simple'),
  entryFile: join(__dirname, 'simple', 'index.js'),
  outputPath: join(__dirname, 'simple', 'build'),
  templateValues: {title: 'Simple'},
  htmlFile: join(__dirname, 'simple', 'index.html'),
  config: {
    output: {
      filename: 'index.js',
    },
  },
}

describe('simple', function() {
  before(function() {
    this.taker = new Undertaker()
    this.registry = new WebpackRegistery(config)
  })

  it('adds tasks', function() {
    this.taker.registry(this.registry)
    const tasks = this.taker.tree().nodes
    expect(tasks).to.include('simple')
    expect(tasks).to.include('simple:webpack')
    expect(tasks).to.include('simple:server')
    expect(tasks).to.include('simple:html')
  })

  it('loads config', function() {
    expect(this.registry.config.entry).to.include(config.entryFile)
    expect(this.registry.config.output.path).to.equal(config.outputPath)
    expect(this.registry.config.output.filename).to.equal(config.config.output.filename)
  })
})
