var React = require('react')
var ReactDOM = require('react-dom')
var connect = require('./connect')
var struct = require('observ-struct')

function Ev () {
    var state = struct({})
    var View = () => (<div>example</div>)
    var { bus, view } = connect(state, View)
    return { bus, view, state }
}

Ev.createElement = function (EventualView, el) {
    ReactDOM.render(<EventualView />, el)
}

module.exports = Ev
