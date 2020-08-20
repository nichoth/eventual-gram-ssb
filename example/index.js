var Ev = require('../src/view')

function subscribe (bus, state) {
    bus.on('foo', ev => state.foo.set('bar'))
}

var { bus, view, state } = Ev()

subscribe(bus, state)

Ev.createElement(view, document.getElementById('content'))
