// var marked = require('ssb-marked')
var text = 'foo bar #woo # test with h1 [ok woo](/ok-now)'
var hashtag = require('hashtag')

var res = hashtag.parse(text)
console.log('res', res)
