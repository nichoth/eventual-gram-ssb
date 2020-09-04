import { html } from 'htm/preact'
var evs = require('../../EVENTS')

function createPostView (postId) {
    return function PostView (props) {
        console.log('in post view', postId)
        console.log('in post view', props)

        return html`<div>post view</div>`
    }
}

module.exports = createPostView
