import { html } from 'htm/preact'
// var evs = require('../../EVENTS')

function createPostView (postId) {
    return function PostView (props) {
        var post = props.posts.find(post => post.key === postId)
        var fileHash = post.value.content.mentions[0].link
        var imgUrl = props.postUrls[fileHash]

        var author = (props.people[post.value.author] || {})
        var authorId = post.value.author
        var postAvatar = (author.imgUrl || '')

        return html`<div class="single-post">
            <img src="${imgUrl}" />

            <div class="author">
                <div class="post-avatar">
                    <img src="${postAvatar}" />
                </div>

                <h1>
                    <a href="/${authorId}">${author.name}</a>
                </h1>
            </div>

            <div class="post-metadata">
                ${post.value.content.text ?
                    html`<div class="post-text">
                        ${post.value.content.text}
                    </div>` :
                    null
                }
            </div>
        </div>`
    }
}

module.exports = createPostView
