
const test = require('tape')
const { readdirSync, readFileSync } = require('fs')
const transform = require('babel-core').transformFileSync
const path = require('path')

const fixtures = path.join(__dirname, 'fixtures') 

readdirSync(fixtures).forEach(check => {
  test(check, t => {
    t.plan(1)
    
    const actual = transform(path.join(fixtures, check, 'actual.js'), {
      babelrc: false,
      plugins: [ path.join(__dirname, '../index.js') ]
    }).code
    
    const expected = readFileSync(path.join(fixtures, check, 'expected.js')).toString()

    t.is(actual.trim(), expected.trim(), 'got expected output')
  })
})
