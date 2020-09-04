var Router = require('ruta3')
var Home = require('./home')
var New = require('./new')
var createFeedRoute = require('./feed')
var createPostView = require('./post')

function _Router () {
    var router = Router()
    router.addRoute('/', function (match) {
        return Home
    })

    router.addRoute('/new', () => {
        return New
    })

    // encoded percent sign
    router.addRoute('/%25*', function (match) {
        var { splats } = match
        // var postId = splats[0]
        console.log('splats', splats)
        var postId = '%' + decodeURIComponent(splats[0])
        console.log('***postId***', postId)
        return createPostView(postId)
    })

    router.addRoute('/*', (match) => {
        var { splats } = match
        var feedId = splats[0]
        console.log('**in route**', feedId)
        return createFeedRoute(feedId)
    })

    return router
}

module.exports = _Router
