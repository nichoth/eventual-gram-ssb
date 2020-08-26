var Eventual = require('./src/view')
var subscribe = require('./src/subscribe')
var start = require('./src/start')
var App = require('./src/app')
var evs = require('./src/EVENTS')

var { bus, view, state } = Eventual()

start(function (err, { sbot }) {
    if (err) throw err
    window.sbot = sbot
    var app = App(sbot)

    subscribe(bus, state, app)

    bus.emit(evs.app.start, null)
})

Eventual.createElement(view, document.getElementById('content'))
