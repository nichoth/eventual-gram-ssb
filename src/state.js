var struct = require('observ-struct')
var observ = require('observ')

function State () {
    return struct({
        route: struct({}),  // required
        me: observ({}),
        avatarUrl: observ(null),
        posts: observ(null),
        postUrls: observ({}),
        pubs: struct({
            list: observ([]),
            err: observ(null)
        })
    })
}

module.exports = State
