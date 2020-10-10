var evs = require('../../EVENTS')
import { html } from 'htm/preact'
import { Component } from 'preact'
var marked = require('ssb-marked')

class PostText extends Component {
    shouldComponentUpdate() {
        // do not re-render via diff:
        return false
    }

    componentDidMount() {
        if (!this.props.text) return
        this.base.innerHTML = marked(this.props.text)
    }

    render (props) {
        if (!props.text) return null
        return html`<div class="post-text"></div>`
    }
}

function Home (props) {
    console.log('props in home', props)

    if (!props.posts) return null

    var { followed, emit } = props

    return html`<div class="route-home">
        <ul class="post-list">
            ${props.posts.map(post => {
                var hash = post.value.content.mentions[0] ?
                    post.value.content.mentions[0].link :
                    null
                if (!hash) return null

                var authorId = post.value.author
                var author = (props.people[authorId] || {})
                var postAvatar = (author.imgUrl || '')
                // console.log('postAvatar', postAvatar)
                // console.log('post', post)

                var isFollowing = followed.find(followedId => {
                    return followedId === authorId
                })

                return html`<li class="post">
                    <img src=${props.postUrls[hash]} />

                    <div class="post-attributes">
                        <a class="avatar-link" href="/${authorId}">
                            <div class="post-avatar">
                                <img src="${postAvatar}" />
                            </div>
                        </a>
                        <div class="post-metadata">
                            <${PostText} text=${post.value.content.text} />
                            <div class="author">
                                <a href="/${authorId}">
                                    ${author.name}
                                </a>
                                ${authorId === props.me.id ?
                                    ' (you)' :
                                    null
                                }
                            </div>
                        </div>

                        <${FollowIcon} authorId=${authorId}
                            id=${props.me.id} isFollowing=${isFollowing}
                            onFollow=${emit(evs.follow.start)}
                        />
                    </div>
                </li>`

            })}
        </ul>

    </div>`
}

function FollowIcon (props) {
    var { authorId, id, isFollowing, onFollow } = props
    // if it's your own message
    if (authorId === id) return null

    if (isFollowing) {
        // return html`<div class="follow-icon">*</div>`
        return html`<div class="follow-icon">
            <button title="You are already following this feed"
                onClick=${ev => ev.preventDefault()}
                disabled=${true}
            >
                *
            </button>
        </div>`
    }

    return html`<div class="follow-icon">
        <button title="follow" onClick=${ev => {
            ev.preventDefault()
            onFollow({ id: authorId })
        }}>*</button>
    </div>`
}

module.exports = Home
