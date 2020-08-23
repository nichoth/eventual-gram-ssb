import { render } from 'preact'
import { html } from 'htm/preact'
var connect = require('./connect')
var State = require('../state')
var Shell = require('./shell')

function Ev () {
    var state = State()
    var View = (props) => {
        // var { emit } = props
        console.log('props', props)

        return html`<div>
            <${Shell} />
            <p>example</p>
        </div>`
    }
    var { bus, view } = connect(state, View)

    return { bus, view, state }
}

Ev.createElement = function (EventualView, el) {
    render(html`<${EventualView} />`, el)
}

module.exports = Ev
