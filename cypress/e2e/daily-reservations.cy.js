describe("AgendaYA - Gestión de Agenda", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("muestra las reservas correspondientes a la fecha seleccionada", () => {
    // Arrange
    cy.get('[data-cy="daily-date-input"]').type("2026-09-23");

    // Act
    cy.get('[data-cy="search-reservations-button"]').click();

    // Assert
    cy.get('[data-cy="reservation-list"]').should("be.visible");

    cy.get('[data-cy="reservation-card-reservation-1"]').should("be.visible");
    cy.get('[data-cy="reservation-card-reservation-2"]').should("be.visible");
    cy.get('[data-cy="reservation-card-reservation-3"]').should("be.visible");

    cy.get('[data-cy="reservation-card-reservation-4"]').should("not.exist");
  });

  it("muestra un mensaje de error si se intenta buscar sin seleccionar una fecha", () => {
    // Arrange
    cy.get('[data-cy="daily-date-input"]').should("have.value", "");

    // Act
    cy.get('[data-cy="search-reservations-button"]').click();

    // Assert
    cy.get('[data-cy="date-error"]')
      .should("be.visible")
      .and("contain", "Seleccioná una fecha para consultar las reservas.");

    cy.get('[data-cy="search-results"]').should("not.exist");
  });
});
