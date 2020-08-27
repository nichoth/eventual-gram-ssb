var namespace = require('@nichoth/events/namespace')

var EVENTS = namespace({
    ok: ['ok'],
    profile: ['save'],
    app: ['start'],
    post: ['new']
})

module.exports = EVENTS
