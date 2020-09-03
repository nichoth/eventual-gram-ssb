var Router = require('ruta3')
var Home = require('./home')
var New = require('./new')
var createFeedRoute = require('./feed')

function _Router () {
    var router = Router()
    router.addRoute('/', function (match) {
        return Home
    })

    router.addRoute('/new', () => {
        return New
    })

    router.addRoute('/*', (match) => {
        var { splats } = match
        var feedId = splats[0]
        console.log('btoa', btoa(feedId))
        return createFeedRoute(feedId)
    })

    return router
}

module.exports = _Router
