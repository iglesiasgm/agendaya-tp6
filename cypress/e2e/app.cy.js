describe("AgendaYA", () => {
  it("abre la aplicación correctamente", () => {
    // Arrange
    cy.visit("/");

    // Act
    // No se requiere una acción para esta prueba inicial.

    // Assert
    cy.get("#root").should("exist");
  });
});
