'use strict'

module.exports = compile

const babel = require('babel-core')
const set = require('set-options')

const DEFAULT_OPTIONS = {
  allowReturnOutsideFunction: true
}

function compile (code, options, callback) {
  options = set(options, DEFAULT_OPTIONS)

  let ast = options.ast || babylon.parse(code, options)
  let map

  try {
    {
      code,
      ast,
      map
    } = babel.transformFromAst(ast, content, {
      plugins: [
        ['transform-es2015-modules-commonjs', {
          loose: true
        }]
      ]
    })
  } catch (e) {
    return callback(e)
  }

  callback(null, {
    // TODO: neuron initialization
    code,
    ast,
    map
  })
}
