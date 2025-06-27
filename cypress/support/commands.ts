/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }

Cypress.Commands.add('clickIngredient', (id: string) => {
  cy.get(`[data-cy=\"${id}\"] button`).click();
});

Cypress.Commands.add('openIngredient', (id: string) => {
  cy.get(`[data-cy=\"${id}\"] a`).click();
});

Cypress.Commands.add('assertIngredientCount', (id: string, count: number) => {
  cy.get(`[data-cy=\"${id}\"]`)
    .find('.counter__num')
    .should('contain', count.toString());
});

Cypress.Commands.add('assertInConstructor', (id: string) => {
  cy.get('[data-cy=burger-constructor]').then(($constructor) => {
    const bunElems = Cypress.$($constructor).find(
      `[data-cy="${id}"][data-type="bun"]`
    );
    if (bunElems.length > 0) {
      expect(bunElems.length).to.equal(2);
      return;
    }
    const ingElems = Cypress.$($constructor).find(`[data-cy="${id}"]`);
    if (ingElems.length > 0) {
      expect(ingElems.length).to.be.at.least(1);
      return;
    }
    throw new Error(`Ingredient with data-cy='${id}' not found in constructor`);
  });
});
