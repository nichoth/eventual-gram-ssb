import { html } from 'htm/preact'

function Shell (props) {
    return html`<div class="foo">
        shell
        ${' '}
        ${props.children}
    </div>`
}

module.exports = Shell
