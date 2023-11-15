import signIn from '../support/e2e';

Cypress.on('uncaught:exception', (err, runnable) => {
    return false;
});

describe('Sign in tests', () => {
    describe('720p resolution', () => {
        beforeEach(() => {
            cy.viewport(1280, 720);
            signIn('test@mctest.com', 'Test McTest', 'test123');
        });

        it('Enter base weights', () => {
            cy.visit('/');

            cy.get('input[name="dl"]').type('100', { force: true });
            cy.get('input[name="bp"]').type('100', { force: true });
            cy.get('input[name="sq"]').type('100', { force: true });
            cy.get('input[name="op"]').type('100', { force: true });

            cy.get('input[type="submit"]').click();
        });

        it('Check front page', () => {
            cy.visit('/');

            cy.get('table').should('exist');
        });
    });
});
