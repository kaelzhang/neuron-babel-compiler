'use strict'

module.exports = compile

const babel = require('babel-core')
const set = require('set-options')
const babylon = require('babylon')

const DEFAULT_BABYLON_OPTIONS = {
  allowImportExportEverywhere: false,
  allowReturnOutsideFunction: false,
  sourceType: 'module'
}

const DEFAULT_BABEL_OPTIONS = {
  plugins: [
    ['transform-es2015-modules-commonjs', {
      loose: true
    }]
  ]
}


function compile (code, options, callback) {
  let babylonOptions = set(options, DEFAULT_BABYLON_OPTIONS)

  // module-walker will always pass options.filename
  babylonOptions.sourceFilename = babylonOptions.filename
  delete babylonOptions.filename

  let ast = options.ast || babylon.parse(code, babylonOptions)

  let babelOptions = set({}, DEFAULT_BABEL_OPTIONS)
  babelOptions.filename = options.filename

  let inputSouceMap = options.map
  delete options.map

  if (inputSouceMap) {
    babelOptions.inputSouceMap = inputSouceMap
  }

  babelOptions.ast = true
  babelOptions.code = true
  babelOptions.sourceMaps = true

  let result

  try {
    result = babel.transformFromAst(ast, code, babelOptions)
  } catch (e) {
    return callback(e)
  }

  code = result.code
  ast = result.ast

  callback(null, {
    // TODO: neuron initialization
    code,
    ast,
    map: result.map,
    js: true
  })
}
