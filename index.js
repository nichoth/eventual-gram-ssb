var Eventual = require('./src/view')
var subscribe = require('./src/subscribe')
var start = require('./src/start')
var App = require('./src/app')

var { bus, view, state } = Eventual()

start(function (err, { sbot }) {
    if (err) throw err
    var app = App(sbot)
    subscribe(bus, state, app)
})

Eventual.createElement(view, document.getElementById('content'))
