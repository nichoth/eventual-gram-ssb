var S = require('pull-stream')
var getAvatar = require('ssb-avatar')
var ts = require('./types')
var toURL = require('ssb-serve-blobs/id-to-url')
var createHash = require('multiblob/util').createHash
var fileReader = require('pull-file-reader')
var _ = {
    get: require('lodash/get')
}

// this file just uses the given `sbot` and returns/cb's with response
// state for the app is set is `subscribe`

function App (sbot) {


    // ----------------- testing ----------------------------------
    window.ev = window.ev || {}
    window.ev.sbot = sbot
    window.ev.S = S
    window.ev.alice = sbot.alice
    window.ev.alice.publish = function (text) {
        document.createElement('canvas').toBlob(function (blob) {
            var file = new File([blob], 'canvas.jpg', { type: blob.type })
            var image = file
            text = text || 'foo'

            var hasher = createHash('sha256')

            S(
                fileReader(image),
                hasher,
                sbot.blobs.add(function (err, _hash) {
                    if (err) throw err
                    var hash = '&' + hasher.digest
                    
                    window.ev.alice.publish({
                        type: ts.post,
                        text: text,
                        mentions: [{
                            link: hash,        // the hash given by blobs.add
                        //   name: 'hello.txt', // optional, but recommended
                        //   size: 12,          // optional, but recommended
                        //   type: 'text/plain' // optional, but recommended
                        }]
                    }, function (err, res) {
                        if (err) return console.log('err', err)
                        console.log('res', res)
                    })
                })
            )
        }, 'image/jpeg')
    }

    // -------------------------------------------------------



    // **this takes a long time**
    // gossip()

    // function gossip (cb) {
    //     // merge the peer.state.connected value with changes from
    //     // gossip.changes
    //     sbot.gossip.peers((err, res) => {
    //         console.log('peers', err, res)
    //     })

    //     S(
    //         sbot.gossip.changes(),
    //         S.drain(function (ev) {
    //             console.log('gossip changes drain', ev)
    //         })
    //     )
    // }



    // can use msgs.pub.value.content.address.host to match this with
    // peers[0].host, b/c the `peers` call has the connected state
    // and use `sbot.gossip.changes` to keep it up to date





    // this returns *all pubs that we know about*
    // getPubs((err, res) => console.log('got pubs', err, res))




    // --------- trying gossip -- pubs --------------------------
    sbot.gossip.peers(function (err, peers) {
        console.log('peeeeers', err, peers)
    })

    S(
        sbot.gossip.changes(),
        S.drain(ev => {
            console.log('gossip change', ev)
        })
    )
    // --------------------------------------------



    // **-------------trying friends -- follows---------------**
    S(
        sbot.friends.createFriendStream({ meta: true }),
        S.drain(ev => {
            console.log('**friend stream**', ev)
        })
    )
    // ----------------------------------------------






    // *this takes too long*
    // also renders too many pubs
    // we need to know if we are connected or not and put connected pubs at
    // the top of the list
    // could have UI that lets you connect to pubs in the list (with invite)

    // this is not good b/c it reuturns a list of all pubs we know about,
    // regardless of the connection state
    function getPubs (cb) {
        S(
            sbot.messagesByType({ type: 'pub' }),
            S.collect(function (err, msgs) {
                if (err) return cb(err)
                cb(null, msgs)
            })
        )
    }






    // for testing
    // createTags(['my-tag'], function (err, res) {
    //     // res is an array of tag objects
    //     console.log('tags created', err, res)
    //     // getAllTags(function (err, _res) {
    //     //     console.log('**got all tags**', err, _res)
    //     // })
    //     getTagsWithNames(function (err, tags) {
    //         console.log('**tags with names**', err, tags)
    //     })
    // })









    return {
        getProfile,
        getProfileById,
        getUrlForHash,
        // liveUpdates,
        setProfile,
        newPost,
        messages,
        getUserPosts,
        setAvatar,
        joinPub,
        getPubs,
        contacts,
        follow,
        getFollows
    }

    function joinPub (inviteCode, cb) {
        sbot.invite.accept(inviteCode, cb)
    }

    function newPost ({ image, text }, cb) {
        var hasher = createHash('sha256')

        S(
            fileReader(image),
            hasher,
            sbot.blobs.add(function (err, _hash) {
                // console.log('in blob.add', err, hasher.digest, _hash)
                // console.log('sbot', sbot)
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
                    // console.log('made new post', err, res)
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

    function messages (cb) {
        S(
            sbot.messagesByType({
                type: ts.post,
                reverse: true
            }),
            getUrlForPost(),
            S.collect(function (err, data) {
                cb(err, data)
            })
        )
    }

    // function liveUpdates (state) {
    //     console.log('live start')

    //     S(
    //         postStream(),
    //         S.through(console.log.bind(console, 'post in here')),
    //         S.filter(function (post) {
    //             return post.value
    //         }),
    //         getUrlForPost(),
    //         S.drain(function ([hash, url, post]) {
    //             console.log('post in here', post)

    //             var authorId = post.value.author

    //             if (!state().people[authorId]) {
    //                 getProfileById(authorId, function (err, { name }) {
    //                     if (err) throw err
    //                     var people = state.people()
    //                     people[authorId] = { name }
    //                     state.people.set(people)
    //                 })
    //             }

    //             if (state.me().id === authorId) {
    //                 if (!state().people[authorId]) {
    //                     var people = state.people()
    //                     people[authorId] = { name }
    //                     state.people.set(people)
    //                 }
    //             } else {
    //                 if (!state().people[authorId]) {
    //                     getProfileById(authorId, function (err, { name }) {
    //                         if (err) throw err
    //                         var people = state.people()
    //                         people[authorId] = { name }
    //                         state.people.set(people)
    //                     })
    //                 }
    //             }


    //             sbot.blobs.has(hash, function (err, res) {
    //                 if (!res) {
    //                     console.log('miss', err, res)

    //                     S(
    //                         sbot.blobs.get(hash),
    //                         S.collect(function (err, res) {
    //                             console.log('blobs.get', err, res)
    //                         })
    //                     )

    //                     sbot.blobs.want(hash, {}, function(err, res) {
    //                         console.log('want cb', err, res)
    //                     })
    //                 }
    //             })

    //             if (state().postUrls[hash]) return
    //             var newState = {}
    //             newState[hash] = url
    //             state.postUrls.set(xtend(state.postUrls(), newState))

    //             if (post.sync === true) return
    //             var arr = (state.posts() || [])
    //             arr.unshift(post)
    //             state.posts.set(arr)
    //         }, function done (err) {
    //             if (err) return console.log('error', err)
    //             console.log('live done', arguments)
    //         })
    //     )
    // }

    function getUrlForHash (hash, cb) {
        S(
            sbot.blobs.get(hash),
            // Catch(),
            S.collect(function (err, values) {
                if (err) {
                    // return null so the avatar shows as a broken link
                    return cb(null, null)
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

    function setAvatar ({ file, id }, cb) {
        var hasher = createHash('sha256')

        S(
            fileReader(file),
            hasher,
            sbot.blobs.add(function (err, _hash) {
                var hash = '&' + hasher.digest
                if (err) throw err

                var imageUrl = URL.createObjectURL(file)
                sbot.publish({
                    type: 'about',
                    about: id,
                    image: hash
                }, function (err, res) {
                    if (err) return cb(err)
                    cb(null, { imageUrl, hash })
                })
            })
        )
    }

    function getProfileById (id, cb) {
        S(
            sbot.links({
                source: id,
                dest: id,
                rel: 'about',
                values: true
            }),
            S.collect(function (err, msgs) {
                var nameMsgs = msgs.filter(msg => msg.value.content.name)
                var nameMsg = nameMsgs[nameMsgs.length - 1]
                var images = msgs.filter(msg => msg.value.content.image)
                var imageMsg = images[images.length - 1]

                cb(err, {
                    name: nameMsg ? nameMsg.value.content.name : '' + id,
                    image: _.get(imageMsg, 'value.content.image', null)
                })
            })
        )
    }

    // function getAvatarById (id, cb) {
    //     S(
    //         sbot.links({
    //           source: id,
    //           dest: id,
    //           rel: 'about',
    //           values: true
    //         }),
    //         S.collect(function (err, msgs) {
    //             if (err) return cb(err)
    //             console.log('msgs', msgs)
    //             cb(null, msgs)
    //         })
    //     )
    // }

    function getUserPosts (feedId, cb) {
        console.log('** in here**', feedId)
        S(
            sbot.createUserStream({ id: feedId }),
            S.collect(function (err, msgs) {
                if (err) throw err
                var posts = msgs.filter(msg => {
                    return msg.value.content.type === ts.post
                })
                console.log('posts by user', posts)
                cb(null, posts)
            })
        )
    }

    // return a pull stream of all `contact` msgs
    function contacts (cb) {
        return sbot.messagesByType({ type: 'contact' })
    }

    function follow (id, cb) {
        sbot.publish({
            type: 'contact',
            contact: id,
            following: true 
        }, cb)
    }

    function getFollows (myId) {
        return createFollowsStream(myId)

        function createFollowsStream (id) {
            if (!sbot.links) {
                return S.error(new Error('missing sbot.links'))
            }

            return S(
                sbot.links({
                    source: id,
                    rel: 'contact',
                    values: true,
                    reverse: true
                }),
                S.map(function (msg) {
                    return msg && msg.value && msg.value.content
                }),
                S.filter(function (content) {
                    return content && content.type === 'contact'
                }),
                S.unique('contact'),
                S.filter(function (content) {
                    return content.following === true
                }),
                S.map('contact')
            )
        }
    }
}

module.exports = App
