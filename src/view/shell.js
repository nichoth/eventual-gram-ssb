import { html } from 'htm/preact'

function Shell (props) {
    console.log(props)
    var { emit } = props

    return html`<div class="foo">
        shell
        ${' '}
        ${props.children}
        <button onclick=${emit('foo')}>click</button>
    </div>`
}

module.exports = Shell
