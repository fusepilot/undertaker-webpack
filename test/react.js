import chai, { expect } from 'chai'
import { join } from 'path'
import Undertaker from 'undertaker'
import WebpackRegistery from '../src'

chai.use(require('chai-things'))

const config = {
  prefix: 'react',
  path: join(__dirname, 'react'),
  entryFile: join(__dirname, 'react', 'index.js'),
  outputPath: join(__dirname, 'react', 'build'),
  templateValues: {title: 'React'},
  htmlFile: join(__dirname, 'react', 'index.html'),
  configTemplate: 'react',
  config: {
    output: {
      filename: 'index.js',
    },
  },
}

describe('react', function() {
  before(function() {
    this.taker = new Undertaker()
    this.registry = new WebpackRegistery(config)
  })

  it('adds tasks', function() {
    this.taker.registry(this.registry)
    const tasks = this.taker.tree().nodes

    expect(tasks).to.include('react')
    expect(tasks).to.include('react:webpack')
    expect(tasks).to.include('react:server')
    expect(tasks).to.include('react:html')
  })

  it('loads config', function() {
    expect(this.registry.config.entry).to.include(config.entryFile)
    expect(this.registry.config.output.path).to.equal(config.outputPath)
    expect(this.registry.config.output.filename).to.equal(config.config.output.filename)

    expect(this.registry.config.resolve.extensions).to.include('.jsx')
    expect(this.registry.config.module.loaders).to.include.something.to.have.property('loader', 'babel-loader')
  })
})
