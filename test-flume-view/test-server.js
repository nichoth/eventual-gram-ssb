
var sbot = require('ssb-server')
var rimraf = require('rimraf')
var home = require('user-home')
var path = require('path')
var ssbKeys = require('ssb-keys')
var ssbConfigInject = require('ssb-config/inject')
var caps = require('ssb-caps')

function startSSB () {
    // var appName = 'ssb-ev-TEST-' + Math.random()
    var appName = 'ssb-ev-TEST'

    process.on('exit', function () {
        // rimraf.sync(path.join(home, '.' + appName))
        // console.log('deleted', appName)
        console.log('exit')
    })
    
    console.log('app name', appName)

    var opts = { caps: caps }
    var config = ssbConfigInject(appName, opts)
    var keyPath = path.join(config.path, 'secret')
    config.keys = ssbKeys.loadOrCreateSync(keyPath)
    // error, warning, notice, or info (Defaults to notice)
    config.logging.level = 'notice'

    var _sbot = sbot
        // .use(require('ssb-master'))
        // .use(require('ssb-db'))
        // .use(require('ssb-plugins'))
        // .use(require('ssb-ws'))
        // .use(require('ssb-gossip'))
        // .use(require('ssb-replicate'))
        // .use(require('ssb-backlinks'))
        // .use(require('scuttle-tag'))
        // .use(require('ssb-tags'))
        // .use(require('ssb-blobs'))
        // .use(require('ssb-serve-blobs'))
        // .use(require('ssb-invite'))
        // .use(require('ssb-friends'))
        // .call(null, config)

    return { Sbot: _sbot, config }
}

module.exports = startSSB
