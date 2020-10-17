var _Sbot = require('./test-server')
// var Obv = require('obv')
// var Reduce = require('flumeview-reduce')
var S = require('pull-stream')
var codec = require('flumecodec')
var createReduce = require('flumeview-reduce/inject')
var Store = require('flumeview-reduce/store/fs')

var { Sbot, config } = _Sbot()

// we now have an in-memory view
// todo: how do we persist this?

// store/fs
// takes (dir, name, [codec])
// name is the filename
// (__dirname, 'foo')

var myPlugin = {
    name: 'aaaaa',
    version:  0,
    manifest: {
    },
    init: init
}

var sbot = Sbot.use(myPlugin)(config)
console.log('**sbot aaaaa**', sbot.aaaaa)

// to set a store, you must set up flumeview-reduce via the lower level
// dependency injection api.

// need to save the view state and the msg # it is up to somehow
// need to use the store `flume-reduce/store/fs`
// see https://github.com/flumedb/flumeview-reduce#stores

S(
    sbot.aaaaa.stream({ live: true }),
    S.drain(function (msg) {
        console.log('**in stream**', msg)
    })
)

sbot.publish({
    type: 'post',
    text: 'Hello, world!'
}, function (err, msg) {
    // console.log('**post 2', err, msg)
    sbot.aaaaa.get(function (err, data) {
        console.log('**get2**', err, data)
    })
})

sbot.aaaaa.get(function (err, res) {
    console.log('**get**', err, res)
})

// note _flumeUse is called *inside* `init`
function init (sbot) {
    var initState = { foo: 0 }
    function reducer (acc, val) {
        acc.foo = acc.foo + 1
        // console.log('**in reducer**', acc, val)
        return acc
    }
    function mapper (msg) {
        // console.log('**in map**', msg)
        return msg
    }

    // the thing returned by flumeview-reduce is at sbot.aaaaa b/c we return
    // it from here
    // var view = sbot._flumeUse('woooo',
    //     Reduce(1, reducer, mapper, codec.json, initState))

    var Reduce = createReduce(Store)

    // view state is saved at ~/app-name/ok.json
    // b/c that's what we named it in `_flumeUse`
    // var dir = path.dirname(log.filename)
    // state = Store(dir, name, codec)
    // https://github.com/flumedb/flumeview-reduce/blob/master/inject.js#L90
    var view = sbot._flumeUse('ok',
        Reduce(1, reducer, mapper, codec.json, initState))

    // Note this saves to ~/.ssb-ev-TEST/flume/ok.json
    // the path comes from the log path that is used by ssb

    console.log('**view**', view)
    view.since.once(val => console.log('woooo', val))
    return view
}


