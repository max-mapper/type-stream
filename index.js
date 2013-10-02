var through = require('through')
var combiner = require('stream-combiner')

module.exports = TypeStream

function TypeStream(detectors, cb) {
  if (!(this instanceof TypeStream)) return new TypeStream(detectors, cb)
  
  var detector = through(write)
  var detected = false
  var passthrough = through()
  return combiner(detector, passthrough)
  
  function write(buf) {
    if (detected) return this.queue(buf)
    detector.pause()
    for (var i = 0; i < detectors.length; i++) {
      var detect = detectors[i]
      var type = detect(buf)
      if (type) {
        finish(type)
        return
      }
    }
    finish(null)
    function finish(type) {
      cb(type)
      detected = true
      detector.queue(buf)
      detector.resume()
    }
  }
}
