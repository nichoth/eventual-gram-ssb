var namespace = require('@nichoth/events/namespace')

var EVENTS = namespace({
    ok: ['ok'],
    profile: ['save', 'setAvatar'],
    people: ['getAvatar'],
    app: ['start'],
    post: ['new'],
    feed: ['get']
})

module.exports = EVENTS
