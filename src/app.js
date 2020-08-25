var S = require('pull-stream')
var getAvatar = require('ssb-avatar')
var ts = require('./types')
var toURL = require('ssb-serve-blobs/id-to-url')
var xtend = require('xtend')

function App (sbot) {
    console.log('sbot in app', sbot)
    return {
        getProfile,
        getUrlForHash,
        liveUpdates
    }

    function postStream () {
        return sbot.messagesByType({
            type: ts.post,
            // reverse: true,
            live: true
        })
    }

    function getUrlForPost () {
        return S(
            S.map(function onData (post) {
                if (!post.value.content.mentions) return null

                var hash = post.value.content.mentions[0] ?
                    post.value.content.mentions[0].link :
                    null
                if (!hash) return null
                if (hash[0] != '&') return null
                return [hash, post]
            }),
            S.map(function ([hash, post]) {
                return [hash, toURL(hash), post]
            })
        )
    }

    function liveUpdates (state) {
        console.log('live start')
        S(
            postStream(),
            S.filter(function (post) {
                return post.value
            }),
            getUrlForPost(),
            S.drain(function ([hash, url, post]) {
                sbot.blobs.has(hash, function (err, res) {
                    if (!res) {
                        console.log('miss', err, res)

                        S(
                            sbot.blobs.get(hash),
                            S.collect(function (err, res) {
                                console.log('blobs.get', err, res)
                            })
                        )

                        sbot.blobs.want(hash, {}, function(err, res) {
                            console.log('want cb', err, res)
                        })
                    }
                })

                if (state().postUrls[hash]) return
                var newState = {}
                newState[hash] = url
                state.postUrls.set(xtend(state.postUrls(), newState))

                if (post.sync === true) return
                var arr = (state.posts() || [])
                arr.unshift(post)
                state.posts.set(arr)

            }, function done (err) {
                if (err) return console.log('error', err)
                console.log('all done', arguments)
            })
        )
    }

    function getUrlForHash (hash, cb) {
        S(
            sbot.blobs.get(hash),
            // Catch(),
            S.collect(function (err, values) {
                if (err) {
                    return cb(err)
                }
                var blob = new Blob(values)
                var imageUrl = URL.createObjectURL(blob)
                cb(null, imageUrl)
            })
        )
    }

    function getProfile (cb) {
        sbot.whoami(function (err, res) {
            if (err) throw err
            var { id } = res

            getAvatar(sbot, id, id, function (err, profile) {
                // console.log('profile', profile)
                cb(err, profile)
            })
        })
    }
}

module.exports = App
