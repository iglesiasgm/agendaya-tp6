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

  it("muestra todas las reservas cuando no se selecciona ninguna fecha", () => {
    // Arrange
    cy.get('[data-cy="daily-date-input"]').should("have.value", "");

    // Act
    // La fecha es un filtro opcional: sin fecha no hay nada que buscar.

    // Assert
    cy.get('[data-cy="active-filter"]')
      .should("be.visible")
      .and("contain", "Mostrando todas las reservas");

    cy.get('[data-cy="reservation-card-reservation-1"]').should("be.visible");
    cy.get('[data-cy="reservation-card-reservation-2"]').should("be.visible");
    cy.get('[data-cy="reservation-card-reservation-3"]').should("be.visible");
    cy.get('[data-cy="reservation-card-reservation-4"]').should("be.visible");
  });

  it("vuelve a mostrar todas las reservas al limpiar el filtro de fecha", () => {
    // Arrange
    cy.get('[data-cy="daily-date-input"]').type("2026-09-23");
    cy.get('[data-cy="active-filter"]').should("contain", "2026-09-23");
    cy.get('[data-cy="reservation-card-reservation-4"]').should("not.exist");

    // Act
    cy.get('[data-cy="clear-date-filter-button"]').click();

    // Assert
    cy.get('[data-cy="daily-date-input"]').should("have.value", "");
    cy.get('[data-cy="active-filter"]').should(
      "contain",
      "Mostrando todas las reservas",
    );
    cy.get('[data-cy="reservation-card-reservation-4"]').should("be.visible");
  });
});
