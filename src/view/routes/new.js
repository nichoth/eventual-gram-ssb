import { html } from 'htm/preact'
import { useState } from 'preact/hooks'
var evs = require('../../EVENTS')

function FilePreview (props) {
    var { selectedFile } = props

    function nevermind (ev) {
        ev.preventDefault()
        props.nevermind()
    }

    return html`<form class="file-preview" onSubmit=${props.savePost}>
        <div class="image-preview">
            <img src=${URL.createObjectURL(selectedFile)} />
        </div>

        <div className="text-input">
            <textarea id="text" name="text"><//>
        </div>

        <div className="controls">
            <button onClick=${nevermind}>Nevermind</button>
            <button type="submit">Save</button>
        </div>
    </form>`
}

function New (props) {
    var { emit } = props
    var [selectedFile, setSelectedFile] = useState(null)

    function chooseFile (ev) {
        console.log('choose', ev)
        var file = ev.target.files[0]
        setSelectedFile(file)
    }

    function savePost (ev) {
        ev.preventDefault()
        // todo should wait for save to finish
        var text = ev.target.elements.text.value
        var image = this.state.selectedFile
        emit(evs.post.new, { image, text })
        setSelectedFile(null)
    }

    return html`<div class="new-post">
        <input type="file" accept="image/*" onChange=${chooseFile} />

        ${selectedFile ?
            html`<${FilePreview} selectedFile=${selectedFile} 
                nevermind=${() => setSelectedFile(null)}
                savePost=${savePost}
            />` :
            null
        }
    </div>`
}

module.exports = New
