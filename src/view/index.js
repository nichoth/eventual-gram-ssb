var React = require('react')
var ReactDOM = require('react-dom')
var connect = require('./connect')
var State = require('../state')
var catchRoutes = require('@nichoth/catch-routes')

function Ev () {
    var state = State()

    catchRoutes(function (parsedUrl) {
        state.route.set(parsedUrl)
    })

    // in here use a real view that you import
    var View = (props) => {
        console.log('props', props)
        return <div>example</div>
    }

    var { bus, view } = connect(state, View)
    return { bus, view, state }
}

Ev.createElement = function (EventualView, el) {
    ReactDOM.render(<EventualView />, el)
}

module.exports = Ev
