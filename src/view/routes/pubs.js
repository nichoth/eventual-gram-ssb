import { html } from 'htm/preact'
var evs = require('../../EVENTS')
var get = require('lodash/get')

function pubsRoute ({ emit, pubs, following }) {

    // @TODO need a 
    // * list of following
    // * list of pubs

    // need to emit an event only when this route first loads

    console.log('pubssss render', pubs)

    return html`<div class="pubs-route">
        <form onsubmit=${ev => {
            ev.preventDefault()
            var invite = ev.target.elements.invite.value
            emit(evs.pub.join, invite)
        }}>

            <${FormInput} label="Invite code" name="invite" class="pubs" />

            <button type="submit">Join pub</button>
        </form>

        <hr />

        <h2>Current pubs</h2>
        ${pubs.list.length === 0 ?
            html`<div><em>none</em></div>` :
            html`<ul class="pubs-list">
                ${pubs.list.map(function (pub) {
                    return html`<li class="pub">
                        ${get(pub, 'value.content.address.host', null)}
                    </li>`
                })}
            </ul>`
        }

        <h2>Following</h2>
        ${following.length === 0 ?
            html`<div><em>none</em></div>` :
            html`<ul class="following-list">
                ${following.map(function (followed) {
                    return html`<li class="following">
                        following ${followed}
                    </li>`
                })}
            </ul>`
        }

    </div>`
}

function FormInput (props) {
    var { label, name } = props
    return html`<div class="form-part ${props.class}">
        <label for="${name}">${label}</label>
        <input name="${name}" id=${name} type="text" />
    </div>`
}

module.exports = pubsRoute
