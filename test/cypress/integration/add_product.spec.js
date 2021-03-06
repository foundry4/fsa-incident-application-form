const SIMS_LOOKUP_DATA = require("../fixtures/sample-dropdown-data.json");
const ADD_PRODUCT = Cypress.config("product");

const options = { force: true };

context(
  "As an incidents officer, I want to know about the products affected, so I can effectively investigate and act.",
  () => {
    beforeEach(() => {
      cy.clearCookies();

      // catches, logs and ignores any load-errors on the page..
      // can probably delete this but worth including in 1st template in case we need it..
      cy.on("uncaught:exception", (err, runnable) => {
        console.log(err.stack);
        return false;
      });

      cy.setupSimsLookups(SIMS_LOOKUP_DATA);
    });

    describe("EN", () => {
      beforeEach(() => {
        cy.visit(ADD_PRODUCT);
      });

      it("should have an add company button", () => {
        cy.get("[data-cy=add-company]").should("contain", "Add Company");
      });

      it("should have a back button", () => {
        cy.get("[data-cy=back]").should("contain", "Previous");
      });

      it("should have a save and continue button", () => {
        cy.get("[data-cy=submit]").should("contain", "Save and Continue");
      });

      it(`should require at least one company`, () => {
        cy.fillInProduct();

        cy.get('[data-cy="submit"]').click(options);

        cy.get('[data-cy="error-summary"]')
          .should("exist")
          .should("contain", "At least one company is required");
      });

      it("should require a product name", () => {
        cy.fillInProduct({
          fieldsToSkip: ["product-name"],
        });

        cy.get('[data-cy="submit"]').click(options);

        cy.get('[data-cy="error-summary"]')
          .should("exist")
          .should("contain", "Product name is required");
      });

      it("should have a valid default selected country", () => {
        cy.get('[data-cy="origin-country"]')
          .find("option:selected")
          .should("have.text", "United Kingdom");

        cy.fillInProduct({
          fieldsToSkip: ["origin-country"],
        });

        cy.get('[data-cy="submit"]').click(options);

        cy.get('[data-cy="error-summary"]')
          .should("exist")
          .should("not.contain", "Country is required");

        cy.get('[data-cy="address.country-errors"]').should("not.exist");
      });

      it(`should enforce validation rules when navigating to the previous page`, () => {
        // country is now default selected to United Kingdom, and is a mandatory field.
        // Validation must always be enforced.

        cy.get('[data-cy="back"]').click(options);

        cy.get('[data-cy="error-summary"]').should("exist");

        cy.url().should("contain", `/${ADD_PRODUCT}`);
      });

      it(`should not allow navigating to the next page if all form fields are empty`, () => {
        cy.get('[data-cy="submit"]').click(options);

        cy.get('[data-cy="error-summary"]').should("exist");
      });
    });

    describe("CY", () => {
      beforeEach(() => {
        cy.visit(`/cy/${ADD_PRODUCT}`);
      });

      it("should have an add company button", () => {
        cy.get("[data-cy=add-company]").should("contain", "Ychwanegu Cwmni");
      });

      it("should have a back button", () => {
        cy.get("[data-cy=back]").should("contain", "Blaenorol");
      });

      it("should have a save and continue button", () => {
        cy.get("[data-cy=submit]").should("contain", "Arbed a Nesaf");
      });

      it(`should require at least one company`, () => {
        cy.fillInProduct();

        cy.get('[data-cy="submit"]').click(options);

        cy.get('[data-cy="error-summary"]')
          .should("exist")
          .should("contain", "Mae angen o leiaf un cwmni");
      });

      it("should require a product name", () => {
        cy.fillInProduct({
          fieldsToSkip: ["product-name"],
        });

        cy.get('[data-cy="submit"]').click(options);

        cy.get('[data-cy="error-summary"]')
          .should("exist")
          .should("contain", "Mae angen enw'r cynnyrch");
      });

      it("should have a valid default selected country", () => {
        cy.get('[data-cy="origin-country"]')
          .find("option:selected")
          .should("have.text", "United Kingdom");

        cy.fillInProduct({
          fieldsToSkip: ["origin-country"],
        });

        cy.get('[data-cy="submit"]').click(options);

        cy.get('[data-cy="error-summary"]')
          .should("exist")
          .should("not.contain", "Mae angen gwlad");

        cy.get('[data-cy="address.country-errors"]').should("not.exist");
      });

      it(`should enforce validation rules when navigating to the previous page`, () => {
        // country is now default selected to United Kingdom, and is a mandatory field.
        // Validation must always be enforced.

        cy.get('[data-cy="back"]').click(options);

        cy.get('[data-cy="error-summary"]').should("exist");

        cy.url().should("contain", `/${ADD_PRODUCT}`);
      });

      it(`should not allow navigating to the next page if all form fields are empty`, () => {
        cy.get('[data-cy="submit"]').click(options);

        cy.get('[data-cy="error-summary"]').should("exist");
      });
    });
  }
);
