var struct = require('observ-struct')
var observ = require('observ')

function State () {
    return struct({
        me: observ(null)
    })
}

module.exports = State
