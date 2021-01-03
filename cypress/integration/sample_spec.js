// var ssbKeys = require('ssb-keys')
// var ssbFeed = require('ssb-feed')
// var S = require('pull-stream')
// var start = require('../../src/start')
// var ts = require('../../src/types')
// var evs = require('../../src/EVENTS')
// var subscribe = require('../../src/subscribe')

// from application code
// these are weird though
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


//     // after(() => {
//     //     // runs once after all tests in the block
//     //     _sbot.close(function (end) {
//     //         var err = (end && end !== true)
//     //         expect(err).to.be.false
//     //     })
//     // })
// })
