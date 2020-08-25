var evs = require('./EVENTS')

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

        app.liveUpdates(state)
    })



}

module.exports = subscribe
