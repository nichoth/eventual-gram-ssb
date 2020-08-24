import { html } from 'htm/preact'

function Home (props) {
    var { emit } = props

    console.log('props', props)

    return html`<div class="foo">
        home
    </div>`
}

module.exports = Home
