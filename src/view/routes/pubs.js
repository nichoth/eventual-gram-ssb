import { html } from 'htm/preact'
var evs = require('../../EVENTS')

function pubsRoute ({ emit, pubs }) {
    emit(evs.route.pubs, null)

    return html`<div class="pubs-route">
        pubs

        <form onsubmit=${ev => {
            ev.preventDefault()
            var invite = ev.target.elements.invite.value
            emit(evs.pub.join, invite)
        }}>

            <${FormPart} label="Invite code" name="invite" class="pubs"/>

            <button type="submit">Join pub</button>
        </form>

        <ul>
            ${pubs.list.map(function (pub) {
                return html`<li>pub</li>`
            })}
        </ul>
    </div>`
}

function FormPart (props) {
    var { label, name } = props
    return html`<div class="form-part ${props.class}">
        <label for="${name}">${label}</label>
        <input name="${name}" id=${name} type="text" />
    </div>`
}

module.exports = pubsRoute
