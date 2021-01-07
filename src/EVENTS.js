var namespace = require('@nichoth/events/namespace')

var EVENTS = namespace({
    route: ['change'],
    ok: ['ok'],
    profile: ['save', 'setAvatar'],
    people: ['getAvatar'],
    app: ['start'],
    post: ['new'],
    feed: ['get'],
    pub: ['join'],
    follow: ['start']
})

module.exports = EVENTS
