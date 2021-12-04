function getCurrentAge(birthdayDate) {
    const birthdayYear = new Date(birthdayDate).getFullYear()
    const currentYear = new Date().getFullYear()
    let age = currentYear - birthdayYear

    if (new Date() < new Date(birthdayDate).setFullYear(new Date().getFullYear())) {
        age = age-1;
    }
    return age
}

Date.prototype.addDays = function (days) {
    this.setDate(this.getDate() + days)
    return this
}

Date.prototype.subDays = function (days) {
    return this.addDays(-days)
}

Date.prototype.subYears = function (years) {
    this.setFullYear(this.getFullYear() - years)
    return this
}

Date.prototype.toISODateString = function () {
    return this.toISOString().split("T")[0]
}

describe('How old are you tests', () => {
    beforeEach(() => {
        cy.visit('/')
        cy.contains('h1', 'How old are you?')
    })

    it('Simple positive test', () => {
        const birthdayDate = '1990-02-10'
        cy.get('#inputName')
            .type('Alisa')
        cy.get('#inputBirthday')
            .type(birthdayDate)
        cy.get('#submitButton')
            .click()
        cy.get('#resultAge')
            .should('contain.text', getCurrentAge(birthdayDate))
    })

    it('Random name with special characters and numbers', () => {
        const name = Math.random().toString(36).substr(2, 10) + ' !;.*() 0123'
        const birthdayDate = '2002-01-12'
        cy.get('#inputName')
            .type(name)
        cy.get('#inputBirthday')
            .type(birthdayDate)
        cy.get('#submitButton')
            .click()
        cy.get('#resultName')
            .should('contain.text', name)
        cy.get('#resultAge')
            .should('contain.text', getCurrentAge(birthdayDate))
    })

    const minimumBirthday = new Date().subYears(121)

    it('Maximum age', () => {
        cy.get('#inputName')
            .type('Olivia Wilde')
        cy.get('#inputBirthday')
            .type(minimumBirthday.toISODateString())
        cy.get('#submitButton')
            .click()
        cy.get('#resultAge')
            .should('contain.text', getCurrentAge(minimumBirthday))
    })

    it('Too old to use it', () => {
        cy.get('#inputName')
            .type('Olivia')
        cy.get('#inputBirthday')
            .type(minimumBirthday.subDays(1).toISODateString())
        cy.get('#submitButton')
            .click()
        cy.get('#help_birthday')
            .should('contain.text', 'you are too old to use it')
    })

    it('Birthday in the future', () => {
        cy.get('#inputName')
            .type('Martin')
        cy.get('#inputBirthday')
            .type(new Date().addDays(1).toISODateString())
        cy.get('#submitButton')
            .click()
        cy.get('#help_birthday')
            .should('contain.text', 'your birthday must be in the past')
    })

})