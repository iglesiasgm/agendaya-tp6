describe("AgendaYA - Filtro de reservas por estado", () => {
  beforeEach(() => {
    cy.visit("/");

    cy.get('[data-cy="daily-date-input"]').type("2026-09-23");
    cy.get('[data-cy="search-reservations-button"]').click();
  });

  it("muestra la cantidad de reservas de cada estado en el filtro", () => {
    // Arrange
    cy.get('[data-cy="status-filter"]').should("be.visible");

    // Act
    // No se requiere acción: el filtro se muestra con los conteos al buscar.

    // Assert
    cy.get('[data-cy="status-filter"]').should("have.value", "ALL");
    cy.get('[data-cy="status-filter"] option[value="ALL"]').should(
      "contain",
      "Todos (3)",
    );
    cy.get('[data-cy="status-filter"] option[value="PENDING"]').should(
      "contain",
      "Pendiente (1)",
    );
    cy.get('[data-cy="status-filter"] option[value="CONFIRMED"]').should(
      "contain",
      "Confirmada (1)",
    );
    cy.get('[data-cy="status-filter"] option[value="CANCELLED"]').should(
      "contain",
      "Cancelada (0)",
    );
  });

  it("muestra solamente las reservas pendientes al filtrar por PENDING", () => {
    // Arrange
    cy.get('[data-cy="reservation-list"]')
      .children()
      .should("have.length", 3);

    // Act
    cy.get('[data-cy="status-filter"]').select("PENDING");

    // Assert
    cy.get('[data-cy="results-count"]').should("contain", "1 reserva");

    cy.get('[data-cy="reservation-card-reservation-2"]')
      .should("be.visible")
      .and("contain", "Pendiente");

    cy.get('[data-cy="reservation-card-reservation-1"]').should("not.exist");
    cy.get('[data-cy="reservation-card-reservation-3"]').should("not.exist");
  });

  it("informa cuando no hay reservas con el estado seleccionado", () => {
    // Arrange
    cy.get('[data-cy="reservation-list"]').should("be.visible");

    // Act
    cy.get('[data-cy="status-filter"]').select("CANCELLED");

    // Assert
    cy.get('[data-cy="no-status-results-message"]')
      .should("be.visible")
      .and("contain", "No hay reservas con el estado seleccionado.");

    cy.get('[data-cy="results-count"]').should("contain", "0 reservas");
    cy.get('[data-cy="reservation-list"]').should("not.exist");
  });

  it("vuelve a mostrar todas las reservas al elegir 'Todos'", () => {
    // Arrange
    cy.get('[data-cy="status-filter"]').select("CONFIRMED");
    cy.get('[data-cy="reservation-list"]')
      .children()
      .should("have.length", 1);

    // Act
    cy.get('[data-cy="status-filter"]').select("ALL");

    // Assert
    cy.get('[data-cy="results-count"]').should("contain", "3 reservas");
    cy.get('[data-cy="reservation-list"]')
      .children()
      .should("have.length", 3);
  });
});
