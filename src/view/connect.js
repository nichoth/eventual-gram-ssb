var { h, Component } = require('preact')
var Bus = require('@nichoth/events')
var xtend = require('xtend')
var catchRoutes = require('@nichoth/catch-routes')

function connect (state, View) {
    var bus = Bus({ memo: true })

    function emit () {
        return bus.emit.apply(bus, arguments)
    }


    // for testing
    window.ev = window.ev || {}
    window.ev.emit = emit



    catchRoutes(parsedUrl => {
        state.route.set(parsedUrl)
    })

    class Connector extends Component {
        constructor(props) {
            super(props)
            this.state = state()
        }

        componentDidMount () {
            var self = this
            state(function onChange (data) {
                self.setState(data)
            })
        }

        render () {
            return h(View, xtend(this.state, this.props, { emit }))
        }
    }

    return { bus, view: Connector }
}

module.exports = connect
