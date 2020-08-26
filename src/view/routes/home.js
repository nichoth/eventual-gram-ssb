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

                return html`<li class="post">
                    <a href=${'/' + post.key}>
                        <img src=${props.postUrls[hash]} />
                    </a>
                    <div class="post-attributes">
                        <div class="post-text">
                            ${post.value.content.text}
                        </div>
                        <div class="author">
                            ${post.value.author}
                        </div>
                    </div>
                </li>`

            })}
        </ul>

    </div>`
}

module.exports = Home
