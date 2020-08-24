import { html } from 'htm/preact'

function Shell (props) {
    var { emit } = props

    return html`<div class="shell">
        <div class="menu">
            menu stuff
        </div>
        shell
        ${' '}
        ${props.children}
        <button onclick=${emit('foo')}>clicker</button>
    </div>`
}

module.exports = Shell
