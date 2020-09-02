var namespace = require('@nichoth/events/namespace')

var EVENTS = namespace({
    ok: ['ok'],
    profile: ['save', 'setAvatar'],
    app: ['start'],
    post: ['new']
})

module.exports = EVENTS
