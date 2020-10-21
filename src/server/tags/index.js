var codec = require('flumecodec')
var createReduce = require('flumeview-reduce/inject')
var Store = require('flumeview-reduce/store/fs')
var hashtag = require('hashtag')

module.exports = createTagsView

function createTagsView ({ postType }) {
    var tags = {
        name: 'tags',
        version:  7,
        manifest: {
            stream: 'source',
            get: 'async'
        },
        init: init
    }

    return tags

    function init (sbot) {
        var Reduce = createReduce(Store)

        function reducer (acc, { tags, key }) {
            // console.log('**in reducer** acc', acc)
            console.log('**in reducer tags**', tags)
            tags.forEach(function (tag) {
                acc[tag] = acc[tag] || []
                acc[tag].push(key)
            })
            return acc
        }
        function mapper (msg) {
            // console.log('in map', msg)
            if (msg.value.content.type === postType) {
                var tokens = hashtag.parse(msg.value.content.text || '')
                var tags = tokens.tags
                if (tags.length) return { tags, key: msg.key }
            }
            return null
        }
        var initState = {}

        var reduceView = Reduce(7, reducer, mapper, codec.json, initState)
        var view = sbot._flumeUse('tags', reduceView)

        return view
    }
}
