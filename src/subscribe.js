var evs = require('./EVENTS')

function subscribe (bus, state, app) {
    bus.on('*', (evName, ev) => {
        console.log('name', evName)
        console.log('event', ev)
    })
    
    bus.on(evs.ok.ok, ev => {
        console.log('ok', ev)
    })
}

module.exports = subscribe
