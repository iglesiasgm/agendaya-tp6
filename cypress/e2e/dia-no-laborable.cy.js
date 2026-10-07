describe("Día no laborable", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("bloquea un día y lo muestra en la lista", () => {
    // Arrange
    const date = "2026-12-25";

    // Act
    cy.get('[data-cy="non-working-date-input"]').type(date);
    cy.get('[data-cy="block-day-button"]').click();

    // Assert
    cy.get('[data-cy="non-working-success"]').should(
      "contain",
      "Día bloqueado correctamente.",
    );
    cy.get('[data-cy="non-working-day-2026-12-25"]').should("exist");
  });

  it("impide bloquear dos veces el mismo día", () => {
    // Arrange
    const date = "2026-12-25";
    cy.get('[data-cy="non-working-date-input"]').type(date);
    cy.get('[data-cy="block-day-button"]').click();

    // Act
    cy.get('[data-cy="non-working-date-input"]').type(date);
    cy.get('[data-cy="block-day-button"]').click();

    // Assert
    cy.get('[data-cy="non-working-date-error"]').should(
      "contain",
      "ya está bloqueado",
    );
  });

  it("muestra error si no se selecciona fecha", () => {
    // Arrange
    // (sin fecha seleccionada)

    // Act
    cy.get('[data-cy="block-day-button"]').click();

    // Assert
    cy.get('[data-cy="non-working-date-error"]').should(
      "contain",
      "Seleccioná una fecha para bloquear.",
    );
  });
});
