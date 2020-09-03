import { html } from 'htm/preact'
var evs = require('../../EVENTS')

function createFeedRoute (feedId) {
    console.log('in feed.js', feedId)

    return function Feed (props) {
        var { emit } = props
        emit(evs.feed.get, feedId)
        console.log('props', props)
        return html`<div>feed</div>`
    }
}

module.exports = createFeedRoute
