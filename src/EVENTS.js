var namespace = require('@nichoth/events/namespace')

var EVENTS = namespace({
    route: ['pubs'],
    ok: ['ok'],
    profile: ['save', 'setAvatar'],
    people: ['getAvatar'],
    app: ['start'],
    post: ['new'],
    feed: ['get'],
    pub: ['join']
})

module.exports = EVENTS
