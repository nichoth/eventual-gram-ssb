var React = require('react')
var { Component, createElement } = React
var h = createElement
var Bus = require('@nichoth/events')
var xtend = require('xtend')

function connect (state, View) {
    var bus = Bus({ memo: true })

    function emit () {
        return bus.emit.apply(bus, arguments)
    }

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
            return h(View, xtend(this.props, { emit }))
        }
    }

    return { bus, view: Connector }
}

module.exports = connect
