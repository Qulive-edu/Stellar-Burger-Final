/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable<Subject = any> {
    clickIngredient(id: string): Chainable<any>;
    openIngredient(id: string): Chainable<any>;
    assertIngredientCount(id: string, count: number): Chainable<any>;
    assertInConstructor(id: string): Chainable<any>;
  }
}
