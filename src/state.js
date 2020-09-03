var struct = require('observ-struct')
var observ = require('observ')

function State () {
    var state = struct({
        route: struct({
            href: '/',
            pathname: '/'
        }),  // required
        me: observ({}),
        people: observ([]),
        avatarUrl: observ(null),
        posts: observ(null),
        postUrls: observ({}),
        pubs: struct({
            list: observ([]),
            err: observ(null)
        }),
        feeds: struct({})
    })

    state(_state => console.log('state change', _state))

    return state
}

module.exports = State
