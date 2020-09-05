import { html } from 'htm/preact'

function Home (props) {
    // var { emit } = props

    console.log('props', props)

    if (!props.posts) return html`<div>home</div>`

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
                            <div class="author">
                                <a href="/${authorId}">${author.name}</a>
                            </div>
                        </div>
                    </div>
                </li>`

            })}
        </ul>

    </div>`
}

module.exports = Home
