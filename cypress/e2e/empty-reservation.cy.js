describe("AgendaYA - Búsqueda sin resultados", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("muestra un mensaje indicando que no hay reservas para una fecha sin eventos", () => {
    // Arrange: Preparar el estado ingresando una fecha que sabemos que no tiene reservas mockeadas
    cy.get('[data-cy="daily-date-input"]').type("2026-10-15");

    // Act: Ejecutar la acción principal disparando la búsqueda
    cy.get('[data-cy="search-reservations-button"]').click();

    // Assert: Verificar el resultado esperado (mensaje de lista vacía)
    cy.get('[data-cy="no-reservations-message"]')
      .should("be.visible")
      .and("contain", "No hay reservas para la fecha seleccionada.");
      
    // Verificamos que el contenedor de la lista de tarjetas no se haya renderizado
    cy.get('[data-cy="reservation-list"]').should("not.exist");
  });
});