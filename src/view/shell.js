import { html } from 'htm/preact'
import { useState } from 'preact/hooks'
var evs = require('../EVENTS')

function Shell (props) {
    var { emit } = props
    var { avatarUrl, me } = props
    console.log('props', props)

    // <img class="avatar" src="${avatarUrl}" />

    return html`<div class="shell">
        <div class="menu">
            <div>
                <${AvatarInput} emit=${emit} avatarUrl=${avatarUrl} />
                <${EditableField} ...${me} onSave=${emit(evs.profile.save)} />
            </div>
            <a className="new-post-icon" href="/new">+</a>
        </div>

        ${props.children}
    </div>`
}

function AvatarInput (props) {
    var { emit, avatarUrl } = props
    return html`<span class="avatar-holder">
        <label for="avatar-input" id="avatar-label">
            <img class="avatar" src="${avatarUrl}" title="avatar" />
        </label>
        <input type="file" id="avatar-input" name="avatar"
            accept="image/png, image/jpeg"
            onchange=${emit(evs.profile.setAvatar)}
        />
    </span>`
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
