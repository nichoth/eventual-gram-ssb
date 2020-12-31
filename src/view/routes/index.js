var Router = require('ruta3')
var Home = require('./home')
var New = require('./new')
var createFeedRoute = require('./feed')
var createPostView = require('./post')
var Pubs = require('./pubs')
var evs = require('../../EVENTS')

function _Router () {
    var router = Router()
    router.addRoute('/', function (match) {
        return { view: Home }
    })

    router.addRoute('/new', () => {
        return { view: New }
    })

    router.addRoute('/pubs', () => {
        return { view: Pubs, events: [evs.route.pubs] }
    })

    // encoded percent sign
    // post route
    router.addRoute('/%25*', function (match) {
        var { splats } = match
        // var postId = splats[0]
        console.log('splats', splats)
        var postId = '%' + decodeURIComponent(splats[0])
        console.log('***postId***', postId)
        return { view: createPostView(postId) }
    })

    // user route
    // router.addRoute('/*', (match) => {
    //     var { splats } = match
    //     var feedId = splats[0]
    //     console.log('**in route**', feedId)
    //     return { view: createFeedRoute(feedId) }
    // })

    return router
}

module.exports = _Router
