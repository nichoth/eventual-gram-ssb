var S = require('pull-stream')
var Sbot = require('./test-server')

var sbot = Sbot()

console.log('flume use', sbot._flumeUse)

// you just want a map of tag name to [msgKeys]
// could be 'name' to tagObj { messages, key, etc }

S(
    sbot.messagesByType({ type: 'tag' }),

    S.asyncMap(function (msg, cb) {
        // get the names of the tag
        S(
            sbot.links({
                rel: 'about',
                dest: msg.key
            }),
            S.asyncMap(function (msg, cb) {
                sbot.get(msg.key, cb)
            }),
            // theres probably only 1 'about' msg per tag
            S.reduce(function (acc, _msg) {
                acc[_msg.content.name] = (acc[_msg.content.name] || []).concat([msg.key])
                return acc
            }, {}, function (err, res) {
                console.log('done', err, res)
                cb(null, res)
            })
        )
    }),

    S.reduce(function (acc, __msg) {
        console.log('here', __msg)
        // a map of tag name to tag object key(s)
        Object.keys(__msg).forEach(key => {
            acc[key] = (acc[key] || []).concat(__msg[key])
        })
        return acc
    }, {}, function (err, res) {
        console.log('all done', err, res)
    })

    // S.collect(function (err, msgs) {
    //     // this is a message per tag
    //     console.log('collection', err, msgs)
    // })
)
