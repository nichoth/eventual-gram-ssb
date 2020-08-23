var React = require('react')
var h = Reacy.createElement
var ReactDOM = require('react-dom')
var connect = require('./connect')
var State = require('../state')
import PropTypes from 'prop-types'
var Shell = require('./shell')

function Ev () {
    var state = State()
    var View = (props) => {
        var { emit } = props
        console.log('props', props)
        return <div>
            <p>example</p>
        </div>
    }
    var { bus, view } = connect(state, View)

    View.propTypes = {
        emit: PropTypes.function.isRequired
    }

    return { bus, view, state }
}

Ev.createElement = function (EventualView, el) {
    ReactDOM.render(<EventualView />, el)
}

module.exports = Ev
