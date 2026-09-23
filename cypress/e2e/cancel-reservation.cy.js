describe("AgendaYA - Cancelación de reserva", () => {
  beforeEach(() => {
    cy.visit("/");

    cy.get('[data-cy="daily-date-input"]').type("2026-09-23");
    cy.get('[data-cy="search-reservations-button"]').click();
  });

  it("cancela correctamente una reserva confirmada", () => {
    // Arrange
    cy.get('[data-cy="reservation-details-button-reservation-1"]').click();

    cy.get('[data-cy="reservation-details-panel"]').should("be.visible");

    cy.get('[data-cy="reservation-status"]')
      .should("be.visible")
      .and("contain", "Confirmada");

    // Act
    cy.get('[data-cy="cancel-reservation-button"]').click();

    cy.get('[data-cy="cancel-confirmation-modal"]').should("be.visible");

    cy.get('[data-cy="cancel-confirm-button"]').click();

    // Assert
    cy.get('[data-cy="reservation-cancel-success"]')
      .should("be.visible")
      .and("contain", "Reserva cancelada correctamente.");

    cy.get('[data-cy="reservation-card-reservation-1"]')
      .should("be.visible")
      .and("contain", "Cancelada");

    cy.get('[data-cy="reservation-details-panel"]').should("not.exist");
    cy.get('[data-cy="cancel-confirmation-modal"]').should("not.exist");
  });

  it("mantiene la reserva sin cambios si el usuario cancela el modal", () => {
    // Arrange
    cy.get('[data-cy="reservation-details-button-reservation-1"]').click();

    cy.get('[data-cy="cancel-reservation-button"]').click();

    cy.get('[data-cy="cancel-confirmation-modal"]').should("be.visible");

    // Act
    cy.get('[data-cy="cancel-back-button"]').click();

    // Assert
    cy.get('[data-cy="cancel-confirmation-modal"]').should("not.exist");

    cy.get('[data-cy="reservation-details-panel"]').should("be.visible");

    cy.get('[data-cy="reservation-status"]').should("contain", "Confirmada");
  });

  it("impide cancelar una reserva completada", () => {
    // Arrange
    cy.get('[data-cy="reservation-details-button-reservation-3"]').click();

    // Act
    cy.get('[data-cy="cancel-reservation-button"]')
      .should("be.visible")
      .and("be.disabled");

    // Assert
    cy.get('[data-cy="cancel-reservation-button"]').should(
      "contain",
      "Reserva no cancelable",
    );

    cy.get('[data-cy="cancel-confirmation-modal"]').should("not.exist");
  });
});
