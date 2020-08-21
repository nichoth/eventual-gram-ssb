var evs = require('./EVENTS')

function subscribe (bus, state, app) {
    bus.on('foo', ev => state.foo.set('bar'))
    bus.on(evs.ok.ok, ev => {
        console.log('ok', ev)
    })
}

module.exports = subscribe
