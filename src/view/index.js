var React = require('react')
var ReactDOM = require('react-dom')
var connect = require('./connect')
var State = require('../state')

function Ev () {
    var state = State()
    var View = (props) => {
        var { emit } = props
        console.log('props', props)
        return <div>
            <button onClick={emit('foo')}>
                foo
            </button>
            <p>example</p>
        </div>
    }
    var { bus, view } = connect(state, View)
    return { bus, view, state }
}

Ev.createElement = function (EventualView, el) {
    ReactDOM.render(<EventualView />, el)
}

module.exports = Ev
