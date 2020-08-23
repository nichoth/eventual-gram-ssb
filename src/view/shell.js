var React = require('react')
import PropTypes from 'prop-types'

function Shell (props) {
    return <div>
        {props.children}
    </div>
}

module.exports = Shell
