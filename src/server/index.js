var sbot = require('ssb-server')
var http = require('http')
var url = require('url')
var ws = require('pull-ws/server')
var muxrpc = require('muxrpc')
var S = require('pull-stream')
var rimraf = require('rimraf')
var home = require('user-home')
var path = require('path')
var ssbKeys = require('ssb-keys')
var ssbConfigInject = require('ssb-config/inject')
// var caps = require('./caps.json')
var caps = require('ssb-caps')
var manifest = require('./manifest.json')
var WS_PORT = process.env.WS_PORT || 8000



// testing
var Feed = require('ssb-feed')
var keysAlice = require('../keys-alice.json')


// @TODO check if global sbot is running and use that if possible
function startSSB () {
    // var {
    //     SBOT_SHS,
    //     SBOT_SIGN,
    //     APP_NAME,
    //     NODE_ENV
    // } = process.env

    // use dev database
    var appName = 'ssb-ev'

    if (process.env.APP_NAME) {
        appName += ('-' + process.env.APP_NAME)
    }

    console.log('node env', process.env.NODE_ENV)
    if (process.env.NODE_ENV === 'development' && !process.env.APP_NAME) {
        appName = 'ssb-ev-DEV'
    } else if (process.env.NODE_ENV === 'test') {
        appName = 'ssb-ev-TEST-' + Math.random()
    }

    if (process.env.NODE_ENV === 'test') {
        process.on('exit', function () {
            rimraf.sync(path.join(home, '.' + appName))
        })
    }
    
    console.log('app name', appName)

    var opts = {}
    opts.caps = caps

    var config = ssbConfigInject(appName, opts)
    var keyPath = path.join(config.path, 'secret')
    config.keys = ssbKeys.loadOrCreateSync(keyPath)
    // error, warning, notice, or info (Defaults to notice)
    config.logging.level = 'notice'

    // these are the plugins on the ssb-server readme exmple
    var _sbot = sbot
        // .use(require('ssb-db'))
        // .use(require('ssb-plugins'))
        .use(require('ssb-master'))
        // // .use(require('ssb-ws'))
        .use(require('ssb-gossip'))
        .use(require('ssb-replicate'))
        .use(require('ssb-backlinks'))
        // .use(require('scuttle-tag'))
        .use(require('ssb-tags'))
        .use(require('ssb-blobs'))
        .use(require('ssb-serve-blobs'))
        .use(require('ssb-invite'))
        .use(require('ssb-friends'))
        .call(null, config)

    // .use(require('ssb-private'))
    // .use(require('ssb-about'))
    // .use(require('ssb-contacts'))
    // .use(require('ssb-query'))
    // .use(require('scuttlebot/plugins/invite'))
    // .use(require('scuttlebot/plugins/local'))

    var server = http.createServer(function onRequest (req, res) {
        console.log('got request')
        var { pathname } = url.parse(req.url)
        console.log('req pathname', pathname)
    }).listen(WS_PORT, function (err) {
        if (err) throw err
        console.log('listening on ' + WS_PORT)

        // for electron .fork
        if (process.send) process.send('ok')
    })


    // testing
    _sbot.alice = Feed(_sbot, keysAlice)
    manifest.alice = {
        publish: 'async'
    }




    ws({ server }, function onConnection (wsStream) {
        console.log('got ws connection')

        // arguments are (remote, local)
        var rpcServer = muxrpc(null, manifest)(_sbot)
        var rpcServerStream = rpcServer.createStream(function onEnd (err) {
            if (err) console.log('rpc stream close', err)
        })

        S(wsStream, rpcServerStream, wsStream)
    })

    return _sbot
}

if (require.main === module) {
    startSSB()
}

// for tests in test-browser
process.on('SIGTERM', function () {
    process.exit(0)
})

module.exports = startSSB
