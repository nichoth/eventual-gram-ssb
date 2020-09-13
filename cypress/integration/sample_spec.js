var ssbKeys = require('ssb-keys')
var ssbFeed = require('ssb-feed')
var start = require('../../src/start')
var S = require('pull-stream')

// describe('My First Test', () => {
//     it('Does not do much!', () => {
//         expect(true).to.equal(true)
//     })
// })

// describe('My First failing Test', () => {
//     it('Does not do much!', () => {
//         expect(true).to.equal(false)
//     })
// })

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

describe('The app', () => {
    it('loads the home page', () => {
        cy.visit('/')
    })
})

// Need to follow the feed2 and see if the image shows on the home page
describe('a second feed', () => {
    it('should publish', () => {
        start(function (err, { sbot }) {
            if (err) throw err
            var _sbot = sbot
            cy.visit('/')
            console.log('aaaaaaaaaaaaaaaaa')
            console.log('sboooooot', _sbot)
            var alice = ssbKeys.generate()
            var feed = ssbFeed(_sbot, alice)

            function publishAlice () {
                feed.publish({
                    type: 'post',
                    text: 'hello world, I am alice.'
                }, function (err, res) {
                    expect(err).to.not.exist

                    // check if msg 2 exists in feed 1
                    S(
                        _sbot.messagesByType({ type: 'post' }),
                        S.collect((err, msgs) => {
                            expect(err).to.not.exist
                            var post = msgs.find(msg => {
                                return msg.value.author === feed.id
                            })
                            expect(post).to.exist
                        })
                    )
                })
            }

            publishAlice()
        })

    })
})
