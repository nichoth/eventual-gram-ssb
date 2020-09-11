var evs = require('./EVENTS')
var xtend = require('xtend')
var after = require('after')

function subscribe (bus, state, app) {
    bus.on('*', (evName, ev) => {
        console.log('* name', evName)
        console.log('* event', ev)
    })
    
    bus.on(evs.ok.ok, ev => {
        console.log('ok', ev)
    })

    bus.on(evs.app.start, (ev) => {
        console.log('***start***', ev)

        app.getProfile(function (err, profile) {
            if (err) throw err
            var hash = profile.image
            if (!hash) return state.me.set(profile)

            app.getUrlForHash(hash, function (err, url) {
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

        // app.liveUpdates(state)
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

    // bus.on(evs.people.getAvatar, function (ev) {
    //     var { userId } = ev
    //     // bus, state, app
    //     app.getAvatarById(userId, function (err, msgs) {
    //         if (err) throw err
    //         console.log('aaaaa msgs', err, msgs)
    //     })
    // })

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

    bus.on(evs.pub.join, function (invite) {
        console.log('join a pub', invite)
        app.joinPub(invite, function (err) {
            if (err) throw err
            console.log('pub joined', err)
        })
    })

    bus.once(evs.route.pubs, function (ev) {
        app.getPubs(function (err, pubs) {
            console.log('got pubs', err, pubs)
        })
    })

}

module.exports = subscribe
