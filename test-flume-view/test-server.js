
var sbot = require('ssb-server')
var rimraf = require('rimraf')
var home = require('user-home')
var path = require('path')
var ssbKeys = require('ssb-keys')
var ssbConfigInject = require('ssb-config/inject')
var caps = require('ssb-caps')

function startSSB () {
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
        .call(null, config)

    return _sbot
}

module.exports = startSSB
