var Router = require('ruta3')
var Home = require('./home')

function _Router () {
    var router = Router()
    router.addRoute('/', function (match) {
        return Home
    })

    return router
}

module.exports = _Router
