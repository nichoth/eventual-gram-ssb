var Client = require('./client')

function start (cb) {
    Client({}, function (err, sbot) {
        if (err) {
            if (cb) return cb(err)
            throw err
        }

        if (cb) cb(null, { sbot })
    })
}

module.exports = start
