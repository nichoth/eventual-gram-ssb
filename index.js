var Eventual = require('./src/view')
var subscribe = require('./src/subscribe')
var start = require('./src/start')

var { bus, view, state } = Eventual()

function App (sbot) {
    console.log('sbot in here', sbot)
    return {}
}

start(function (err, { sbot }) {
    if (err) throw err
    var app = App(sbot)
    subscribe(bus, state, app)
})

Eventual.createElement(view, document.getElementById('content'))
