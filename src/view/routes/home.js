import { html } from 'htm/preact'

function Home (props) {
    // var { emit } = props

    if (!props.posts) return null

    console.log('props here', props)

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

                console.log('post', post)

                return html`<li class="post">
                    <a href=${encodeURI('/' + post.key)}>
                        <img src=${props.postUrls[hash]} />
                    </a>
                    <div class="post-attributes">
                        <a class="avatar-link" href="/${authorId}">
                            <div class="post-avatar">
                                <img src="${postAvatar}" />
                            </div>
                        </a>
                        <div class="post-metadata">
                            ${post.value.content.text ?
                                html`<div class="post-text">
                                    ${post.value.content.text}
                                </div>` :
                                null
                            }
                            <div class="author">
                                <a href="/${authorId}">${author.name}</a>
                            </div>
                        </div>

                        <${FollowIcon} authorId=${authorId}
                            id=${props.me.id}
                        />
                    </div>
                </li>`

            })}
        </ul>

    </div>`
}

function FollowIcon (props) {
    var { authorId, id } = props
    if (authorId === id) return null

    return html`<div class="follow-icon">
        *
    </div>`
}

module.exports = Home
