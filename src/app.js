var S = require('pull-stream')
var getAvatar = require('ssb-avatar')
var ts = require('./types')
var toURL = require('ssb-serve-blobs/id-to-url')
// var xtend = require('xtend')
// var after = require('after')
var createHash = require('multiblob/util').createHash
var fileReader = require('pull-file-reader')
var _ = {
    get: require('lodash/get')
}
var hashtag = require('hashtag')
var Stag = require('scuttle-tag')
var parallel = require('run-parallel')
// var series = require('run-series')
// var watch = require('mutant/watch')
var getContent = require('ssb-msg-content')
var xtend = require('xtend')

function App (sbot) {
    var stag = Stag(sbot)

    console.log('sbot', sbot)


    // ----------------- testing ----------------------------------
    window.ev = window.ev || {}
    window.ev.alice = sbot.alice
    window.ev.alice._publish = function (text) {
        document.createElement('canvas').toBlob(function (blob) {
            var file = new File([blob], 'canvas.jpg', { type: blob.type })
            var image = file
            text = text || 'foo'

            var hasher = createHash('sha256')

            S(
                fileReader(image),
                // fileReaderStream(image),
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

    // *this takes too long*
    // also renders too many pubs
    // we need to know if we are connected or not and put connected pubs at
    // the top of the list
    // could have UI that lets you connect to pubs in the list (with invite)
    function getPubs (cb) {
        console.log('start getting pubs')
        S(
            sbot.messagesByType({ type: 'pub' }),
            S.collect(function (err, msgs) {
                if (err) return cb(err)
                console.log('pubs here', msgs)
                cb(null, msgs)
            })
        )
    }






    createTags(['my-tag'], function (err, res) {
        // res is an array of tag objects
        console.log('tags created', err, res)
        // getAllTags(function (err, _res) {
        //     console.log('**got all tags**', err, _res)
        // })
        getTagsWithNames(function (err, tags) {
            console.log('**here** tags with names', err, tags)
        })
    })









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
        getFollows,
        createTags,
        nameTags,
        applyTags,
        getAllTags,
        getTagsWithNames
        // getAvatarById
    }

    function joinPub (inviteCode, cb) {
        sbot.invite.accept(inviteCode, cb)
    }

    function tagPost (text, cb) {
        var tags = hashtag(text).filter(function (node) {
            return node.type === 'tag'
        })

        if (!tags.length) return cb(null, null)

        getTagsWithNames(function (err, existingTags) {
            if (err) throw err
            var _tags = tags.map(function (tag) {
                var existingTag = existingTags.find(function ({ name }) {
                    return name === tag
                })
                if (!existingTag) return tag
                return existingTag
            })

            var createThese = _tags.filter(tag => typeof tag === 'string')
            var applyThese = _tags.filter(tag => typeof tag === 'object')
            applyTags(applyThese, msgId, function (err, res) {
                console.log('tags applied', err, res)
            })
            createTags(createThese, function (err, res) {
                console.log('created', err, res)
                applyTags(res, msgId, function (err, res) {
                    console.log('applied new tags', err, res)
                })
            })
        })

    }

    // todo -- cache this for real
    var oldTags
    function getTagsWithNames (cb) {
        if (oldTags) return cb(null, oldTags)
        getAllTags(function (err, _tags) {
            if (err) throw err

            S(
                sbot.messagesByType({ type: 'about' }),
                S.map(function (aboutMsg) {
                    var tag = _tags.find(tagMsg => {
                        return tagMsg.key === getContent(aboutMsg).about
                    })
                    if (!tag) return null
                    return xtend(tag, {
                        value: xtend(tag.value, {
                            content: xtend(tag.value.content, {
                                name: getContent(aboutMsg).name
                            })
                        })
                    })
                }),
                S.filter(tag => _.get(tag, 'value.content.name', null)),
                S.collect(function (err, tagsWithNames) {
                    oldTags = tagsWithNames
                    cb(err, tagsWithNames)
                })
            )
        })
    }

    function getAllTags (cb) {
        // ## tag example ##
        // key: "%ia0w9Wxv3gQkj7oeiVD/aVur+CyKlg6HKjLt9Gy/rok=.sha256"
        // timestamp: 1602137064102
        // value:
        // author: "@JBB7E7zUDjscW1lgUuescqbO/kcUfYfXlwwgY3guAeI=.ed25519"
        // content: {type: "tag", version: 1}
        // hash: "sha256"
        // previous: "%nIjVsKkW6D+eK0soFJekMdEUESP0yonRVVkLGbDRTSw=.sha256"
        // sequence: 29
        // signature: "a8u4DQFnpMq6..."
        // timestamp: 1602137064101

        S(
            sbot.messagesByType({ type: 'tag' }),
            S.collect(function (err, msgs) {
                if (err) return cb(err)
                cb(null, msgs)
            })
        )
    }

    function createTags (tags, cb) {
        if (!tags.length) return cb(null)
        console.log('create tags')

        parallel(tags.map(function (tag) {
            // in here, series of create & name
            return function (_cb) {
                stag.async.create({}, function (err, resCreate) {
                    if (err) throw err
                    stag.async.name({
                        tag: resCreate.key,
                        name: tag
                    }, function (err, resName) {
                        if (err) throw err
                        console.log('**in here**', resName, resCreate)
                        var withName = xtend(resCreate, {
                            value: xtend(resCreate.value, {
                                content: xtend(resCreate.value.content, {
                                    name: resName.value.content.name
                                })
                            })
                        })

                        _cb(null, withName)
                    })
                })
            }
        }), function (err, res) {
            cb(err, res)
        })

        // then apply the tags to the post
    }

    function nameTags (tags, names, cb) {
        parallel(tags.map(function (tag, i) {
            return function (_cb) {
                // todo: need to get tag names
                stag.async.name({ tag, name: names[i] }, _cb)
            }
        }), cb)
    }

    function applyTags (tags, msgId, cb) {
        parallel(tags.map(function ({ key }) {
            return function (_cb) {
                stag.async.apply({
                    tag: key,
                    message: msgId,
                    tagged: true
                }, _cb)
            }
        }), cb)
    }

    function newPost ({ image, text }, cb) {
        // todo
        // in here, parse the message and look for hashtags
        // create the hashtag and apply it to the message


        // do createTags, nameTags, and applyTags



        var hasher = createHash('sha256')

        S(
            fileReader(image),
            // fileReaderStream(image),
            hasher,
            sbot.blobs.add(function (err, _hash) {
                console.log('in blob.add', err, _hash)
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
                }, cb)

                cb(null, { imageUrl, hash })
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
