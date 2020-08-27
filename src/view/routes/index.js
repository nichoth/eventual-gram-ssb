var Router = require('ruta3')
var Home = require('./home')
var New = require('./new')

function _Router () {
    var router = Router()
    router.addRoute('/', function (match) {
        return Home
    })

    router.addRoute('/new', () => {
        return New
    })

    return router
}

module.exports = _Router
