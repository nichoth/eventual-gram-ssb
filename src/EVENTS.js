var namespace = require('@nichoth/events/namespace')

var EVENTS = namespace({
    route: ['change'],
    ok: ['ok'],
    profile: ['save', 'setAvatar'],
    people: ['getAvatar', 'getProfile'],
    app: ['start'],
    post: ['new'],
    feed: ['get'],
    pub: ['join', 'route'],
    follow: ['start']
})

module.exports = EVENTS
