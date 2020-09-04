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
            <${AvatarInput} emit=${emit} />
            <${EditableField} ...${me} onSave=${emit(evs.profile.save)} />
            <a className="new-post-icon" href="/new">+</a>
        </div>

        ${props.children}
    </div>`
}

function AvatarInput (props) {
    var { emit } = props
    return html`<input type="file" id="avatar" name="avatar"
        accept="image/png, image/jpeg"
        onchange=${emit(evs.profile.setAvatar)}
    />`
}

// onSave
// name
function EditableField (props) {
    var { name, onSave } = props
    var [isEditing, setEditing] = useState(false)

    function save (ev) {
        ev.preventDefault()
        onSave(ev.target.name.value)
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
            ${name} <button class="edit" onClick=${edit}>✏</button>
        </span>`
    }

    return html`<form onSubmit=${save}>
        <input value=${name} name="name" />
        <button type="submit">save</button>
        <button onClick=${cancel}>cancel</button>
    </form>`
}

module.exports = Shell
