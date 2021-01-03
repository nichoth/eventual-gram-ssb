var ssbKeys = require('ssb-keys')
var ssbFeed = require('ssb-feed')
var S = require('pull-stream')
// var start = require('../../src/start')
var ts = require('../../src/types')
var evs = require('../../src/EVENTS')
// var subscribe = require('../../src/subscribe')

describe('My First Test', () => {
    it('Does not do much!', () => {
        expect(true).to.equal(true)
    })
})

// from application code
var _sbot
var emit
var state

describe('The app', () => {
    it('loads the home page', () => {
        cy.visit('/')
    })

    it('starts', () => {
        cy.window().then(win => {
            // from the application code
            console.log('win app', win.theApp)
            emit = win.theApp.emit
            _sbot = win.theApp.sbot
            state = win.theApp.state
        })
    })
})

describe('a new post', () => {
    it('makes a new post', () => {
        cy.visit('/new').then(() => {

            cy.fixture('iguana.jpg').as('iguana')
            cy.get('#file-input').then(function (el) {
                const blob = Cypress.Blob.base64StringToBlob(this.iguana,
                    'image/jpg')

                const file = new File([blob], 'images/iguana.jpg',
                    { type: 'image/jpg' })

                const list = new DataTransfer()
                list.items.add(file)

                el[0].files = list.files
                el[0].dispatchEvent(new Event('change', { bubbles: true }))

                cy.get('#text').type('foo blob').then(() => {
                    cy.get('button[type=submit]')
                        .click()

                    cy.visit('/').then(() => {
                        cy.get('.post .post-text')
                            .should('contain', 'foo blob')
                    })
                })
            })
        })
    })
})

// Need to follow feed2 and see if the image shows on the home page

describe('a second feed', () => {
    it('should publish', () => {
        console.log('sboooooot', _sbot)
        var alice = ssbKeys.generate()
        var feed = ssbFeed(_sbot, alice)

        console.log('**feed**', feed)

        _sbot.whoami(function (err, info) {
            console.log('ccccccccc', err, info)
        })

        console.log('aaaaaa')

        feed.publish({
            type: ts.post,
            text: 'hello world, I am alice.'
        }, function (err, res) {
            console.log('**in here**', err, res)
            console.log('bbbbbbbb')

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
                })
            )
        })
    })

    // after(() => {
    //     // runs once after all tests in the block
    //     _sbot.close(function (end) {
    //         var err = (end && end !== true)
    //         expect(err).to.be.false
    //     })
    // })
})

// describe('blurbur', () => {
//     it('does the thing', () => {
//         cy.visit('/')
//         cy.window().then((win) => {
//             console.log('win', win)
//         })
//     })
// })
