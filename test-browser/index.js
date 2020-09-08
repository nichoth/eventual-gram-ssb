var test = require('tape')
var start = require('../src/start')
var evs = require('../src/EVENTS')
var Eventual = require('../src/view')
var subscribe = require('../src/subscribe')
var App = require('../src/app')
var ssbKeys = require('ssb-keys')
var ssbFeed = require('ssb-feed')
var S = require('pull-stream')

var _sbot
var _view
var _state
test('doesnt explode', function (t) {
    var { bus, state } = Eventual()
    start(function (err, { sbot }) {
        var app = App(sbot)
        subscribe(bus, state, app)
        t.error(err)
        t.ok(sbot, 'return sbot')
        _sbot = sbot
        _view = bus
        _state = state
        t.end()
    })
})

test('make a new post', function (t) {
    t.plan(2)
    var file
    var rm = _state.posts(function onChange (posts) {
        t.ok(posts[0].value.content.mentions[0], 'should set the state')
        t.equal(posts[0].value.content.text, 'foo', 'should set text')
        rm()
    })

    document.createElement('canvas').toBlob(function (blob) {
        file = new File([blob], 'canvas.jpg', { type: blob.type })
        var image = file
        var text = 'foo'
        _view.emit(evs.post.new, { image, text })
    }, 'image/jpeg')
})

test('set profile', function (t) {
    t.plan(1)
    var rm = _state.me(onChange)
    function onChange (val) {
        t.equal(val.name, 'blob', 'sets username in state')
        rm()
    }
    _view.emit(evs.profile.save, 'blob')
})

test('set avatar', function (t) {
    t.plan(1)
    var rm = _state(function onChange(state) {
        t.ok(_state().me.image, 'has a file hash')
        rm()
    })

    var file = new File(['foo bar'], 'foo.txt')
    _view.emit(evs.profile.setAvatar, {
        target: {
            files: [file]
        }
    })
})

test('a different feed', function (t) {
    t.plan(6)
    var alice = ssbKeys.generate()
    var feed = ssbFeed(_sbot, alice)

    // this is bad because the whoami call isn't guaranteed to happen in the
    // correct order
    // var id
    // _sbot.whoami(function (err, info) {
    //     t.error(err)
    //     id = info.id
    // })

    // follow the second feed
    _sbot.publish({
        type: 'contact',
        contact: feed.id,
        following: true 
    }, function (err, res) {
        t.error(err, 'should not have error')
        publishAlice()
    })

    // write to feed 2
    function publishAlice () {
        feed.publish({
            type: 'post',
            text: 'hello world, I am alice.'
        }, function (err, res) {
            t.error(err, 'should not return error')
            t.equal(res.value.content.text, 'hello world, I am alice.')

            // check if msg 2 exists in feed 1
            S(
                _sbot.messagesByType({ type: 'post' }),
                S.collect((err, msgs) => {
                    t.error(err, 'error')
                    var post = msgs.find(msg => msg.value.author === feed.id)
                    t.ok(post, 'has post')
                })
            )
        })
    }
})

test('all done', function (t) {
    _sbot.close(function (err) {
        t.error(err, 'no error on close')
        t.end()
    })
})
