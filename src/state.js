var struct = require('observ-struct')
var observ = require('observ')

function State () {
    var state = struct({
        route: struct({
            href: '/',
            pathname: '/'
        }),  // required
        me: observ({}),
        followed: observ([]),
        people: observ([]),
        avatarUrl: observ(null),
        posts: observ(null),
        postUrls: observ({}),
        pubs: struct({
            list: observ([]),
            err: observ(null)
        }),
        feeds: struct({}),
        following: observ([])
    })

    return state
}

module.exports = State
