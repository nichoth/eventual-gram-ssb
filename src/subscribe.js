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
            console.log('messages', err, msgs)
            var posts = msgs.map(([hash, url, post]) => post)
            
            var urls = msgs.reduce(function (acc, [hash, url, post]) {
                acc[hash] = url
                return acc
            }, {})

            var authorIds = posts.map(post => post.value.author)

            var next = after(authorIds.length, function (err, res) {
                console.log('afterrrrrrr', err, res)
                if (err) throw err
                state.people.set(res)
            })

            var acc = {}
            authorIds.forEach(function (id) {
                app.getProfileById(id, function (err, { name }) {
                    if (err) return next(err)
                    acc[id] = { name }
                    next(null, acc)
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
            // console.log('in herrererer', err, name)
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

}

module.exports = subscribe
