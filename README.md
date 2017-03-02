# Basic usage

```javascript
var client = require('dunajs-client')

var c = client.create('http://some-service-endpoint')
// http get
c.methodName({ arg1: 1, arg2, 'a' }).then(data => { console.log(data) })
// http post using unicode character U+01C3
c.methodNameǃ({ arg1: 1, arg2, 'a' }).then(data => { console.log(data) })
// http post using !
c.['methodName!']({ arg1: 1, arg2, 'a' }).then(data => { console.log(data) })
```
