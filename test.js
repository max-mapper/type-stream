var test = require('tape')
var concat = require('concat-stream')
var typeStream = require('./')

var csv = new Buffer('a,b,c\n1,2,3')
var json = new Buffer('{"hello": "world"}')

var csvDetector = function(buf) {
  var str = buf.toString()
  if (str.indexOf(',') > -1 && str.indexOf('\n') > -1) return 'csv'
}

var jsonDetector = function(buf) {
  var str = buf.toString()
  if (str[0] === '{' && str[str.length - 1] === '}') return 'json'
}

var detectors = [csvDetector, jsonDetector]

test('passes through all data', function(t) {
  var detector = typeStream([], function noop(t){ })
  detector.pipe(concat(function(data) {
    t.equal(data.toString(), 'helloworld')
    t.end()
  }))
  detector.write(new Buffer('hello'))
  detector.write(new Buffer('world'))
  detector.end()
})

test('csv detection', function(t) {
  var detector = typeStream(detectors, detected)
  detector.write(csv)
  detector.end()
  function detected(type) {
    t.equal(type, 'csv')
    t.end()
  }
})

test('json detection (same detector order)', function(t) {
  var detector = typeStream(detectors, detected)
  detector.write(json)
  detector.end()
  function detected(type) {
    t.equal(type, 'json')
    t.end()
  }
})
