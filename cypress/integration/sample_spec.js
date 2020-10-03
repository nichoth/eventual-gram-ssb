var ssbKeys = require('ssb-keys')
var ssbFeed = require('ssb-feed')
var S = require('pull-stream')
var start = require('../../src/start')
var ts = require('../../src/types')
var evs = require('../../src/EVENTS')
// var subscribe = require('../../src/subscribe')

describe('My First Test', () => {
    it('Does not do much!', () => {
        expect(true).to.equal(true)
    })
})

// describe('My First Test', () => {
//     it('Visits the Kitchen Sink', () => {
//         cy.visit('https://example.cypress.io')
//     })

//     it('clicking "type" navigates to a new url', () => {
//         cy.visit('https://example.cypress.io')
    
//         cy.contains('type').click()
    
//         // Should be on a new URL which includes '/commands/actions'
//         cy.url().should('include', '/commands/actions')

//         // Get an input, type into it and verify that the value has been updated
//         cy.get('.action-email')
//             .type('fake@email.com')
//             .should('have.value', 'fake@email.com')
//     })
// })

var _sbot

describe('The app', () => {
    it('loads the home page', () => {
        cy.visit('/')
    })

    it('starts', () => {
        start(function (err, { sbot }) {
            expect(err).to.not.exist
            _sbot = sbot
        })
    })
})

// describe('a new post', () => {
//     it('makes a new post', () => {

//         // publish blob without using the UI b/c of bug
//         document.createElement('canvas').toBlob(function (blob) {
//             var file = new File([blob], 'canvas.jpg', { type: blob.type })
//             // var image = file
//             var text = 'hello i am bob'

//             // todo -- get the hash of the file,
//             // call sbot.blobs.add
//             _sbot.publish(evs.post.new, {
//                 type: ts.post,
//                 mentions: [{ link: hash }],
//                 text
//             }, (err, res) => {
//                 console.log('in here', err, res)
//             })
//         }, 'image/jpeg')




//         // bug -- when you go to this link
//         // cy.visit('/new')
//             // .get('a.new-post-icon')
//             // .click()

//         // cy.get('.new-post-icon').click();
//         // cy.get('#file-input').click

//         // document.createElement('canvas').toBlob(function (blob) {
//         //     var file = new File([blob], 'canvas.jpg', { type: blob.type })
//         //     var image = file
//         //     var text = 'foo'
//         //     // _view.emit(evs.post.new, { image, text })
//         // }, 'image/jpeg')
//     })
// })

// Need to follow the feed2 and see if the image shows on the home page
// img needs to be a file like in the browser
describe('a second feed', () => {
    it('should publish', () => {
        cy.visit('/')
        console.log('bbbbbbbbbb', process.env.NODE_ENV)
        console.log('sboooooot', _sbot)
        var alice = ssbKeys.generate()
        var feed = ssbFeed(_sbot, alice)

        function publishAlice () {
            feed.publish({
                type: ts.post,
                text: 'hello world, I am alice.'
            }, function (err, res) {
                expect(err).to.not.exist

                // check if msg 2 exists in feed 1
                S(
                    _sbot.messagesByType({ type: ts.post }),
                    S.collect((err, msgs) => {
                        expect(err).to.not.exist
                        var post = msgs.find(msg => {
                            return msg.value.author === feed.id
                        })
                        expect(post).to.exist
                        expect(post.value.author).to.equal(alice.id)
                        expect(post.value.content.text).to.equal(
                            'hello world, I am alice.')

                        _sbot.close(function (end) {
                            var err = (end && end !== true)
                            expect(err).to.be.false
                        })
                    })
                )
            })
        }

        publishAlice()
    })
})
