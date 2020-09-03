import { html } from 'htm/preact'
var evs = require('../../EVENTS')

function createFeedRoute (feedId) {
    console.log('in feed.js', feedId)

    return function Feed (props) {
        var { emit } = props
        emit(evs.feed.get, feedId)
        if(!props.feeds[feedId]) return null

        var posts = props.feeds[feedId]

        return html`<ul class="feed">
            ${posts.map(function (post) {
                var hash = post.value.content.mentions[0] ?
                    post.value.content.mentions[0].link :
                    null
                if (!hash) return null

                return html`<li class="post">
                    <a href=${'/' + post.key}>
                        <img src=${props.postUrls[hash]} />
                    </a>
                    <div class="post-attributes">
                        <div class="post-text">
                            ${post.value.content.text}
                        </div>
                    </div>
                </li>`
            })}
        </ul>`
    }
}

module.exports = createFeedRoute
