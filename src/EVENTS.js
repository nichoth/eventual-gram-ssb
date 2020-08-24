var namespace = require('@nichoth/events/namespace')

var EVENTS = namespace({
    ok: ['ok'],
    profile: ['save'],
    app: ['start']
})

module.exports = EVENTS
