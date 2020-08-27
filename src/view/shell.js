import { html } from 'htm/preact'
import { useState } from 'preact/hooks'
var evs = require('../EVENTS')

function Shell (props) {
    var { emit } = props
    var { avatarUrl, me } = props
    console.log('props', props)

    return html`<div class="shell">
        <div class="menu">
            <img class="avatar" src="${avatarUrl}" />
            <${EditableField} ...${me} onSave=${emit(evs.profile.save)}/>
            menu stuff
            <a className="new-post" href="/new">+</a>
        </div>

        ${props.children}
    </div>`
}

// onSave
// name
function EditableField (props) {
    var [isEditing, setEditing] = useState(false)

    function save (ev) {
        ev.preventDefault()
        props.onSave(ev.target.name.value)
        setEditing(false)
    }

    function cancel (ev) {
        ev.preventDefault()
        setEditing(false)
    }

    function edit (ev) {
        ev.preventDefault()
        setEditing(true)
    }

    // pencil emoji
    if (!isEditing) {
        return html`<span>
            ${props.name} <button onClick=${edit}>✏</button>
        </span>`
    }

    return html`<form onSubmit=${save}>
        <input value=${props.name} name="name" />
        <button type="submit">save</button>
        <button onClick=${cancel}>cancel</button>
    </form>`
}

module.exports = Shell
