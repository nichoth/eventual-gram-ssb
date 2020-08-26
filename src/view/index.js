import { render } from 'preact'
import { html } from 'htm/preact'
var connect = require('./connect')
var State = require('../state')
var Shell = require('./shell')
var Router = require('./routes')

function Ev () {
    var state = State()
    var router = Router()

    var View = function (props) {
        var { emit } = props
        var match = router.match(props.route.pathname)
        var routeView = match ? match.action(match) : null

        return html`<div>
            <${Shell} emit=${emit} ...${props}>
                <${routeView} emit=${emit} ...${props} />
            <//>
        </div>`
    }

    var { bus, view } = connect(state, View)

    return { bus, view, state }
}

Ev.createElement = function (EventualView, el) {
    render(html`<${EventualView} />`, el)
}

module.exports = Ev
