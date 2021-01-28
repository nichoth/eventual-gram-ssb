import { html } from 'htm/preact'
var evs = require('../../EVENTS')

function createFeedRoute (feedId) {

    return function Feed (props) {
        var { emit } = props
        emit(evs.feed.get, feedId)
        if(!props.feeds[feedId]) return null

        var posts = props.feeds[feedId]
        var person = props.people[feedId]
        var avatarUrl = person.imgUrl

        return html`<div class="feed-route">
            <div class="profile-info">
                <img class="avatar-big" src=${avatarUrl} />
                <h1 class="user-name">${person.name}</h1>
            </div>

            <hr />

            <ul class="feed post-list">
                ${posts.map(function (post) {
                    var hash = post.value.content.mentions[0] ?
                        post.value.content.mentions[0].link :
                        null
                    if (!hash) return null

                    var authorId = post.value.author
                    var author = (props.people[authorId] || {})
                    var postAvatar = (author.imgUrl || '')

                    return html`<li class="post">
                        <a href=${encodeURI('/' + post.key)}>
                            <img src=${props.postUrls[hash]} />
                        </a>
                        <div class="post-attributes">
                            <div class="post-avatar">
                                <img src="${postAvatar}" />
                            </div>

                            <div class="post-metadata">
                                ${post.value.content.text ?
                                    html`<div class="post-text">
                                        ${post.value.content.text}
                                    </div>` :
                                    null
                                }
                            </div>
                        </div>
                    </li>`
                })}
            </ul>
        </div>`
    }
}

module.exports = createFeedRoute
