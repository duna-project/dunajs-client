var request = require('request-promise')

module.exports.create = (uri) => new Proxy({ uri: uri }, {
  get: (t, a) => (...args) => {
    var r
    if (a.toString().endsWith('!') || a.toString().endsWith('\u{1c3}')) {
      r = request.post({ uri: uriConcat(t.uri, a.replace(/!|\u{1c3}/u, '')), form: encode(args), json: true })
    } else {
      r = request({ uri: uriConcat(t.uri, a), qs: encode(args), json: true })
    }
    return r.catch(err => { throw digestError(err) })
  }
})

function uriConcat(uri, path) {
  return uri.toString().endsWith('/') ? uri.toString() + path : uri.toString() + '/' + path
}

function encode (args) {
  if (args.length == 0) return {}
  return Object.keys(args[0]).reduce((o, f) => {
    o[f] = typeof args[0][f] === 'object' ? JSON.stringify(args[0][f]) : args[0][f]
    return o
  }, {})
}

function digestError (err) {
  return new Error(err.message.replace(/.*io.duna.core.service.ServiceException: \[|]\"/g, ''))
}
