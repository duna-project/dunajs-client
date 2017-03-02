var request = require('request-promise')

module.exports.create = (uri) => new Proxy({ uri: uri.toString().replace(/\/$/, '') }, {
  get: (t, a) => (...args) => {
    if (a === 'uri') return t.uri
    var r
    if (this.isPostMethod(a)) {
      a = this.postMethodName(a)
      r = request.post({ uri: `${t.uri}/${a}`, form: this.encode(args), json: true })
    } else {
      r = request({ uri: `${t.uri}/${a}`, qs: this.encode(args), json: true })
    }
    return r.catch(err => { throw digestError(err) })
  }
})

module.exports.encode = (args) => {
  if (args.length == 0) return {}
  return Object.keys(args[0]).reduce((o, f) => {
    o[f] = typeof args[0][f] === 'object' ? JSON.stringify(args[0][f]) : args[0][f]
    return o
  }, {})
}

module.exports.isPostMethod = m => m.toString().endsWith('!') || m.toString().endsWith('\u{1c3}')

module.exports.postMethodName = a => a.replace(/!|\u{1c3}/u, '')

const digestError = err =>
  new Error(err.message.replace(/.*io.duna.core.service.ServiceException: \[|]\"/g, ''))
