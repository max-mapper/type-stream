# type-stream

Pluggable passthrough stream for guessing data type based on the first `Buffer` in a stream.

Individual format guessers are outside the scope of this module, but you can use this module to easily hook your own guessers up to a stream.

[![NPM](https://nodei.co/npm/type-stream.png)](https://nodei.co/npm/type-stream/)

## usage

See `test.js` for example usage

## API

### var createStream = require('type-stream')

`createStream` is a factory function, call it to make a new `type-stream` instance

### createStream(detectors, detected)

You have to pass an array of functions to use as format guessers/detectors, as well as a function that gets called with the detected type when the detection is done.

For example:

```
var csvDetector = function(buf) {
  var str = buf.toString()
  if (str.indexOf(',') > -1 && str.indexOf('\n') > -1) return 'csv'
}

var jsonDetector = function(buf) {
  var str = buf.toString()
  if (str[0] === '{' && str[str.length - 1] === '}') return 'json'
}

var createStream = require('type-stream')

var typeStream = createStream([csvDetector, jsonDetector], function detected(type) {
  // type will be 'csv', 'json' or null if there was no match
})

// typeStream is a passthrough stream, so you can use it like this:
var fs = require('fs')
fs.createReadStream('some_csv_data').pipe(typeStream).pipe(process.stdout)
// the above line is equivalent to the next one (except the above line triggers the detected function above)
fs.createReadStream('some_csv_data').pipe(process.stdout)
```
