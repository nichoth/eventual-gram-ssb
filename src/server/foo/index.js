var S = require('pull-stream')
var codec = require('flumecodec')
var createReduce = require('flumeview-reduce/inject')
var Store = require('flumeview-reduce/store/fs')

var myPlugin = {
    name: 'aaaaa',
    version:  0,
    manifest: {
    },
    init: init
}

function init (sbot) {
    var initState = { foo: 0 }
    function reducer (acc, val) {
        console.log('**in reducer**', acc, val)
        acc.foo = acc.foo + 1
        return acc
    }
    function mapper (msg) {
        console.log('**in mapper**', msg)
        return msg
    }

    var Reduce = createReduce(Store)

    var view = sbot._flumeUse('foo',
        Reduce(2, reducer, mapper, codec.json, initState))

    console.log('**view**', view)
    view.since.once(val => console.log('woooo', val))
    return view
}

module.exports = myPlugin
