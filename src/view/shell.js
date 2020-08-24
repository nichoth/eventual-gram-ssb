import { html } from 'htm/preact'

function Shell (props) {
    var { emit } = props
    var { avatarUrl } = props
    console.log('props', props)
    console.log('avatar url', avatarUrl)

    return html`<div class="shell">
        <div class="menu">
            <img class="avatar" src="${avatarUrl}" />
            menu stuff
        </div>
        shell
        ${' '}
        ${props.children}
        <button onclick=${emit('foo')}>clicker</button>
    </div>`
}

module.exports = Shell
