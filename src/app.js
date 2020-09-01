var S = require('pull-stream')
var getAvatar = require('ssb-avatar')
var ts = require('./types')
var toURL = require('ssb-serve-blobs/id-to-url')
var xtend = require('xtend')
var createHash = require('multiblob/util').createHash
var fileReaderStream = require('filereader-pull-stream')




function App (sbot) {
    return {
        getProfile,
        getProfileById,
        getUrlForHash,
        liveUpdates,
        setProfile,
        newPost,
        messages
    }

    function newPost ({ image, text }, cb) {
        var hasher = createHash('sha256')

        S(
            fileReaderStream(image),
            hasher,
            sbot.blobs.add(function (err, _hash) {
                if (err) throw err
                var hash = '&' + hasher.digest
                
                sbot.publish({
                    type: ts.post,
                    text: text || '',
                    mentions: [{
                        link: hash,        // the hash given by blobs.add
                    //   name: 'hello.txt', // optional, but recommended
                    //   size: 12,          // optional, but recommended
                    //   type: 'text/plain' // optional, but recommended
                    }]
                }, function (err, res) {
                    if (err) return cb(err)
                    cb.apply(null, arguments)
                })
            })
        )
    }

    function setProfile (id, newName, cb) {
        sbot.publish({
            type: 'about',
            about: id,
            name: newName
        }, function (err, msg) {
            if (err) return cb(err)
            cb(null, msg.value.content.name)
        })
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
                console.log('bbbbbb', post)
                if (!post.value.content.mentions) return null

                var hash = post.value.content.mentions[0] ?
                    post.value.content.mentions[0].link :
                    null
                if (!hash) return null
                if (hash[0] != '&') return null
                return [hash, post]
            }),
            S.map(function ([hash, post]) {
                console.log('ccccccccc', hash, post)
                return [hash, toURL(hash), post]
            })
        )
    }

    function messages (cb) {
        S(
            sbot.messagesByType({ type: ts.post }),
            // getUrlForPost(),
            // S.collect(function (err, [hash, url, posts]) {
            //     console.log('aaaaaarrg', err, posts)
            //     cb(err, posts)
            // })
            getUrlForPost(),
            S.collect(function (err, data) {
                console.log('aaaaaarrg', err, data)
                cb(err, data)
            })
        )
    }

    function liveUpdates (state) {
        console.log('live start')

        S(
            postStream(),
            S.through(console.log.bind(console, 'post in here')),
            S.filter(function (post) {
                return post.value
            }),
            getUrlForPost(),
            S.drain(function ([hash, url, post]) {
                console.log('post in here', post)

                var authorId = post.value.author

                if (!state().people[authorId]) {
                    getProfileById(authorId, function (err, { name }) {
                        if (err) throw err
                        var people = state.people()
                        people[authorId] = { name }
                        state.people.set(people)
                    })
                }

                // if (state.me().id === authorId) {
                //     if (!state().people[authorId]) {
                //         var people = state.people()
                //         people[authorId] = { name }
                //         state.people.set(people)
                //     }
                // } else {
                //     if (!state().people[authorId]) {
                //         getProfileById(authorId, function (err, { name }) {
                //             if (err) throw err
                //             var people = state.people()
                //             people[authorId] = { name }
                //             state.people.set(people)
                //         })
                //     }
                // }


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
                console.log('live done', arguments)
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

    function getProfileById (id, cb) {
        console.log('id', id)
        S(
            sbot.links({
                source: id,
                dest: id,
                rel: 'about',
                values: true
            }),
            S.collect(function (err, msgs) {
                console.log('aaaaaaa msgs', msgs)
                var nameMsgs = msgs.filter(msg => msg.value.content.name)
                console.log('namemsgsssss', nameMsgs)
                var nameMsg = nameMsgs[nameMsgs.length - 1]

                cb(err, { name: nameMsg ? nameMsg.value.content.name : '' })
            })
        )
    }
}

module.exports = App
