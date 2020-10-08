var evs = require('./EVENTS')
var xtend = require('xtend')
var after = require('after')
var S = require('pull-stream')
var hashtag = require('hashtag')
var series = require('run-series')

// for testing
window.ev = window.ev || {}
window.ev.evs = evs



function subscribe (bus, state, app) {
    bus.on('*', (evName, ev) => {
        console.log('* ev name', evName)
        console.log('* ev data', ev)
    })
    
    bus.on(evs.ok.ok, ev => {
        console.log('ok', ev)
    })

    bus.on(evs.app.start, (ev) => {
        console.log('***start***', ev)

        app.getProfile(function (err, profile) {
            if (err) throw err
            var hash = profile.image
            var { id } = profile
            if (!hash) return state.me.set(profile)

            S(
                app.getFollows(id),
                S.collect(function (err, res) {
                    if (err) throw err
                    state.followed.set(res)
                })
            )

            app.getUrlForHash(hash, function (err, url) {
                // testing
                // getFollows()

                // if (err) throw err
                if (err) return console.log('err profile', err)
                state.avatarUrl.set(url)
                state.me.set(profile)
            })
        })

        app.messages(function (err, msgs) {
            if (err) throw err
            var posts = msgs.map(([hash, url, post]) => post)
            var urls = msgs.reduce(function (acc, [hash, url, post]) {
                acc[hash] = url
                return acc
            }, {})

            var authorIds = posts.map(post => post.value.author)

            var next = after(authorIds.length, function (err, res) {
                if (err) throw err
                state.people.set(res)
            })

            var acc = {}
            authorIds.forEach(function (id) {
                app.getProfileById(id, function (err, person) {
                    if (err) return next(err)
                    var { name, image } = person
                    app.getUrlForHash(image, (err, imgUrl) => {
                        if (err) throw err
                        acc[id] = { name, image, imgUrl }
                        next(null, acc)
                    })
                })
            })

            state.postUrls.set(urls)
            state.posts.set(posts)
        })



        // testing
        // follows are like { from: id, to: id }
        // function getFollows () {
        //     // we don't use S.collect b/c the stream never finishes
        //     S(
        //         app.contacts(),
        //         S.drain(function (msg) {
        //             var fromMe = msg.value.author === state.me().id
        //             if (!fromMe) return
        //             console.log('from me', msg)
        //             var followed = msg.value.content.contact
        //             console.log('followed', followed)
        //             var list = state.followed()
        //             list.unshift(followed)
        //             state.followed.set(list)
        //         })
        //     )
        // }



    })


    bus.on(evs.profile.save, function (newName) {
        console.log('new Name', newName)
        app.setProfile(state().me.id, newName, function (err, name) {
            if (err) throw err
            state.me.set(xtend(state.me(), { name }))
        })
    })

    bus.on(evs.post.new, function ({ image, text }) {
        console.log('*new post*', image, text)

        // TODO
        var { tags } = hashtag.parse(text)
        // first find existing tags
        app.getAllTags(function (err, allTags) {
            if (err) throw err
            // find any existing tag names that match in the list `tags`
            // if there's a match, apply that tag to this message
            // app.applyTags(tagObjs, msgId, function (err, res) {
            //     console.log('tags applied', err, res)
            // })

            // for any without a match, create and name the tag,
            // then apply the tag to this message
            // app.createTags(tags, function (err, _tags) {
            //     if (err) throw err
            //     console.log('created tags', err, _tags)
            //     app.nameTags({ tags: _tags, names: tags }, (err, tagObjs) => {
            //         console.log('named tags', err, tagObjs)
            //     })
            // })
        })

        // do the tags
        app.createTags(tags, function (err, _tags) {
            if (err) throw err
            console.log('created tags', err, _tags)
            app.nameTags({ tags: _tags, names: tags }, (err, tagObjs) => {
                console.log('named tags', err, tagObjs)
                // need msgID here
                app.applyTags(tagObjs, msgId, function (err, res) {
                    console.log('tags applied', err, res)
                })
            })
        })

        app.newPost({ image, text }, function (err, res) {
            if (err) throw err
            var posts = (state.posts() || [])
            posts.unshift(res)
            state.posts.set(posts)
        })
    })

    bus.on(evs.feed.get, function (feedId) {
        console.log('**get feed**', feedId)

        if (state.feeds()[feedId]) return

        app.getUserPosts(feedId, function (err, posts) {
            console.log('**feed**', err, posts)
            var feeds = state.feeds()
            feeds[feedId] = posts
            state.feeds.set(feeds)
        })
    })

    bus.on(evs.profile.setAvatar, function (ev) {
        var file = ev.target.files[0]
        console.log('file', file)

        // bus, state, app

        var { id } = state.me()
        app.setAvatar({ file, id }, function (err, { imageUrl, hash }) {
            if (err) throw err
            state.me.set(xtend(state.me(), {
                image: hash
            }))
            state.avatarUrl.set(imageUrl)
        })
    })

    bus.on(evs.pub.join, function (inviteCode) {
        console.log('start joining a pub', inviteCode)
        app.joinPub(inviteCode, function (err) {
            if (err) throw err
            console.log('pub joined', err)
        })
    })

    bus.on(evs.route.pubs, function () {
        app.getPubs(function (err, pubs) {
            if (err) throw err
            state.pubs.list.set(pubs)
        })
    })

    bus.on(evs.follow.start, function ({ id }) {
        app.follow(id, function (err, res) {
            if (err) throw err
            var followed = res.value.content.contact
            console.log('now following', err, res)
            // need to update state
            var list = state.followed()
            list.unshift(followed)
        })
    })

}

module.exports = subscribe
