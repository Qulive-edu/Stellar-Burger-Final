import Cypress from 'cypress';

const API = 'https://norma.nomoreparties.space/api';

const filling = '643d69a5c3f7b9001cfa0941';
const firstBun = '643d69a5c3f7b9001cfa093c';
const secondBun = '643d69a5c3f7b9001cfa093d';

beforeEach(() => {
  cy.intercept('GET', `${API}/ingredients`, { fixture: 'ingredients.json' });
  cy.intercept('POST', `${API}/auth/login`, { fixture: 'user.json' });
  cy.intercept('GET', `${API}/auth/user`, { fixture: 'user.json' });
  cy.intercept('POST', `${API}/orders`, { fixture: 'orderResponse.json' });

  cy.visit('/');
  cy.viewport(1440, 800);
  cy.get('#modals').as('modalContainer');
});

describe('Order constructor interactions', () => {
  it('should increment ingredient count when clicked', () => {
    // считаем, что счетчик изначально пуст
    cy.clickIngredient(filling);
    cy.assertIngredientCount(filling, 1);
    cy.assertInConstructor(filling);
  });

  describe('Bun & filling addition', () => {
    it('adds bun then filling', () => {
      cy.clickIngredient(firstBun);
      cy.assertInConstructor(firstBun);
      cy.clickIngredient(filling);
      cy.assertInConstructor(filling);
    });

    it('adds filling then bun', () => {
      cy.clickIngredient(filling);
      cy.assertInConstructor(filling);
      cy.clickIngredient(firstBun);
      cy.assertInConstructor(firstBun);
    });
  });

  describe('Switching buns', () => {
    it('replaces bun when no fillings', () => {
      cy.clickIngredient(firstBun);
      cy.assertInConstructor(firstBun);
      cy.clickIngredient(secondBun);
      cy.assertInConstructor(secondBun);
      cy.get('[data-cy=burger-constructor]')
        .find(`[data-cy="${firstBun}"][data-type="bun"]`)
        .should('not.exist');
    });

    it('replaces bun after adding filling', () => {
      cy.clickIngredient(firstBun);
      cy.assertInConstructor(firstBun);
      cy.clickIngredient(filling);
      cy.assertInConstructor(filling);
      cy.clickIngredient(secondBun);
      cy.assertInConstructor(secondBun);
      cy.get('[data-cy=burger-constructor]')
        .find(`[data-cy="${firstBun}"][data-type="bun"]`)
        .should('not.exist');
      cy.assertInConstructor(filling);
    });
  });
});

describe('Order submission process', () => {
  beforeEach(() => {
    // мокаем авторизацию в localStorage и куках
    window.localStorage.setItem('refreshToken', 'fakeToken');
    cy.setCookie('accessToken', 'fakeAccess');
    cy.getAllLocalStorage().should('not.be.empty');
    cy.getCookie('accessToken').should('exist');
  });

  afterEach(() => {
    // очищаем после теста
    window.localStorage.clear();
    cy.clearAllCookies();
    cy.getAllLocalStorage().should('be.empty');
    cy.getAllCookies().should('be.empty');
  });

  it('submits order and shows confirmation', () => {
    cy.clickIngredient(firstBun);
    cy.clickIngredient(filling);
    cy.get("[data-cy='order-button']").click();
    cy.get('@modalContainer').find('h2').should('contain.text', '38483');
  });
});

describe('Modal windows behavior', () => {
  it('opens ingredient details modal', () => {
    cy.get('@modalContainer').should('be.empty');
    cy.openIngredient(filling);
    // проверяем URL и появление модалки
    cy.url().should('include', filling);
    cy.get('@modalContainer').should('not.be.empty');
  });

  it('closes modal with close button', () => {
    // реальный пользователь нажал крестик
    cy.openIngredient(filling);
    cy.get('@modalContainer').find('button').click();
    cy.get('@modalContainer').should('be.empty');
  });

  it('closes modal by clicking overlay', () => {
    cy.openIngredient(filling);
    cy.get("[data-cy='overlay']").click({ force: true }); // ведь оверлей может быть под другими слоями
    cy.get('@modalContainer').should('be.empty');
  });

  it('closes modal with Escape key', () => {
    cy.openIngredient(filling);
    cy.get('body').trigger('keydown', { key: 'Escape' });
    cy.get('@modalContainer').should('be.empty');
  });
});
