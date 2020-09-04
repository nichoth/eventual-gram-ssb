import { html } from 'htm/preact'
// var evs = require('../../EVENTS')

function createPostView (postId) {
    return function PostView (props) {
        console.log('in post view post ID', postId)
        console.log('in post view props', props)

        var post = props.posts.find(post => post.key === postId)
        var fileHash = post.value.content.mentions[0].link
        var imgUrl = props.postUrls[fileHash]

        return html`<div class="single-post">
            <img src="${imgUrl}" />
            <div>post view</div>
        </div>`
    }
}

module.exports = createPostView
