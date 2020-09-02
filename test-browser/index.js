var test = require('tape')
var start = require('../src/start')
var evs = require('../src/EVENTS')
var Eventual = require('../src/view')
var subscribe = require('../src/subscribe')
var App = require('../src/app')


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
    var rm = _state(function onChange() {
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

test('all done', function (t) {
    _sbot.close(function (err) {
        t.error(err, 'no error')
        t.end()
    })
})
