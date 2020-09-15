import { render } from 'preact'
import { html } from 'htm/preact'
var State = require('../state')
var connect = require('./connect')
var Shell = require('./shell')
var Router = require('./routes')

function Ev () {
    var state = State()
    var router = Router()

    var View = function (props) {
        var { emit } = props
        var match = router.match(props.route.pathname)
        var route = match ? match.action(match) : null
        var routeView = route ? route.view : null
        // var events = (route.events || [])
        // events.forEach(ev => {
        //     emit(ev, null)
        // })

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
