// var React = require('react')
// var { Component, createElement } = React
var { h, Component } = require('preact')
// var h = createElement
// import { html } from 'htm/preact';
var Bus = require('@nichoth/events')
var xtend = require('xtend')
var catchRoutes = require('@nichoth/catch-routes')
// var Router = require('./routes')

function connect (state, View) {
    // var router = Router()
    var bus = Bus({ memo: true })

    function emit () {
        return bus.emit.apply(bus, arguments)
    }

    catchRoutes(catcher)

    function catcher (parsedUrl) {
        console.log('in here', parsedUrl)
        state.route.set(parsedUrl)
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
            return h(View, xtend(this.state, this.props, { emit }))
        }
    }

    return { bus, view: Connector }
}

module.exports = connect
