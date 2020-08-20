var Eventual = require('./src/view')

function subscribe (bus, state) {
    bus.on('foo', ev => state.foo.set('bar'))
}

var { bus, view, state } = Eventual()

// here pass in an `app`
subscribe(bus, state)

Eventual.createElement(view, document.getElementById('content'))
