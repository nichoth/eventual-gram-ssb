// need to require the keys b/c they are shared with the server app code
// or could generate in the app & attach them to `window`
var keysAlice = require('../../keys-alice.json')

describe('the main part', () => {
    it('loads the home page', () => {
        cy.visit('/')
    })

    it('has feed 2 in the main view', () => {
        // this depends on an automated post in the server file
        cy.get('.author a')
            .should('contain', keysAlice.public)
    })

    it('starts', () => {
        cy.window().then(win => {
            // from the application code
            console.log('win app', win.theApp)
            // emit = win.theApp.emit
            // _sbot = win.theApp.sbot
            // state = win.theApp.state
        })
    })
})

// i think the _sbot on window might be weird, like it's running
// in a different process from the main tests

describe('a new post', () => {
    it('makes a new post', () => {
        cy.visit('/new').then(() => {

            cy.fixture('iguana.jpg').as('iguana')
            cy.get('#file-input').then(function (el) {
                fileUpload.call(this, 'iguana', 'iguana.jpg', el[0])

                cy.get('#text').type('foo blob').then(() => {
                    cy.get('button[type=submit]')
                        .click().then(() => {
                            // check that we're at the home page
                            cy.get('.route-home')
                                .should('exist')
                        })

                    cy.get('.post .post-text')
                        .should('contain', 'foo blob')
                })
            })

        })
    })
})

describe('username', () => {
    it('can set your username', () => {
        cy.get('.menu .user-name button.edit')
            .click()
            .then(() => {
                cy.get('form input[name="name"]')
                    .type('{selectall}')
                    .type('bork')
                    .then(() => {
                        cy.get('.menu form button[type="submit"]')
                            .click().then(() => {
                                cy.get('.menu .user-name a')
                                    .should('contain', 'bork')
                            })
                    })
            })
    })
})

describe('avatar', () => {
    it('can set a new avatar', () => {
        cy.visit('/').then(() => {

            cy.fixture('hotdognalds.jpg').as('hotdognalds')
            cy.get('#avatar-input').then(function (el) {
                fileUpload.call(this, 'hotdognalds', 'hotdognalds.jpg', el[0])

                cy.get('img.avatar')
                    .should('have.attr', 'src')
                    .should('include', 'localhost')
            })
        })
    })
})

function fileUpload (name, fileName, el) {
    cy.fixture(fileName).as(name)
    const blob = Cypress.Blob.base64StringToBlob(this[name], 'image/jpg')
    const file = new File([blob], 'images/'+ fileName, { type: 'image/jpg' })

    const list = new DataTransfer()
    list.items.add(file)

    el.files = list.files
    el.dispatchEvent(new Event('change', { bubbles: true }))
}

describe('profile route', () => {
    it('has the right stuff in the profle view', () => {
        cy.get('.user-name a').click().then(() => {
            cy.get('h1.user-name')
                .should('exist')
            cy.get('img.avatar-big')
                .should('have.attr', 'src')
                .should('include', 'localhost')
        })
    })
})

describe('follow button', () => {
    it('has a follow button', () => {
        cy.visit('/').then(() => {
            cy.get('.author a').contains(
                // this is alice's public key from the JSON file
                '@L1UBLpbh9CHK329HevfD3c/C5r3Ww4gzjvlDLbNNYN8=.ed25519')
                    .then(() => {
                        cy.get('.post .follow-icon button')
                            .last()
                            .click()
                    })
        })
    })
})
